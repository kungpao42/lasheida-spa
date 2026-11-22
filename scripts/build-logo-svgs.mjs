// Builds logo SVG variants + favicon/OG images from brand-source/paths.json (output of trace-logo.mjs).
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';
const p = JSON.parse(await readFile('brand-source/paths.json'));
const GOLD = p.goldHex, PURPLE = p.purpleHex, DARK = '#4a4048', LIGHT = '#f5f2f6', BLUSH = '#ecd0cc', PLUM = '#3a1e32';
await mkdir('public/brand', { recursive: true });

const paths = (c) => `<path fill="${c.gold}" fill-rule="evenodd" d="${p.gold}"/><path fill="${c.purple}" fill-rule="evenodd" d="${p.purple}"/><path fill="${c.dark}" fill-rule="evenodd" d="${p.dark}"/>`;
const svg = (vb, body, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"${extra}>${body}</svg>`;

// regions in source px (from measuring the trace)
const MARK = [418, 250, 604, 700];        // x, y, w, h  (face)
const WORD = [450, 940, 560, 190];        // script + underline + SPA

const brand = { gold: GOLD, purple: PURPLE, dark: DARK };
const onDark = { gold: GOLD, purple: LIGHT, dark: BLUSH };

// stacked (full) logo
const stacked = (c) => svg(`${MARK[0]-20} ${MARK[1]-10} ${Math.max(MARK[2], WORD[2])+40} ${WORD[1]+WORD[3]-MARK[1]+20}`, paths(c));
// horizontal: mark left, wordmark right (nested svgs crop the same artwork)
const horizontal = (c) => {
  const mh = 100, mw = mh * MARK[2] / MARK[3];
  const wh = 62, ww = wh * WORD[2] / WORD[3];
  const W = mw + 14 + ww;
  return svg(`0 0 ${W.toFixed(1)} ${mh}`,
    `<svg x="0" y="0" width="${mw.toFixed(1)}" height="${mh}" viewBox="${MARK.join(' ')}">${paths(c)}</svg>` +
    `<svg x="${(mw + 14).toFixed(1)}" y="${(mh - wh) / 2 + 4}" width="${ww.toFixed(1)}" height="${wh}" viewBox="${WORD.join(' ')}">${paths(c)}</svg>`);
};
const mark = (c) => svg(MARK.join(' '), paths(c));

const out = {
  'logo-horizontal.svg': horizontal(brand),
  'logo-horizontal-light.svg': horizontal(onDark),
  'logo-stacked.svg': stacked(brand),
  'logo-stacked-light.svg': stacked(onDark),
  'mark-gold.svg': mark(brand),
};
for (const [f, s] of Object.entries(out)) await writeFile(`public/brand/${f}`, s);

// favicon: gold mark on plum disc
const fav = svg('0 0 64 64', `<circle cx="32" cy="32" r="32" fill="${PLUM}"/><svg x="9" y="7" width="46" height="50" viewBox="${MARK.join(' ')}">${paths(onDark)}</svg>`);
await writeFile('public/favicon.svg', fav);
await sharp(Buffer.from(fav)).resize(180).png().toFile('public/apple-touch-icon.png');
await sharp(Buffer.from(fav)).resize(32).png().toFile('public/favicon-32.png');

// Open Graph 1200x630
const ogLogo = await sharp(Buffer.from(stacked(onDark))).resize({ height: 430 }).png().toBuffer();
const meta = await sharp(ogLogo).metadata();
const og = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="${PLUM}"/>
  <text x="620" y="270" font-family="Bodoni Moda, Didot, Georgia, serif" font-size="52" fill="${LIGHT}">Eyebrow threading,</text>
  <text x="620" y="332" font-family="Bodoni Moda, Didot, Georgia, serif" font-size="52" fill="${LIGHT}">facials &amp; waxing</text>
  <text x="620" y="400" font-family="Hanken Grotesk, Helvetica, Arial, sans-serif" font-size="28" fill="${BLUSH}">Inside Salon Lofts, Leesburg, VA</text>
  <line x1="620" y1="430" x2="820" y2="430" stroke="${GOLD}" stroke-width="2"/></svg>`);
await sharp(og).composite([{ input: ogLogo, left: Math.round(300 - meta.width / 2), top: 100 }]).jpeg({ quality: 86 }).toFile('public/og-image.jpg');
console.log('done', Object.keys(out));
