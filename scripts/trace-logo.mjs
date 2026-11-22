// One-off: trace brand-source/logo-ig-1440.jpg into SVGs (gold mark, purple wordmark) in src/assets/brand/.
import sharp from 'sharp';
import potrace from 'potrace';
import { writeFile, mkdir } from 'node:fs/promises';
import { promisify } from 'node:util';
const trace = promisify(potrace.trace);

const src = 'brand-source/logo-ig-1440.jpg';
const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;

// classify pixels: gold (r>g>b, warm), purple (r>g, b>g), else white
const gold = Buffer.alloc(W * H), purple = Buffer.alloc(W * H), dark = Buffer.alloc(W * H);
let gs = [0,0,0,0], ps = [0,0,0,0];
for (let i = 0; i < W * H; i++) {
  const r = data[i*3], g = data[i*3+1], b = data[i*3+2];
  const isGold = r - b > 45 && g - b > 25 && r < 235;
  const isPurple = !isGold && r - g > 35 && b - g > 20;
  const isDark = !isGold && !isPurple && Math.max(r, g, b) < 150 && Math.max(r, g, b) - Math.min(r, g, b) < 40;
  gold[i] = isGold ? 0 : 255; purple[i] = isPurple ? 0 : 255; dark[i] = isDark ? 0 : 255;
  if (isGold) { gs[0]+=r; gs[1]+=g; gs[2]+=b; gs[3]++; }
  if (isPurple) { ps[0]+=r; ps[1]+=g; ps[2]+=b; ps[3]++; }
}
const hex = (s) => '#' + s.slice(0,3).map(v => Math.round(v / s[3]).toString(16).padStart(2,'0')).join('');
console.log('gold', hex(gs), gs[3], 'purple', hex(ps), ps[3]);

async function toSvgPath(mask) {
  const png = await sharp(mask, { raw: { width: W, height: H, channels: 1 } }).png().toBuffer();
  const svg = await trace(png, { threshold: 128, turdSize: 8, optTolerance: 0.3 });
  return [...svg.matchAll(/ d="([^"]+)"/g)].map(m => m[1]).join(' ');
}
const goldD = await toSvgPath(gold), purpleD = await toSvgPath(purple), darkD = await toSvgPath(dark);
await mkdir('src/assets/brand', { recursive: true });
await writeFile('brand-source/paths.json', JSON.stringify({ W, H, gold: goldD, purple: purpleD, dark: darkD, goldHex: hex(gs), purpleHex: hex(ps) }));
