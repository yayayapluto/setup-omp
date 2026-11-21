import fs from "node:fs"

const md = fs.readFileSync("SETUP.md", "utf8")
let ok = true
const fail = (m) => { console.error(m); ok = false }

for (const f of ["SETUP.md", "LICENSE"]) {
  if (!fs.existsSync(f)) fail(`missing ${f}`)
}
if (!md.startsWith("# SETUP.md")) fail("title missing")
if (!md.includes("175-skill catalog")) fail("catalog claim missing")

// count catalog rows inside section 13 only
let inSection = false
let rows = 0
for (const line of md.split("\n")) {
  if (line.startsWith("## 13. Skills catalog")) inSection = true
  else if (inSection && line.startsWith("## 14.")) inSection = false
  else if (inSection && line.startsWith("| `")) rows++
}
if (rows !== 163) fail(`catalog rows ${rows}, expect 163`)

// no real secrets
if (/apiKey:\s*(nsk_|sk-[A-Za-z0-9]{20})/.test(md)) fail("secret-shaped literal in SETUP.md")

console.log(ok ? "setup-omp smoke: OK" : "setup-omp smoke: FAIL")
process.exit(ok ? 0 : 1)