import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium, firefox, webkit } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const url = process.env.QA_URL || "http://127.0.0.1:4321/";
const official = process.env.QA_MODE === 'production';
const expectedOrigin = official ? 'https://jlaberturas.com.ar' : 'https://jl-aberturas.vercel.app';
const results = [];
const browserNames = (
  process.env.QA_BROWSERS || "chromium,firefox,webkit"
).split(",");
const sizes = [
  [320, 568],
  [360, 640],
  [390, 844],
  [768, 1024],
  [1366, 768],
  [1920, 1080],
];
const settle = (page) =>
  page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
const waitForScrollEnd = (page) => page.evaluate(() => new Promise((resolve) => {
  let previous = scrollY;
  let stableFrames = 0;
  const sample = () => {
    stableFrames = Math.abs(scrollY - previous) < 0.5 ? stableFrames + 1 : 0;
    previous = scrollY;
    if (stableFrames >= 5) resolve();
    else requestAnimationFrame(sample);
  };
  requestAnimationFrame(sample);
}));
const state = (page) =>
  page.evaluate(() => {
    const hero = document.querySelector(".hero");
    const scene = document.querySelector(".hero-scene");
    const leaf = document.querySelector(".leaf-moving");
    const reveal = document.querySelector(".hero-reveal");
    return {
      overflow: document.documentElement.scrollWidth > innerWidth,
      sticky: getComputedStyle(scene).position === "sticky",
      travel: hero.offsetHeight - scene.offsetHeight,
      offset: hero.getBoundingClientRect().top + scrollY,
      sceneTop: scene.getBoundingClientRect().top,
      revealOpacity: Number(getComputedStyle(reveal).opacity),
      translate: new DOMMatrix(getComputedStyle(leaf).transform).m41,
      leafWidth: leaf.getBoundingClientRect().width,
      ready: hero.hasAttribute("data-motion-ready"),
      revealBottom: reveal.getBoundingClientRect().bottom,
      footerTop: document.querySelector(".hero-bottom").getBoundingClientRect()
        .top,
    };
  });
await fs.mkdir("qa/artifacts", { recursive: true });
for (const name of browserNames) {
  const type = { chromium, firefox, webkit }[name];
  assert(type, `Navegador desconocido: ${name}`);
  const options =
    name === "chromium" && process.env.QA_CHROME_CHANNEL
      ? { channel: process.env.QA_CHROME_CHANNEL }
      : {};
  const browser = await type.launch({ headless: true, ...options });
  console.log(`${name}: ${browser.version()}`);
  try {
    for (const [width, height] of sizes) {
      const context = await browser.newContext({
        viewport: { width, height },
        hasTouch: width < 768,
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(url, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await settle(page);
      let actual = await state(page);
      assert.equal(actual.overflow, false, `${name} ${width}: overflow`);
      const frame = await page.locator('.window-shell').boundingBox();
      assert(frame.x >= 23, `${name} ${width}: falta margen izquierdo`);
      assert(Math.abs(frame.x - (width - frame.x - frame.width)) < 2, `${name} ${width}: márgenes del hero desiguales`);
      assert.equal(await page.locator('.footer-credit a').getAttribute('href'), 'https://ramita.dev');
      assert.equal(await page.locator("h1").count(), 1);
      assert.equal(await page.locator("html").getAttribute("lang"), "es-AR");
      assert.equal(
        await page.locator("meta[name=robots]").getAttribute("content"),
        official ? "index,follow" : "noindex,follow",
      );
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `${expectedOrigin}/`);
      assert.equal(await page.locator('meta[property="og:image"]').getAttribute('content'), `${expectedOrigin}/og.png`);
      assert.equal(await page.locator('script[src*="googletagmanager"]').count(), 0);
      assert.equal(await page.locator('.question').count(), 5);
      assert((await page.locator('meta[name="description"]').getAttribute('content')).includes('aluminio'));
      assert((await page.title()).includes('aluminio'));
      assert.equal(await page.locator('a[href="tel:+5491141695236"]').count(), 1);
      assert.equal(await page.locator('.glass-options li').count(), 4);
      assert.equal(await page.locator('.glass-options li p').count(), 4);
      assert.equal(await page.locator('.glass-diagram').count(), 4);
      assert.equal(await page.locator('.product-grid > .product').count(), 4);
      assert.equal(await page.locator('.product-roof').count(), 1);
      assert.equal(await page.locator('[data-product="corredizas"] h3').textContent(), 'Ventanales y corredizas');
      assert((await page.locator('#galeria .image-note').textContent()).includes('generadas con IA'));
      const photoHeights = await page.locator('.product-photo').evaluateAll(photos => photos.map(photo => photo.getBoundingClientRect().height));
      assert(photoHeights.every(value => value <= (width < 768 ? 320 : 440) + 1), `${name} ${width}: fotos de catálogo demasiado altas`);
      assert.equal(await page.locator('.product-consultation a').count(), 2);
      if (width < 1024) {
        assert.equal(actual.revealOpacity, 1, 'Mobile/tablet: texto visible desde el inicio');
        const cta = await page.locator('.hero-reveal a').boundingBox();
        assert(cta.y >= 0 && cta.y + cta.height <= height, `${name} ${width}: CTA fuera del primer viewport`);
        assert(cta.y + cta.height <= frame.y, 'CTA debe preceder a la ventana');
        assert.equal(await page.locator('.hero-reveal').evaluate(el => getComputedStyle(el).pointerEvents), 'auto');
      }
      const hrefs = await page
        .locator('a[href^="https://wa.me/"]')
        .evaluateAll((links) => links.map((link) => link.href));
      assert(hrefs.length >= 3);
      assert.equal(new Set(hrefs).size, 1);
      assert.deepEqual(await page.locator('a[href^="https://wa.me/"]').evaluateAll(links => links.map(link => link.dataset.whatsappPlacement).sort()), ['contact', 'footer', 'header', 'hero', 'menu', 'options', 'products']);
      const contact = new URL(hrefs[0]);
      assert.equal(contact.pathname, "/5491141695236");
      assert.equal(
        contact.searchParams.get("text"),
        "Hola, vi la web de JL Aberturas y quería consultar por una abertura.",
      );
      const data = JSON.parse(
        await page.locator('script[type="application/ld+json"]').textContent(),
      );
      assert.equal(data["@type"], "HomeAndConstructionBusiness");
      assert.equal(data.telephone, "+5491141695236");
      assert.equal(data.address.streetAddress, 'Pastoriza 1765');
      assert.equal(data.address.addressLocality, 'Rafael Calzada');
      assert.deepEqual(data.areaServed, ['CABA', 'Zona Sur', 'Zona Oeste', 'Zona Norte']);
      assert.deepEqual(data.sameAs, ['https://www.instagram.com/jl.aberturas/', 'https://www.facebook.com/jl.aberturass', 'https://share.google/Kp1DXKrPlq93V9DPx']);
      assert.equal(data.logo.url, `${expectedOrigin}/logo.png`);
      assert.equal(await page.locator('.google-profile-link').getAttribute('href'), 'https://share.google/Kp1DXKrPlq93V9DPx');
      assert.equal('geo' in data, false);
      assert.equal('openingHours' in data, false);
      assert.equal(await page.locator('.location-map iframe').getAttribute('loading'), 'lazy');
      assert((await page.locator('.location-map iframe').getAttribute('src')).includes('Pastoriza%201765'));
      assert.equal(await page.locator('.line-item').count(), 2);
      assert.equal(await page.locator('.options-bottom .option-names li').first().textContent(), 'Mosquiteros');
      assert.equal(await page.locator('.gallery-item').count(), 3);
      await page.screenshot({
        path: `qa/artifacts/${name}-${width}-closed.png`,
      });
      if (actual.sticky) {
        assert(actual.ready);
        assert(actual.translate < 1);
        const middle = actual.offset + actual.travel * 0.5;
        await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), middle);
        await settle(page);
        const half = await state(page);
        assert(half.translate > 0 && half.translate < half.leafWidth);
        assert(Math.abs(half.sceneTop) < 2);
        await page.evaluate(
          (y) => scrollTo({ top: y, behavior: 'instant' }),
          actual.offset + actual.travel * 0.9,
        );
        await settle(page);
        actual = await state(page);
        assert(actual.translate > actual.leafWidth * 0.98);
        assert(actual.revealOpacity > 0.98);
        if (width < 1024) {
          assert.equal(await page.locator('.window-brand').evaluate(el => Number(getComputedStyle(el).opacity)), 1);
          const brand = await page.locator('.window-brand').boundingBox();
          const opening = await page.locator('.window-shell').boundingBox();
          assert(brand.x >= opening.x && brand.x + brand.width <= opening.x + opening.width / 2 + 2);
        }
        assert(
          actual.revealBottom <= actual.footerTop + 1,
          `${name} ${width}: contenido del hero se superpone al pie`,
        );
        await page.screenshot({
          path: `qa/artifacts/${name}-${width}-open.png`,
        });
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        await settle(page);
        assert(
          (await state(page)).translate < 1,
          "Scroll inverso debe cerrar la hoja",
        );
        await page.mouse.wheel(0, 80);
        await page.waitForFunction(() => scrollY > 0);
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        await settle(page);
        await page.keyboard.press("PageDown");
        await page.waitForFunction(() => scrollY > 0);
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        await settle(page);
        await page.locator(".hero-reveal a").focus();
        await settle(page);
        assert(
          (await state(page)).revealOpacity === 1,
          "Foco de teclado debe revelar el CTA",
        );
        await page.locator(".hero-reveal a").evaluate((link) => link.blur());
      } else {
        assert.equal(actual.revealOpacity, 1);
        assert(actual.translate > actual.leafWidth * 0.98);
      }
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await settle(page);
      const targetY = await page.locator('#productos').evaluate(element =>
        element.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)
      );
      assert.equal(await page.locator('html').evaluate(element => getComputedStyle(element).scrollBehavior), 'smooth');
      await page.locator('.hero-bottom a[href="#productos"]').click();
      // Native anchors must travel through intermediate positions, not jump.
      await page.waitForFunction(target => scrollY > 5 && scrollY < target - 5, targetY);
      await waitForScrollEnd(page);
      assert(Math.abs(await page.evaluate(() => scrollY) - targetY) < 3, `${name} ${width}: ancla no llega a productos`);
      if (width < 768) {
        await page.locator(".mobile-menu summary").tap();
        assert.equal(
          await page.locator(".mobile-menu").getAttribute("open"),
          "",
        );
        await page.keyboard.press("Escape");
        assert.equal(
          await page.locator(".mobile-menu").getAttribute("open"),
          null,
        );
        await page.locator(".mobile-menu summary").tap();
        await page.locator('.mobile-menu a[href="#contacto"]').click();
        assert.equal(
          await page.locator(".mobile-menu").getAttribute("open"),
          null,
        );
        assert.equal(new URL(page.url()).hash, "#contacto");
        await waitForScrollEnd(page);
      } else {
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        await settle(page);
        await page.locator('.desktop-nav a[href="#proceso"]').click();
        await page.waitForFunction(() => scrollY > 5 && document.querySelector('#proceso').getBoundingClientRect().top > 200);
        await waitForScrollEnd(page);
        assert.equal(new URL(page.url()).hash, '#proceso');
      }
      // All below-fold copy is audited, including text which motion initially reveals.
      await page.emulateMedia({ reducedMotion: "reduce" });
      await settle(page);
      const views = page.locator('[data-product-views="ventanas"]');
      const deAbrir = views.getByRole('button', { name: 'De abrir', exact: true });
      const ventiluz = views.getByRole('button', { name: 'Ventiluz', exact: true });
      const stageHeight = (await views.locator('.product-views-stage').boundingBox()).height;
      assert.equal(await deAbrir.getAttribute('aria-pressed'), 'true');
      await ventiluz.focus();
      await page.keyboard.press('Space');
      assert.equal(await ventiluz.getAttribute('aria-pressed'), 'true');
      assert(Math.abs((await views.locator('.product-views-stage').boundingBox()).height - stageHeight) < 0.5, 'El selector debe conservar la altura de la foto');
      assert.equal(await views.locator('.product-view:not([hidden])').count(), 1);
      assert((await views.locator('.product-view:not([hidden]) img').getAttribute('alt')).includes('ventiluz'));
      await deAbrir.focus();
      await page.keyboard.press('Enter');
      assert.equal(await deAbrir.getAttribute('aria-pressed'), 'true');
      if (width === 1366) {
        const card = page.locator('[data-product="corredizas"]');
        await card.evaluate(element => scrollTo({ top: element.getBoundingClientRect().top + scrollY - document.querySelector('.site-header').getBoundingClientRect().height - 20, behavior: 'instant' }));
        const bounds = await card.boundingBox();
        assert(bounds.y >= 86 && bounds.y + bounds.height <= height, 'Corrediza, título y descripción deben caber bajo el header');
      }
      const question = page.locator('.question').first();
      await question.locator('summary').focus();
      await page.keyboard.press('Enter');
      assert.equal(await question.getAttribute('open'), '');
      await page.keyboard.press('Enter');
      assert.equal(await question.getAttribute('open'), null);
      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      if (axe.violations.length)
        console.log(
          JSON.stringify(
            axe.violations.map((v) => ({
              id: v.id,
              nodes: v.nodes.map((n) => ({
                target: n.target,
                summary: n.failureSummary,
              })),
            })),
            null,
            2,
          ),
        );
      assert.equal(axe.violations.length, 0, `${name} ${width}: axe`);
      assert.equal(errors.length, 0, errors.join("\n"));
      results.push({
        browser: name,
        width,
        height,
        checks:
          "responsive, symmetric hero margins, native scroll, smooth anchors, focus, touch, footer credit, WhatsApp, schema, axe",
        pass: true,
      });
      console.log(`  ${width}x${height}: OK`);
      await context.close();
    }
    for (const fallback of ["reduced", "no-js", "blocked-js", "init-failure"]) {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        javaScriptEnabled: fallback !== "no-js",
        reducedMotion: fallback === "reduced" ? "reduce" : "no-preference",
      });
      const page = await context.newPage();
      if (fallback === "blocked-js")
        await page.route(url, async route => {
          const response = await route.fetch();
          await route.fulfill({ response, headers: { ...response.headers(), 'content-security-policy': "script-src 'none'" } });
        });
      if (fallback === "init-failure")
        await page.addInitScript(() => {
          window.matchMedia = () => {
            throw new Error("QA: simular fallo de inicialización");
          };
        });
      await page.goto(url, { waitUntil: "networkidle" });
      if (fallback !== "no-js") await settle(page);
      if (fallback === 'no-js' || fallback === 'blocked-js') {
        const views = page.locator('[data-product-views="ventanas"]');
        assert.equal(await views.locator('.product-view:not([hidden])').count(), 2, 'Sin JS deben estar disponibles ambas vistas');
        assert.equal(await views.locator('.product-view-controls').isVisible(), false);
      }
      const actual = await state(page);
      assert.equal(actual.revealOpacity, 1, `${fallback}: texto oculto`);
      assert.equal(actual.overflow, false);
      if (fallback === "reduced" || fallback === "no-js")
        assert.equal(actual.sticky, false);
      assert(actual.translate > actual.leafWidth * 0.98);
      await page.screenshot({
        path: `qa/artifacts/${name}-${fallback}.png`,
        fullPage: true,
      });
      results.push({ browser: name, fallback, pass: true });
      console.log(`  ${fallback}: OK`);
      await context.close();
    }
    const context = await browser.newContext({
      viewport: { width: 683, height: 384 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    assert.equal(
      (await state(page)).overflow,
      false,
      "Viewport equivalente a zoom 200%",
    );
    await context.close();
  } finally {
    await browser.close();
  }
}
await fs.writeFile(
  `qa/artifacts/browser-results-${official ? 'official' : 'demo'}.json`,
  JSON.stringify(results, null, 2),
);
console.log(`${results.length} escenarios pasaron.`);
