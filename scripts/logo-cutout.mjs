// Белый знак без фона: альфа из яркости относительно цвета фона. Форма знака не меняется.
import sharp from 'sharp';
const SRC = 'src/assets/logo-src.jpg';
const BG = [13, 36, 67];
const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
const out = Buffer.alloc(info.width * info.height * 4);
for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
  const t = Math.max(0, Math.min(1, ((data[i] - BG[0]) / (255 - BG[0]) + (data[i + 1] - BG[1]) / (255 - BG[1]) + (data[i + 2] - BG[2]) / (255 - BG[2])) / 3));
  const a = t < 0.06 ? 0 : t;
  out[j] = out[j + 1] = out[j + 2] = 255;
  out[j + 3] = Math.round(a * 255);
}
const png = sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png();
const trimmed = await png.toBuffer().then((b) => sharp(b).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true }));
console.log('mark', trimmed.info.width, trimmed.info.height);
await sharp(trimmed.data).png().toFile('public/img/logo-mark.png');
for (const h of [96, 240]) await sharp(trimmed.data).resize({ height: h }).webp({ lossless: true }).toFile(`public/img/logo-mark-${h}.webp`);
// фавиконки: знак на родном фоне, как в оригинале
