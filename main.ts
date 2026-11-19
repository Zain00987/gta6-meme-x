// gta6-meme-x-01 entry (Node 22, standard library only).
//
// The entry itself is the X post: one GTA 6 meme picture plus its text.
// This program does the single mechanical job the gate needs: it takes
// POST.json — the file at the repository root that names the post's
// address on X — and places an exact copy of it in the output directory
// so the house can read it. Nothing else is written.
//
// It touches no network, reads no clock, and reads no file outside the
// repository, so two runs always write the same bytes.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
//
// On success it prints nothing. POST.json still holds the starter's
// placeholder address until the real post goes up and its URL is filled in.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(botDir, 'POST.json');
if (!existsSync(source)) {
  console.error(`POST.json not found in ${botDir}`);
  process.exit(1);
}

const text = readFileSync(source, 'utf8');
let parsed;
try {
  parsed = JSON.parse(text);
} catch {
  console.error('POST.json is not valid JSON');
  process.exit(1);
}
if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
  console.error('POST.json must be a JSON object naming the post');
  process.exit(1);
}
// The address must be a real X status URL, or the house cannot read the
// post: https://x.com/<handle>/status/<digits>, with an optional trailing
// slash. A placeholder or a mistyped address fails here instead of being
// copied on blindly.
const urlPattern = /^https:\/\/x\.com\/[A-Za-z0-9_]+\/status\/\d+\/?$/;
if (typeof parsed.url !== 'string' || !urlPattern.test(parsed.url)) {
  console.error('POST.json url must be an X status URL like https://x.com/<handle>/status/<id>');
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, 'POST.json'), text);
