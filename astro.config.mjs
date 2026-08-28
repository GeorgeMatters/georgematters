// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const base = process.env.PUBLIC_SITE_BASE || '/';

export default defineConfig({
  site: 'https://georgematters.at',
  base,
  integrations: [sitemap()]
});
