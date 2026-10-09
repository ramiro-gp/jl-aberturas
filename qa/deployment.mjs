import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';

const url = process.env.QA_URL || 'https://jl-aberturas.vercel.app/';
const origin = new URL(url).origin;
await fs.mkdir('qa/artifacts', { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const viewport of [{ width: 1366, height: 768 }, { width: 390, height: 844 }]) {
    // Fresh anonymous contexts confirm that the client can open the public URL.
    const context = await browser.newContext({ viewport, hasTouch: viewport.width < 768 });
    const page = await context.newPage();
    const failures = [];
    page.on('pageerror', error => failures.push(error.message));
    page.on('response', response => {
      if (new URL(response.url()).origin === origin && response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
    });
    const response = await page.goto(url, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    assert.equal(new URL(page.url()).origin, origin, 'La web pública no debe redirigir a login');
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), `${origin}/`);
    assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'), `${origin}/`);
    assert.equal(await page.locator('meta[property="og:image"]').getAttribute('content'), `${origin}/og.png`);
    assert.equal(await page.locator('meta[name=robots]').getAttribute('content'), 'noindex,follow');
    assert.equal(await page.locator('.footer-credit a').getAttribute('href'), 'https://ramita.dev');
    assert.equal(await page.locator('.footer-socials a').count(), 2);
    assert.equal(await page.locator('.google-profile-link').getAttribute('href'), 'https://share.google/Kp1DXKrPlq93V9DPx');
    assert.equal(await page.locator('.question').count(), 5);
    assert((await page.title()).includes('aluminio'));
    assert.equal(await page.locator('.gallery-item').count(), 3);
    assert.equal(await page.locator('.product-consultation a').count(), 2);
    assert.equal(await page.locator('a[href="tel:+5491141695236"]').count(), 1);
    const entity = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
    assert.equal(entity.address.streetAddress, 'Pastoriza 1765');
    assert.equal(entity.address.addressLocality, 'Rafael Calzada');
    assert.equal(entity.sameAs.length, 3);
    assert.equal(await page.locator('.location-map iframe').getAttribute('loading'), 'lazy');
    if(viewport.width < 1024) {
      assert.equal(await page.locator('.hero-reveal').evaluate(el=>Number(getComputedStyle(el).opacity)), 1);
      const cta=await page.locator('.hero-reveal a').boundingBox();
      assert(cta.y+cta.height<=viewport.height, 'WhatsApp visible desde el inicio');
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const frame = await page.locator('.window-shell').boundingBox();
    assert(Math.abs(frame.x - (viewport.width - frame.x - frame.width)) < 2);
    assert.equal(await page.locator('html').evaluate(element => getComputedStyle(element).scrollBehavior), 'smooth');
    await page.screenshot({ path: `qa/artifacts/published-${viewport.width}.png` });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('.product-consultation').first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: `qa/artifacts/published-cta-${viewport.width}.png` });
    await page.locator('#productos').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.querySelectorAll('.product-photo img')].every(image => image.complete && image.naturalWidth > 0));
    await page.locator('#galeria').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.querySelectorAll('.gallery-photo img')].every(image => image.complete && image.naturalWidth > 0));
    await page.locator('.site-footer').scrollIntoViewIfNeeded();
    const socialImage = await context.request.get(`${origin}/og.png`);
    assert.equal(socialImage.status(), 200);
    assert.equal(createHash('sha256').update(await socialImage.body()).digest('hex'), createHash('sha256').update(await fs.readFile('public/og.png')).digest('hex'), 'La imagen social pública debe ser la versión actualizada');
    const robots = await context.request.get(`${origin}/robots.txt`);
    assert.equal(robots.status(), 200);
    assert((await robots.text()).includes('Allow: /'));
    const notFound = await context.request.get(`${origin}/pagina-inexistente-qa`);
    assert.equal(notFound.status(), 404);
    const errorHtml = await notFound.text();
    assert(errorHtml.includes('Página no encontrada'));
    assert(!errorHtml.includes('rel="canonical"'));
    assert(!errorHtml.includes('application/ld+json'));
    assert.equal(failures.length, 0, failures.join('\n'));
    results.push({ viewport, anonymousPublicAccess: true, assets: true, metadata: true, heroMargins: true, footerCredit: true, localBusinessData: true, gallery: true, socialLinks: true, lazyMap: true, productCTAs: true, clickablePhone: true, currentSocialImage: true, custom404: true, pass: true });
    await context.close();
  }
} finally {
  await browser.close();
}
await fs.writeFile('qa/artifacts/deployment-results.json', JSON.stringify({ url, results }, null, 2));
console.log(JSON.stringify({ url, results }, null, 2));
