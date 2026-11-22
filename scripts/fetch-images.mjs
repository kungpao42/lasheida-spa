// One-time import of photos from the current WordPress site into public/images/.
// Runs in GitHub Actions (see .github/workflows/import-images.yml). Writes 800w and 1600w WebP.
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import sharp from 'sharp';

const cfg = JSON.parse(await readFile(new URL('./images.json', import.meta.url)));
const out = new URL('../public/images/', import.meta.url);
await mkdir(out, { recursive: true });

for (const [name, sources] of Object.entries(cfg.images)) {
  try { await access(new URL(`${name}-1600.webp`, out)); console.log(`skip ${name}`); continue; } catch {}
  let buf;
  for (const src of sources) {
    const res = await fetch(cfg.base + src, { headers: { 'user-agent': 'lasheidaspa-redesign-import' } });
    if (res.ok) { buf = Buffer.from(await res.arrayBuffer()); console.log(`got ${name} <- ${src}`); break; }
    console.log(`miss ${src} (${res.status})`);
  }
  if (!buf) { console.error(`FAILED ${name}`); process.exitCode = 1; continue; }
  for (const w of [800, 1600]) {
    await sharp(buf).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 74 }).toFile(new URL(`${name}-${w}.webp`, out).pathname);
  }
}

// Raw brand files (logo sources), saved untouched to brand-source/ for tracing.
const rawDir = new URL('../brand-source/', import.meta.url);
await mkdir(rawDir, { recursive: true });
for (const [file, url] of Object.entries(cfg.raw ?? {})) {
  try { await access(new URL(file, rawDir)); console.log(`skip ${file}`); continue; } catch {}
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 lasheidaspa-redesign-import' } });
  if (!res.ok) { console.error(`FAILED ${file} (${res.status})`); process.exitCode = 1; continue; }
  await mkdir(new URL('.', new URL(file, rawDir)), { recursive: true });
  await writeFile(new URL(file, rawDir), Buffer.from(await res.arrayBuffer()));
  console.log(`got ${file}`);
}
