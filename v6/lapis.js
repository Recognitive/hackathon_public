/**
 * Browser Lapis host: WASI wasm + embedded virtual filesystem.
 *
 *   import { runLapis } from "./lapis.js";
 *   const { exitCode, stdout, stderr } = await runLapis([
 *     "fizzbuzz", "fizz-buzz", "--inputs", "7", "21", "105",
 *   ]);
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

const ROOT = "/lapis";

function decodeFile(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function inodeFromJson(node) {
  if (node.type === "file") {
    return new File(decodeFile(node.data), { readonly: true });
  }
  const kids = Object.entries(node.entries).map(([name, child]) => [
    name,
    inodeFromJson(child),
  ]);
  return new Directory(kids);
}

// Replaced at publish time so Pages/CDN caches cannot serve a stale FS after a secret change.
const BUILD_ID = "20261103004829";

async function loadAssets(baseUrl) {
  const base = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
  const q = `?v=${encodeURIComponent(BUILD_ID)}`;
  const [wasmRes, rootRes] = await Promise.all([
    fetch(new URL("lapis.wasm" + q, base)),
    fetch(new URL("root.json" + q, base)),
  ]);
  if (!wasmRes.ok) throw new Error(`failed to fetch lapis.wasm: ${wasmRes.status}`);
  if (!rootRes.ok) throw new Error(`failed to fetch root.json: ${rootRes.status}`);
  return {
    wasm: await WebAssembly.compile(await wasmRes.arrayBuffer()),
    root: await rootRes.json(),
  };
}

/**
 * @param {string[]} argv  Lapis argv (no program name), e.g. ["fizzbuzz","fizz-buzz",...]
 * @param {object} [opts]
 * @param {string} [opts.baseUrl="./dist/"]  Where lapis.wasm + root.json live
 * @param {(chunk: string) => void} [opts.onStdout]
 * @param {(chunk: string) => void} [opts.onStderr]
 * @param {string} [opts.stdin=""]
 */
export async function runLapis(argv, opts = {}) {
  const {
    baseUrl = new URL("./dist/", import.meta.url).href,
    onStdout,
    onStderr,
    stdin = "",
  } = opts;

  const { wasm, root } = await loadAssets(baseUrl);
  const stdoutChunks = [];
  const stderrChunks = [];
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const stdinBytes = enc.encode(stdin.endsWith("\n") || stdin === "" ? stdin : stdin + "\n");

  const capture = (chunks, onChunk) =>
    new ConsoleStdout((buf) => {
      const text = dec.decode(buf, { stream: true });
      chunks.push(text);
      onChunk?.(text);
    });

  const fds = [
    new OpenFile(new File(stdinBytes)),
    capture(stdoutChunks, onStdout),
    capture(stderrChunks, onStderr),
    new PreopenDirectory(ROOT, inodeFromJson(root).contents),
  ];

  const args = ["lapis", ...argv];
  const env = [`LAPIS_ROOT=${ROOT}`];
  const wasi = new WASI(args, env, fds, { debug: false });

  const instance = await WebAssembly.instantiate(wasm, {
    wasi_snapshot_preview1: wasi.wasiImport,
  });

  let exitCode = 0;
  try {
    exitCode = wasi.start(instance);
  } catch (e) {
    if (e instanceof WASIProcExit) exitCode = e.code;
    else throw e;
  }

  return {
    exitCode,
    stdout: stdoutChunks.join(""),
    stderr: stderrChunks.join(""),
  };
}
