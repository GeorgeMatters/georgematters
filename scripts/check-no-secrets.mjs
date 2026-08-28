#!/usr/bin/env node
/** Verify no credential-shaped strings reached the build output. */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const PATTERNS = [
  [/sk-[A-Za-z0-9]{16,}/g, 'OpenAI-style key'],
  [/gh[pousr]_[A-Za-z0-9]{20,}/g, 'GitHub token'],
  [/AIza[A-Za-z0-9_-]{20,}/g, 'Google API key'],
  [/AKIA[0-9A-Z]{12,}/g, 'AWS access key id'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/g, 'private key'],
  [/xox[baprs]-[A-Za-z0-9-]{10,}/g, 'Slack token']
];
const TEXT = new Set(['.html', '.js', '.mjs', '.css', '.json', '.xml', '.txt', '.map']);

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (TEXT.has(p.slice(p.lastIndexOf('.')))) out.push(p);
  }
  return out;
}

let hits = 0;
for (const file of walk('dist')) {
  const src = readFileSync(file, 'utf8');
  for (const [re, label] of PATTERNS) {
    re.lastIndex = 0;
    const m = re.exec(src);
    if (m) { console.error(`  ${file}: possible ${label}: ${m[0].slice(0, 12)}…`); hits++; }
  }
}
if (hits) { console.error(`\n${hits} potential secret(s) in dist/.`); process.exit(1); }
console.log('OK: no credential patterns in build output.');
