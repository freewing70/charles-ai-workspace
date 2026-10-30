import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const coversDir = path.resolve('public/assets/covers');
const files = fs.readdirSync(coversDir).filter(f => f.endsWith('.svg'));

console.log(`Found ${files.length} SVG covers to convert...`);

for (const file of files) {
  const svgPath = path.join(coversDir, file);
  const pngPath = path.join(coversDir, file.replace(/\.svg$/, '.png'));

  try {
    const svgContent = fs.readFileSync(svgPath, 'utf-8');
    const resvg = new Resvg(svgContent, {
      fitTo: {
        mode: 'width',
        value: 1200,
      },
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();
    fs.writeFileSync(pngPath, pngBuffer);
    console.log(`✓ Converted: ${file} -> ${path.basename(pngPath)} (${(pngBuffer.length / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`✗ Error converting ${file}:`, err);
  }
}

console.log('All SVG covers converted successfully!');
