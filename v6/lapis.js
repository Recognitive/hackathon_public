/**
 * Browser Lapis host: WASI wasm + embedded virtual filesystem.
 *
 *   import { runLapis } from "./lapis.js";
 *   const { exitCode, stdout, stderr } = await runLapis([
 *     "fizzbuzz", "fizz-buzz", "--inputs", "7", "21", "105",
 *   ]);
 *
 * `files` overlays writable files on the bundled tree, relative to the root, so a
 * document that is not among the bundled commands can run:
 *
 *   await runLapis(["/lapis/work/hello.lson", "Ada"], {
 *     files: { "work/hello.lps": "...", "work/hello.lson": "..." },
 *   });
 */
import {
  WASI,
  WASIProcExit,
  File,
  Directory,
  OpenFile,
  ConsoleStdout,
  PreopenDirectory,
} from "@bjorn3/browser_wasi_shim";

export const ROOT = "/lapis";

function decodeFile(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

/** root.json → a plain tree whose files are decoded once: { name: Uint8Array | tree }. */
export function decodeTree(node) {
  const out = {};
  for (const [name, child] of Object.entries(node.entries)) {
    out[name] = child.type === "file" ? decodeFile(child.data) : decodeTree(child);
  }
  return out;
}

/** The text of every file in one directory of a decoded tree, e.g. "commands/tasks". */
export function filesIn(tree, dir) {
  let node = tree;
  for (const part of dir.split("/").filter(Boolean)) node = node?.[part];
  if (!node || node instanceof Uint8Array) return {};
  const dec = new TextDecoder();
  const out = {};
  for (const [name, child] of Object.entries(node)) {
    if (child instanceof Uint8Array) out[name] = dec.decode(child);
  }
  return out;
}

// Fresh inodes per run: a run may write files, and the next one must not see them.
function toInodes(tree, overlay) {
  const enc = new TextEncoder();
  const merged = structuredClone(tree);
  for (const [rel, content] of Object.entries(overlay || {})) {
    const parts = rel.split("/").filter(Boolean);
    let dir = merged;
    for (const part of parts.slice(0, -1)) {
      if (!dir[part] || dir[part] instanceof Uint8Array) dir[part] = {};
      dir = dir[part];
    }
    dir[parts[parts.length - 1]] = {
      writable: typeof content === "string" ? enc.encode(content) : content,
    };
  }
  const build = (node) =>
    new Map(
      Object.entries(node).map(([name, child]) => {
        if (child instanceof Uint8Array) return [name, new File(child, { readonly: true })];
        if (child.writable) return [name, new File(child.writable)];
        return [name, new Directory(build(child))];
      }),
    );
  return build(merged);
}

// Replaced at publish time so Pages/CDN caches cannot serve a stale FS after a secret change.
const BUILD_ID = "20261104172207";

const loaded = new Map();

/** Fetches and compiles lapis.wasm and decodes root.json, once per base URL. */
export function loadAssets(baseUrl) {
  const base = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
  if (!loaded.has(base)) {
    const q = `?v=${encodeURIComponent(BUILD_ID)}`;
    const promise = (async () => {
      const [wasmRes, rootRes] = await Promise.all([
        fetch(new URL("lapis.wasm" + q, base)),
        fetch(new URL("root.json" + q, base)),
      ]);
      if (!wasmRes.ok) throw new Error(`failed to fetch lapis.wasm: ${wasmRes.status}`);
      if (!rootRes.ok) throw new Error(`failed to fetch root.json: ${rootRes.status}`);
      return {
        wasm: await WebAssembly.compile(await wasmRes.arrayBuffer()),
        tree: decodeTree(await rootRes.json()),
      };
    })();
    promise.catch(() => loaded.delete(base));
    loaded.set(base, promise);
  }
  return loaded.get(base);
}

/**
 * Runs the host once on assets from loadAssets (or built by hand).
 * @param {{wasm: WebAssembly.Module, tree: object}} assets
 * @param {string[]} argv  Lapis argv (no program name)
 * @param {object} [opts]
 * @param {string} [opts.stdin=""]
 * @param {Record<string, string|Uint8Array>} [opts.files]  Overlay, relative to ROOT
 * @param {(chunk: string) => void} [opts.onStdout]
 * @param {(chunk: string) => void} [opts.onStderr]
 */
export async function runWithAssets(assets, argv, opts = {}) {
  const { stdin = "", files, onStdout, onStderr } = opts;
  const stdoutChunks = [];
  const stderrChunks = [];
  const enc = new TextEncoder();
  const stdinBytes = enc.encode(stdin.endsWith("\n") || stdin === "" ? stdin : stdin + "\n");

  const capture = (chunks, onChunk) => {
    const dec = new TextDecoder();
    return new ConsoleStdout((buf) => {
      const text = dec.decode(buf, { stream: true });
      chunks.push(text);
      onChunk?.(text);
    });
  };

  const fds = [
    new OpenFile(new File(stdinBytes)),
    capture(stdoutChunks, onStdout),
    capture(stderrChunks, onStderr),
    new PreopenDirectory(ROOT, toInodes(assets.tree, files)),
  ];

  const wasi = new WASI(["lapis", ...argv], [`LAPIS_ROOT=${ROOT}`], fds, { debug: false });
  const instance = await WebAssembly.instantiate(assets.wasm, {
    wasi_snapshot_preview1: wasi.wasiImport,
  });

  let exitCode = 0;
  try {
    exitCode = wasi.start(instance);
  } catch (e) {
    if (e instanceof WASIProcExit) exitCode = e.code;
    // A Rust panic ends in `unreachable`; report it like a crashed process.
    else if (e instanceof WebAssembly.RuntimeError) {
      stderrChunks.push(`lapis: host crashed (${e.message})\n`);
      exitCode = 134;
    } else throw e;
  }

  return {
    exitCode,
    stdout: stdoutChunks.join(""),
    stderr: stderrChunks.join(""),
  };
}

/**
 * @param {string[]} argv  Lapis argv (no program name), e.g. ["fizzbuzz","fizz-buzz",...]
 * @param {object} [opts]  As runWithAssets, plus:
 * @param {string} [opts.baseUrl="./dist/"]  Where lapis.wasm + root.json live
 */
export async function runLapis(argv, opts = {}) {
  const { baseUrl = new URL("./dist/", import.meta.url).href, ...rest } = opts;
  return runWithAssets(await loadAssets(baseUrl), argv, rest);
}
