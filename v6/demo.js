import { runLapis } from "./lapis.js";

const argvEl = document.getElementById("argv");
const stdinEl = document.getElementById("stdin");
const outEl = document.getElementById("out");
const runBtn = document.getElementById("run");

const FIZZ_SECTIONS =
  "fizzbuzz :seven divisible-by 7 :bazz rule Bazz @seven : fizz-buzz --inputs 1 3 5 7 15 21 35 105 --genes @bazz";

/** Shell-ish split that keeps double-quoted segments intact. */
function splitArgv(text) {
  const out = [];
  const re = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|(\S+)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m[1] !== undefined) out.push(m[1].replace(/\\"/g, '"'));
    else if (m[2] !== undefined) out.push(m[2].replace(/\\'/g, "'"));
    else out.push(m[3]);
  }
  return out;
}

async function run() {
  const argv = splitArgv(argvEl.value.trim());
  outEl.classList.remove("err");
  outEl.textContent = "Running…";
  runBtn.disabled = true;
  try {
    const { exitCode, stdout, stderr } = await runLapis(argv, {
      stdin: stdinEl.value,
    });
    const body = [stdout, stderr].filter(Boolean).join("");
    outEl.textContent = body || `(exit ${exitCode}, no output)`;
    if (exitCode !== 0) {
      outEl.classList.add("err");
      outEl.textContent += (body ? "\n" : "") + `exit ${exitCode}`;
    }
  } catch (e) {
    outEl.classList.add("err");
    outEl.textContent = String(e?.stack || e);
  } finally {
    runBtn.disabled = false;
  }
}

const fizzBtn = document.getElementById("sample-fizz");
const wordleBtn = document.getElementById("sample-wordle");

function selectSample(which) {
  fizzBtn.classList.toggle("selected", which === "fizz");
  wordleBtn.classList.toggle("selected", which === "wordle");
}

document.getElementById("run").addEventListener("click", run);
fizzBtn.addEventListener("click", () => {
  argvEl.value = FIZZ_SECTIONS;
  stdinEl.value = "";
  selectSample("fizz");
});
wordleBtn.addEventListener("click", () => {
  argvEl.value = "wordle play";
  stdinEl.value = "train\ncrane\n";
  selectSample("wordle");
});
