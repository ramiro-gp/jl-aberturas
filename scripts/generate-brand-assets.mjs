import sharp from 'sharp';

// Optimize the supplied artwork without redrawing or changing the logo.
const source = 'src/assets/brand/logo-jl-aberturas.png';
for (const [file, size] of [['favicon.png', 96], ['apple-touch-icon.png', 180], ['logo.png', 512]]) {
  await sharp(source).resize(size, size, { fit: 'contain' }).png({ compressionLevel: 9 }).toFile(`public/${file}`);
}
console.log('Logo público y favicons optimizados a partir de la identidad oficial.');
