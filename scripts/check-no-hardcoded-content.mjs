#!/usr/bin/env node
/**
 * Fails the build when business-variable data is written into component markup
 * instead of content.yaml. Without this the "one source of truth" rule decays.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOTS = ['src/components', 'src/layouts', 'src/pages'];
const ALLOWLIST = new Set(['src/lib/content.ts']);

const RULES = [
  { name: 'telephone link with a literal number', re: /tel:\+?[\d\s()-]{6,}/g },
  { name: 'literal phone number',                 re: /\+43[\s\d/-]{6,}/g },
  { name: 'literal e-mail address',               re: /[\w.+-]+@[\w-]+\.[a-z]{2,}/gi },
  { name: 'opening-hours pattern',                re: /\b\d{1,2}[:.]\d{2}\s*[–\-]\s*\d{1,2}[:.]\d{2}\b/g },
  { name: 'external profile domain',              re: /https?:\/\/(?!(?:www\.)?w3\.org|schema\.org)[a-z0-9.-]+\.[a-z]{2,}/gi },
  { name: 'literal VAT id',                       re: /\bATU\d{8}\b/g }
];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (['.astro', '.ts', '.js'].includes(extname(p))) out.push(p);
  }
  return out;
}

const findings = [];
for (const root of ROOTS) {
  for (const file of walk(root)) {
    if (ALLOWLIST.has(file)) continue;
    const src = readFileSync(file, 'utf8');
    src.split('\n').forEach((line, i) => {
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) return; // skip comments
      for (const rule of RULES) {
        rule.re.lastIndex = 0;
        const m = rule.re.exec(line);
        if (m) findings.push({ file, line: i + 1, rule: rule.name, text: m[0].slice(0, 60) });
      }
    });
  }
}

if (findings.length) {
  console.error('Hard-coded business data found in components.');
  console.error('Move these values into src/data/content.yaml:\n');
  for (const f of findings) console.error(`  ${f.file}:${f.line}  [${f.rule}]  ${f.text}`);
  console.error(`\n${findings.length} finding(s).`);
  process.exit(1);
}
console.log('OK: no hard-coded business data in components.');
