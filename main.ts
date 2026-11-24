// Two Lines to Your Past Self — make.fun entry
// u-suga-two-lines-to-your-past-self-f36c83ca
//
// Writes exactly two lines to /output/entry.txt:
//   line 1 — a warning to the writer's past self about one specific moment,
//            in a single sentence;
//   line 2 — one sentence on why that moment mattered and what changed
//            because of it.
//
// The text is fixed and written by this program from the constants below.
// No network, no environment input, no files read: the output is fully
// deterministic, so every run produces the same bytes.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry. Line 1 names one concrete moment — a time, a place, a
// decision, and a sentence said out loud. Line 2 traces the cause and
// effect: the nod, the sale, and the rent that has kept a deposit out
// of reach ever since.
const LINE_1 =
  "When Dad says 'sell the house now' at the kitchen table on Christmas Eve 2019, don't nod along.";
const LINE_2 =
  "That nod sold the only home your mother ever owned, and the rent you have paid since has cost you the deposit on a place of your own.";

// The gate the sealed scorer applies: /output/entry.txt must be UTF-8
// text of 1 to 280 characters, not only white space.
const MAX_CHARS = 280;

function countSentences(line: string): number {
  // A sentence ends with ., ! or ?. The entry's lines each carry exactly
  // one terminal mark, at the very end.
  const marks = line.match(/[.!?]/g);
  return marks === null ? 0 : marks.length;
}

function buildEntry(): string {
  const text = `${LINE_1}\n${LINE_2}`;

  // Gate checks, enforced here so a bad edit fails loudly instead of
  // shipping an invalid entry.
  const chars = [...text].length;
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`entry is ${chars} characters, must be 1 to ${MAX_CHARS}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  const lines = text.split("\n");
  if (lines.length !== 2) {
    throw new Error(`entry must be exactly 2 lines, got ${lines.length}`);
  }
  for (const [index, line] of lines.entries()) {
    if (countSentences(line) !== 1) {
      throw new Error(`line ${index + 1} must be a single sentence: ${line}`);
    }
    if (!/[.!?]$/.test(line)) {
      throw new Error(`line ${index + 1} must end with terminal punctuation`);
    }
  }
  return text;
}

function main(): void {
  const text = buildEntry();
  // The grader provides /output. The program reads nothing from the
  // environment and nothing from disk, so its output depends on nothing
  // but the constants above.
  const outDir = "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, text, "utf8");
  console.log(`wrote ${outPath} (${[...text].length} characters, 2 lines)`);
}

main();
