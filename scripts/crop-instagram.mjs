// Crops chosen Instagram photos (brand-source/instagram/) into web images in public/images/.
import sharp from 'sharp';
const jobs = [
  // Sheida's threading result (Instagram, Jun 2020): before (top panel) and after (bottom panel)
  { src: 'ig-brows-4', out: 'brows-before', crop: { left: 45, top: 30, width: 1180, height: 555 } },
  { src: 'ig-brows-4', out: 'brows-after', crop: { left: 220, top: 622, width: 1195, height: 523 } },
  { src: 'ig-image-skincare', out: 'image-skincare' },
];
for (const j of jobs) {
  let img = sharp(`brand-source/instagram/${j.src}.jpg`);
  if (j.crop) img = img.extract(j.crop);
  const buf = await img.toBuffer();
  for (const w of [800, 1600]) {
    await sharp(buf).resize({ width: w, withoutEnlargement: true }).modulate({ brightness: 1.02 }).webp({ quality: 78 }).toFile(`public/images/${j.out}-${w}.webp`);
  }
  console.log('ok', j.out);
}
