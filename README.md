# lasheidaspa.com (Astro rebuild)

Static Astro site for La Sheida Spa, Leesburg VA. Deploys to Cloudflare Pages.

- `npm install`, `npm run dev`, `npm run build` (output: `dist/`)
- Cloudflare Pages: build command `npm run build`, output directory `dist`
- Menu and business details: `src/data/services.ts` (single source of truth)
- Page plan: `SERVICES-ARCHITECTURE.md`
- Dev builds carry `<meta name="robots" content="noindex">` in `src/layouts/Base.astro`; remove at launch.

Status: homepage proof of concept only. Service pages, /services/ menu, and social links are still to build.

## Photos
Photos come from the current WordPress site. `.github/workflows/import-images.yml` runs
`scripts/fetch-images.mjs` on GitHub, which downloads the files listed in `scripts/images.json`,
writes 800w/1600w WebP into `public/images/`, and commits them. Run it from the Actions tab
(or it runs automatically when the image list changes). Most are 2022 photos of the previous
studio: replace them with new Salon Lofts photos when available.
