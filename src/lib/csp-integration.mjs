import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createHash } from 'node:crypto';

const PLACEHOLDER = '__CSP_SCRIPT_HASHES__';

function htmlFiles(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...htmlFiles(p));
    else if (extname(p) === '.html') out.push(p);
  }
  return out;
}

/**
 * Astro inlines small module scripts, which a strict `script-src 'self'` would
 * block. Rather than weaken the policy with 'unsafe-inline', hash every inline
 * script after the build and write the hashes into the CSP. Regenerated on each
 * build, so the policy cannot drift out of sync with the scripts.
 */
export default function cspHashes() {
  return {
    name: 'csp-inline-script-hashes',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const root = dir.pathname.replace(/\/$/, '');
        for (const file of htmlFiles(root)) {
          let html = readFileSync(file, 'utf8');
          if (!html.includes(PLACEHOLDER)) continue;

          const hashes = new Set();
          const re = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g;
          let m;
          while ((m = re.exec(html)) !== null) {
            if (/type=["']application\/ld\+json["']/.test(m[1])) continue; // data, not executed
            const digest = createHash('sha256').update(m[2], 'utf8').digest('base64');
            hashes.add(`'sha256-${digest}'`);
          }

          html = html.replace(PLACEHOLDER, [...hashes].join(' '));
          writeFileSync(file, html);
          logger.info(`CSP: ${hashes.size} inline script hash(es) written into ${file.split('/').pop()}`);
        }
      }
    }
  };
}
