// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cspHashes from './src/lib/csp-integration.mjs';

const base = process.env.PUBLIC_SITE_BASE || '/';

export default defineConfig({
  site: 'https://georgematters.at',
  base,
  integrations: [sitemap(), cspHashes()],
  vite: {
    build: {
      // Never inline fonts as data: URIs. Inlined fonts are blocked by
      // `font-src 'self'` and cannot be cached independently of the CSS.
      assetsInlineLimit: (filePath) => (filePath.endsWith('.woff2') ? false : undefined)
    }
  }
});
