import sharp from "sharp";

const W = 1200;
const H = 630;
const logoPath = "public/og-image.webp";
const outPath = "public/og-share.webp";

const logoBuf = await sharp(logoPath)
  .resize({ width: 920, height: 240, fit: "inside" })
  .toBuffer();
const logoMeta = await sharp(logoBuf).metadata();

const bg = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5014d2"/>
      <stop offset="55%" stop-color="#7a1fb8"/>
      <stop offset="100%" stop-color="#dd3ca7"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect x="90" y="145" width="1020" height="340" rx="28" fill="#000000" fill-opacity="0.55"/>
</svg>`);

const left = Math.round((W - logoMeta.width) / 2);
const top = Math.round((H - logoMeta.height) / 2);

await sharp(bg)
  .composite([{ input: logoBuf, left, top }])
  .webp({ quality: 92 })
  .toFile(outPath);

const out = await sharp(outPath).metadata();
console.log(`created ${outPath} ${out.width}x${out.height}`);
