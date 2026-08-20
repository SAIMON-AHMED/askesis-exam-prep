/**
 * Reports the JavaScript each prerendered route tells the browser to download, and flags
 * routes that pull in the ~1 MB practice question bank.
 *
 * Run after `npm run build`: npx tsx scripts/bundleReport.ts
 */
import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, relative, sep } from "path";

const NEXT_DIR = ".next";
const CHUNK_DIR = join(NEXT_DIR, "static", "chunks");
const APP_DIR = join(NEXT_DIR, "server", "app");
const BANK_MARKER = /iconoclastic|act-punc-|reg-alg2-/;

if (!existsSync(CHUNK_DIR) || !existsSync(APP_DIR)) {
  console.error("No production build found. Run `npm run build` first.");
  process.exit(1);
}

function walk(dir: string, ext: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full, ext) : full.endsWith(ext) ? [full] : [];
  });
}

const sizeByName = new Map<string, number>();
const bankChunks = new Set<string>();
for (const file of walk(CHUNK_DIR, ".js")) {
  const name = file.split(/[\\/]/).pop()!;
  sizeByName.set(name, statSync(file).size);
  if (BANK_MARKER.test(readFileSync(file, "utf8"))) bankChunks.add(name);
}

interface Row {
  route: string;
  kb: number;
  bankKb: number;
}
const rows: Row[] = [];

for (const htmlFile of walk(APP_DIR, ".html")) {
  const html = readFileSync(htmlFile, "utf8");
  const route =
    "/" +
    relative(APP_DIR, htmlFile)
      .split(sep)
      .join("/")
      .replace(/\.html$/, "")
      .replace(/^index$/, "");

  const referenced = new Set<string>();
  for (const m of html.matchAll(/static\/chunks\/([^"'\s]+?\.js)/g)) {
    referenced.add(m[1].split("/").pop()!);
  }

  let total = 0;
  let bank = 0;
  for (const name of referenced) {
    const size = sizeByName.get(name) ?? 0;
    total += size;
    if (bankChunks.has(name)) bank += size;
  }
  rows.push({ route, kb: Math.round(total / 1024), bankKb: Math.round(bank / 1024) });
}

rows.sort((a, b) => b.kb - a.kb);

console.log("route".padEnd(40) + "JS(KB)".padStart(8) + "   bank(KB)");
console.log("-".repeat(62));
for (const r of rows) {
  console.log(
    r.route.padEnd(40) + String(r.kb).padStart(8) + "   " + (r.bankKb > 0 ? String(r.bankKb) : "-")
  );
}

const offenders = rows.filter((r) => r.bankKb > 0);
console.log(`\nprerendered routes shipping the question bank: ${offenders.length}`);
for (const o of offenders) console.log(`  ${o.route} (+${o.bankKb} KB)`);

// Budget guards the wins from silently regressing when new imports are added.
const BUDGET_KB = 800;
const overBudget = rows.filter((r) => r.kb > BUDGET_KB);
if (overBudget.length) {
  console.log(`\n[FAIL] routes over the ${BUDGET_KB} KB budget:`);
  for (const r of overBudget) console.log(`  ${r.route}: ${r.kb} KB`);
}

const failed = overBudget.length > 0 || offenders.length > 0;
console.log(
  `\n${failed ? "FAIL" : "OK"} — heaviest route ${rows[0].kb} KB (budget ${BUDGET_KB} KB)`
);
process.exit(failed ? 1 : 0);
