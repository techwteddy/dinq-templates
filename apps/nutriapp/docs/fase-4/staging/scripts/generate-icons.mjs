/**
 * scripts/generate-icons.mjs
 *
 * Genera todos los iconos PWA a partir de un SVG fuente.
 * Requiere: npm install -D sharp
 * Uso: node scripts/generate-icons.mjs
 */
import sharp from "sharp";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, "../public/icons");

// SVG fuente inline (leaf + circle — personaliza a gusto)
const svgSource = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="80" fill="#16a34a"/>
  <text x="256" y="360" font-family="system-ui, sans-serif" font-size="320"
        text-anchor="middle" fill="white">🥗</text>
</svg>
`.trim();

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generate() {
  for (const size of sizes) {
    await sharp(Buffer.from(svgSource))
      .resize(size, size)
      .png()
      .toFile(`${publicDir}/icon-${size}x${size}.png`);
    console.log(`✓ icon-${size}x${size}.png`);
  }
  console.log("\nIconos generados en public/icons/");
}

generate().catch(console.error);
