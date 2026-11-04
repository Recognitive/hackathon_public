/** Shell-ish split that keeps single- and double-quoted segments intact. */
export function splitArgv(text) {
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
