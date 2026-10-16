import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';

const url = process.env.QA_URL || 'http://127.0.0.1:4321/';
const browser = await chromium.launch({ headless: true });
const results = [];
await fs.mkdir('qa/artifacts', { recursive: true });
try {
  for (const [width, height] of [[390, 844], [1366, 768], [1920, 1080]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const photographs = page.locator('.product-photo img:visible, .roof-photo img, .gallery-photo img');
    for (const img of await photographs.all()) {
      await img.scrollIntoViewIfNeeded();
      await img.evaluate(image => image.decode());
      assert(await img.evaluate(image => image.complete && image.naturalWidth > 0), 'Fotografía sin cargar');
    }
    const windows = page.locator('[data-product-views="ventanas"]');
    const stage = windows.locator('.product-views-stage');
    const initialHeight = (await stage.boundingBox()).height;
    await windows.getByRole('button', { name: 'Ventiluz', exact: true }).click();
    await windows.locator('.product-view:not([hidden]) img').evaluate(image => image.decode());
    assert(Math.abs((await stage.boundingBox()).height - initialHeight) < 0.5, 'Cambiar la vista no debe mover la descripción');
    await windows.getByRole('button', { name: 'De abrir', exact: true }).click();

    const card = page.locator('[data-product="corredizas"]');
    await card.evaluate(element => scrollTo({ top: element.getBoundingClientRect().top + scrollY - document.querySelector('.site-header').getBoundingClientRect().height - 20, behavior: 'instant' }));
    const bounds = await card.boundingBox();
    const header = await page.locator('.site-header').evaluate(element => element.getBoundingClientRect().height);
    assert(bounds.y >= header, 'La cabecera no debe tapar la foto');
    assert(bounds.y + bounds.height <= height, 'Foto y descripción deben caber bajo la cabecera');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.equal(errors.length, 0, errors.join('\n'));
    await page.screenshot({ path: `qa/artifacts/images-viewport-${width}.png` });
    // Section captures omit fixed overlays; viewport captures above retain the actual header.
    const style = '.site-header, .skip-link { visibility: hidden !important; }';
    for (const [selector, name] of [['.product-grid', 'catalog'], ['.product-roof', 'roof'], ['.options-bottom', 'glass'], ['#galeria', 'gallery']]) {
      await page.locator(selector).screenshot({ path: `qa/artifacts/images-${name}-${width}.png`, style });
    }
    results.push({ width, height, photographs: await photographs.count(), photoHeight: await card.locator('.product-photo').evaluate(element => element.getBoundingClientRect().height), cardBottom: bounds.y + bounds.height, pass: true });
    await page.close();
  }
} finally {
  await browser.close();
}
await fs.writeFile('qa/artifacts/images-results.json', JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
