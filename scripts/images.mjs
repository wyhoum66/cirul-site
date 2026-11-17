import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'src/assets/src-photos';
const OUT = 'public/img';
const WIDTHS = [480, 960, 1440];
const CROP_BOTTOM = 0.075; // срез полосы с водяным знаком 2GIS

const NAMES = {
  '01': 'work-textured-crop', '03': 'work-beard-fade', '04': 'work-beard-fade-2',
  '07': 'work-textured-crop-2', '08': 'work-textured-front',
  '02': 'process-beard-trim', '05': 'process-beard-clipper', '06': 'process-wash',
  '09': 'process-beard-line', '10': 'process-fade', '11': 'process-scissors',
  '12': 'tools-clippers', '13': 'care-shampoo', '14': 'care-wax', '15': 'care-shelf',
  '16': 'tools-station', '17': 'care-oils', '18': 'interior-lights', '19': 'interior-hall',
  '20': 'interior-hall-wide', '21': 'interior-reception', '22': 'interior-reception-2',
  '23': 'interior-chairs', '25': 'facade-day', '26': 'interior-chairs-2', '27': 'interior-chair-tufted',
  '28': 'facade-front', '29': 'facade-evening', '30': 'facade-entrance',
};

fs.mkdirSync(OUT, { recursive: true });
const manifest = {};
for (const [num, name] of Object.entries(NAMES)) {
  const file = path.join(SRC, `${num}.jpg`);
  const meta = await sharp(file).metadata();
  const h = Math.round(meta.height * (1 - CROP_BOTTOM));
  const base = sharp(file).extract({ left: 0, top: 0, width: meta.width, height: h });
  const buf = await base.toBuffer();
  const ws = WIDTHS.filter((w) => w < meta.width).concat(meta.width >= 1440 ? [1440] : [meta.width]);
  const uniq = [...new Set(ws)].sort((a, b) => a - b);
  for (const w of uniq) {
    await sharp(buf).resize({ width: w }).webp({ quality: w > 960 ? 72 : 76 }).toFile(path.join(OUT, `${name}-${w}.webp`));
  }
  manifest[name] = { w: meta.width, h, sizes: uniq };
}

// OG 1200x630: фото зала + логотип без изменений на его родном фоне
const LOGO = 'src/assets/logo-src.jpg';
const ogPhoto = await sharp(path.join(SRC, '20.jpg')).extract({ left: 0, top: 0, width: 1440, height: 1000 })
  .resize(630, 630, { fit: 'cover' }).toBuffer();
const ogLogo = await sharp(LOGO).resize(570, 570).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#0d2443' } })
  .composite([{ input: ogLogo, left: 0, top: 30 }, { input: ogPhoto, left: 570, top: 0 }])
  .jpeg({ quality: 82 }).toFile('public/og-image.jpg');

// Логотип и фавиконки: только масштабирование оригинала
for (const s of [96, 160, 320, 640]) await sharp(LOGO).resize(s, s).webp({ lossless: true }).toFile(`public/img/logo-${s}.webp`);
await sharp(LOGO).resize(320, 320).png().toFile('public/img/logo-320.png');
for (const s of [32, 180, 192, 512]) await sharp(LOGO).resize(s, s).png().toFile(`public/favicon-${s}.png`);

fs.writeFileSync('src/data/images.json', JSON.stringify(manifest, null, 2));
console.log('images:', Object.keys(manifest).length);
