import fs from "node:fs";

const raw = fs.readFileSync(".env.local", "utf8");
const map = {};
for (const line of raw.split(/\r?\n/)) {
  if (!line || line.trim().startsWith("#") || !line.includes("=")) continue;
  const i = line.indexOf("=");
  let k = line.slice(0, i).trim();
  let v = line.slice(i + 1).trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1);
  }
  map[k] = v;
}

const id = map.RAZORPAY_KEY_ID || "";
const sec = map.RAZORPAY_KEY_SECRET || "";
const ph = (v) =>
  !v ||
  /xxxxxxxx|your_|replace/i.test(v) ||
  v === "rzp_live_xxx" ||
  v === "rzp_test_xxx";

const ok = Boolean(
  id &&
    sec &&
    !ph(id) &&
    !ph(sec) &&
    (id.startsWith("rzp_live_") || id.startsWith("rzp_test_")),
);

console.log(
  JSON.stringify(
    {
      hasId: Boolean(id),
      hasSec: Boolean(sec),
      idLen: id.length,
      secLen: sec.length,
      idStartsLive: id.startsWith("rzp_live_"),
      idStartsTest: id.startsWith("rzp_test_"),
      idPh: ph(id),
      secPh: ph(sec),
      ok,
      idHasSpace: /\s/.test(id),
      secHasSpace: /\s/.test(sec),
      bom: raw.charCodeAt(0) === 0xfeff,
      razorKeys: Object.keys(map).filter((k) => /razor/i.test(k)),
    },
    null,
    2,
  ),
);
