import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static output — Vercel picks this up with zero configuration.
// `site` is the public address; it feeds the sitemap and canonical URLs.
export default defineConfig({
  site: 'https://skylar-gu.vercel.app',
  integrations: [sitemap()],
});
