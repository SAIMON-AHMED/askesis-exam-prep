/**
 * Breaks down which chunks a given route loads and what heavy libraries sit inside them.
 *
 * Run after `npm run build`: npx tsx scripts/chunkInspect.ts [routeHtml]
 */
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const route = process.argv[2] ?? "login";
const html = readFileSync(join(".next", "server", "app", `${route}.html`), "utf8");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((e) => {
    const full = join(dir, e);
    return statSync(full).isDirectory() ? walk(full) : full.endsWith(".js") ? [full] : [];
  });
}

const byName = new Map<string, string>();
for (const f of walk(join(".next", "static", "chunks"))) {
  byName.set(f.split(/[\\/]/).pop()!, f);
}

const MARKERS = [
  "katex",
  "react-markdown",
  "micromark",
  "mdast",
  "recharts",
  "d3-scale",
  "victory",
  "axios",
  "iconoclastic",
];

const names = new Set(
  [...html.matchAll(/static\/chunks\/([^"'\s]+?\.js)/g)].map((m) => m[1].split("/").pop()!)
);

const rows = [...names]
  .map((name) => {
    const path = byName.get(name);
    if (!path) return null;
    const content = readFileSync(path, "utf8");
    return {
      kb: Math.round(statSync(path).size / 1024),
      name,
      contains: MARKERS.filter((m) => content.includes(m)).join(", ") || "-",
    };
  })
  .filter(Boolean) as { kb: number; name: string; contains: string }[];

rows.sort((a, b) => b.kb - a.kb);

console.log(`route /${route} loads ${rows.length} chunks\n`);
console.log("KB".padStart(6) + "  chunk".padEnd(24) + "contains");
console.log("-".repeat(70));
for (const r of rows.slice(0, 12)) {
  console.log(String(r.kb).padStart(6) + "  " + r.name.padEnd(22) + r.contains);
}
console.log("\ntotal KB: " + rows.reduce((s, r) => s + r.kb, 0));
