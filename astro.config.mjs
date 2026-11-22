import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://lasheidaspa.com',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'always' },
});
