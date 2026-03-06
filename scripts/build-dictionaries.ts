/**
 * Build script: uses the `datapackage` library to consume data from the
 * unique-names-data repository and generates tree-shakable TypeScript constants.
 *
 * Usage: npx tsx scripts/build-dictionaries.ts
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { Package } = require("datapackage");

const DATAPACKAGE_URL =
  "https://raw.githubusercontent.com/s-celles/unique-names-data/main/datapackage.json";

const DICTIONARIES = [
  "adjectives",
  "animals",
  "colors",
  "celestial",
  "nature",
  "science",
  "numbers",
  "nato",
] as const;

const OUT_DIR = join(import.meta.dirname, "..", "src", "dictionaries");

/**
 * Extract the "word" column from rows read by the datapackage library.
 */
function extractWords(rows: Record<string, unknown>[]): string[] {
  return rows
    .map((row) => String(row["word"] ?? "").trim())
    .filter((w) => w.length > 0);
}

function generateTsFile(constName: string, words: string[]): string {
  const items = words.map((w) => `  ${JSON.stringify(w)},`).join("\n");
  return `/** Auto-generated — do not edit. Run \`npm run build:dictionaries\` to regenerate. */\nexport const ${constName}: readonly string[] = [\n${items}\n] as const;\n`;
}

async function main(): Promise<void> {
  mkdirSync(OUT_DIR, { recursive: true });

  console.log("Loading datapackage.json from unique-names-data...\n");
  const pkg = await Package.load(DATAPACKAGE_URL);

  const allWords: Record<string, string[]> = {};

  for (const name of DICTIONARIES) {
    const resource = pkg.getResource(name);
    if (!resource) {
      throw new Error(`Resource "${name}" not found in datapackage.json`);
    }
    const rows = await resource.read({ keyed: true });
    const words = extractWords(rows as Record<string, unknown>[]);
    allWords[name] = words;

    const constName = name.toUpperCase();
    const content = generateTsFile(constName, words);
    const outFile = join(OUT_DIR, `${name}.ts`);
    writeFileSync(outFile, content, "utf-8");
    console.log(`  ✓ ${name}.ts (${words.length} words)`);
  }

  // NOUNS = animals ∪ celestial ∪ science ∪ nature (unique, sorted)
  const nounsSet = new Set<string>([
    ...(allWords["animals"] ?? []),
    ...(allWords["celestial"] ?? []),
    ...(allWords["science"] ?? []),
    ...(allWords["nature"] ?? []),
  ]);
  const nouns = [...nounsSet].sort();
  const nounsContent = generateTsFile("NOUNS", nouns);
  writeFileSync(join(OUT_DIR, "nouns.ts"), nounsContent, "utf-8");
  console.log(`  ✓ nouns.ts (${nouns.length} words)`);

  // Generate barrel index.ts
  const indexLines: string[] = [
    "/** Auto-generated — do not edit. Run `npm run build:dictionaries` to regenerate. */",
  ];
  for (const name of DICTIONARIES) {
    indexLines.push(
      `export { ${name.toUpperCase()} } from "./${name}.js";`,
    );
  }
  indexLines.push('export { NOUNS } from "./nouns.js";');
  indexLines.push("");
  writeFileSync(join(OUT_DIR, "index.ts"), indexLines.join("\n"), "utf-8");
  console.log("  ✓ index.ts (barrel)");

  console.log("\nDone!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
