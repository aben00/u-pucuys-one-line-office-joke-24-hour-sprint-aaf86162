// SPDX-License-Identifier: MIT
// One-Line Office Joke: 24-Hour Sprint
// Entry program (Node 22, no dependencies).
// Writes the entry deterministically to /output/entry.txt, self-checks the
// competition gate (UTF-8 text, 1-200 characters, not only whitespace, one
// line), then reads the file back and verifies it byte-for-byte.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const ENTRY =
  "Our office printer only jams when the deadline is five minutes away \u2014 it's the only thing in this building with a sense of timing.";

const OUTPUT_PATH = process.env.ENTRY_OUTPUT ?? "/output/entry.txt";

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

// Gate, checked before anything is written.
const chars = [...ENTRY];
if (chars.length < 1 || chars.length > 200) {
  fail(`entry is ${chars.length} characters, outside the 1-200 range`);
}
if (ENTRY.trim().length === 0) {
  fail("entry is only whitespace");
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  fail("entry is not a single line");
}
if (ENTRY !== ENTRY.trim()) {
  fail("entry has leading or trailing whitespace");
}
const BYTE_LENGTH = Buffer.byteLength(ENTRY, "utf8");

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, ENTRY, "utf8");

// Read back and verify byte-for-byte: same bytes, same length, same text.
const back = readFileSync(OUTPUT_PATH, "utf8");
if (back !== ENTRY) {
  fail("read-back mismatch: file contents differ from the entry");
}
if (Buffer.byteLength(back, "utf8") !== BYTE_LENGTH) {
  fail("read-back mismatch: byte length differs");
}
if (back !== back.trim() || [...back].length !== chars.length) {
  fail("read-back mismatch: whitespace or character count differs");
}

console.log(`OK: wrote ${chars.length} characters to ${OUTPUT_PATH}`);
console.log(ENTRY);
