import { chromium } from "playwright";
import fs from "node:fs/promises";
await fs.mkdir("qa/artifacts", { recursive: true });
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
page.on("pageerror", (error) => console.log("PAGE ERROR", error.message));
await page.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "qa/artifacts/desktop-closed.png" });
await page.evaluate(() =>
  window.scrollTo(
    { top: (document.querySelector(".hero").offsetHeight - innerHeight) * 0.85, behavior: 'instant' },
  ),
);
await page.waitForTimeout(200);
await page.screenshot({ path: "qa/artifacts/desktop-open.png" });
await page.locator("#productos").scrollIntoViewIfNeeded();
await page.waitForTimeout(450);
await page.screenshot({ path: "qa/artifacts/products.png" });
await page.emulateMedia({ reducedMotion: 'reduce' });
for (const section of ['nosotros', 'proceso', 'galeria', 'ubicacion', 'contacto']) {
  if (section === 'ubicacion') {
    await page.locator('#ubicacion').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2500);
  }
  await page.locator(`#${section}`).screenshot({ path: `qa/artifacts/${section}.png` });
}
await page.locator('.product-options').screenshot({ path: 'qa/artifacts/product-options.png' });
await page.locator('.site-footer').screenshot({ path: 'qa/artifacts/desktop-footer.png' });
await page.emulateMedia({ reducedMotion: 'no-preference' });
await page.setViewportSize({ width: 360, height: 640 });
await page.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
await page.screenshot({ path: "qa/artifacts/mobile-closed.png" });
await page.evaluate(() =>
  window.scrollTo(
    { top: (document.querySelector(".hero").offsetHeight - innerHeight) * 0.9, behavior: 'instant' },
  ),
);
await page.waitForTimeout(200);
await page.screenshot({ path: "qa/artifacts/mobile-open.png" });
console.log(
  await page.evaluate(() => ({
    width: innerWidth,
    overflow: document.documentElement.scrollWidth,
    hero: document.querySelector(".hero").getBoundingClientRect().height,
    scene: document.querySelector(".hero-scene").getBoundingClientRect().height,
    reveal: document
      .querySelector(".hero-reveal")
      .getBoundingClientRect()
      .toJSON(),
    bottom: document
      .querySelector(".hero-bottom")
      .getBoundingClientRect()
      .toJSON(),
  })),
);
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.locator('#galeria').screenshot({ path: 'qa/artifacts/mobile-gallery.png' });
await page.locator('#ubicacion').scrollIntoViewIfNeeded();
await page.waitForTimeout(1500);
await page.locator('#ubicacion').screenshot({ path: 'qa/artifacts/mobile-location.png' });
await page.locator('.site-footer').screenshot({ path: 'qa/artifacts/mobile-footer.png' });
await browser.close();
