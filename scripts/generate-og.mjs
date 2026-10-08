import fs from 'node:fs/promises';
import { chromium } from 'playwright';

// Render the actual local font rather than relying on system SVG font fallbacks.
const source = await fs.readFile('public/og-source.svg', 'utf8');
const font = await fs.readFile('node_modules/@fontsource-variable/libre-franklin/files/libre-franklin-latin-wght-normal.woff2');
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(`<style>
    @font-face { font-family: 'Libre Franklin'; src: url(data:font/woff2;base64,${font.toString('base64')}) format('woff2'); font-weight: 100 900; }
    html, body { margin: 0; width: 1200px; height: 630px; }
    svg { display: block; }
  </style>${source}`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'public/og.png' });
  console.log('Imagen social generada: public/og.png (1200 × 630), con Libre Franklin.');
} finally {
  await browser.close();
}
