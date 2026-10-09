// Test the actual measurement module with a simulated tag and WhatsApp destination.
// No Google tag, analytics request or WhatsApp message leaves this fixture.
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs/promises';
import { build } from 'vite';
import { chromium } from 'playwright';

const compiled = await build({
  configFile: false,
  logLevel: 'silent',
  build: { write: false, minify: false, lib: { entry: 'src/scripts/measurement.ts', name: 'JLMeasurement', formats: ['iife'] } },
});
const output = Array.isArray(compiled) ? compiled[0].output : compiled.output;
const code = output.find(item => item.type === 'chunk').code;
const contactUrl = 'https://wa.me/5491100000000?text=Consulta%20simulada';
const fixture = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Medición simulada</title></head><body>
  <a id="contact" href="${contactUrl}" data-whatsapp-placement="products"><span>Consultar</span><svg width="32" height="32" viewBox="0 0 32 32"><path id="icon" d="M5 27L27 5M5 5H27V27" fill="none" stroke="black" stroke-width="4" /></svg></a>
  <a id="ordinary" href="${contactUrl}">Enlace sin medición</a>
  <a id="unknown" href="${contactUrl}" data-whatsapp-placement="unconfirmed">Ubicación desconocida</a>
  <script>${code}</script></body></html>`;
const server = http.createServer((_request, response) => response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(fixture));
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const fakeTag = `window.__received = Array.from(window.dataLayer || [], entry => Array.from(entry)); window.gtag = function(){ window.__received.push(Array.from(arguments)); };`;
const empty = { enabled: true, googleAnalyticsId: '', googleAdsConversionId: '', googleAdsConversionLabel: '' };
const analytics = { ...empty, googleAnalyticsId: 'G-TEST123' };
const ads = { ...empty, googleAdsConversionId: 'AW-123456789', googleAdsConversionLabel: 'TEST_label' };
const cases = [
  { name: 'desactivada', config: { ...analytics, enabled: false }, tags: 0, events: 0 },
  { name: 'IDs vacíos', config: empty, tags: 0, events: 0 },
  { name: 'IDs inválidos', config: { ...empty, googleAnalyticsId: 'G-bad value', googleAdsConversionId: 'AW-invalid', googleAdsConversionLabel: 'invalid label' }, tags: 0, events: 0 },
  { name: 'GA4 y clic en el icono', config: analytics, tags: 1, events: 1, target: '#icon' },
  { name: 'Ads', config: ads, tags: 1, events: 1 },
  { name: 'GA4 y Ads', config: { ...analytics, ...ads, googleAnalyticsId: analytics.googleAnalyticsId }, tags: 1, events: 2 },
  { name: 'GA4 válido y Ads inválido', config: { ...analytics, googleAdsConversionId: 'AW-123456789', googleAdsConversionLabel: 'invalid label' }, tags: 1, events: 1 },
  { name: 'inicialización repetida', config: analytics, tags: 1, events: 1, repeat: true },
  { name: 'etiqueta lenta', config: analytics, tags: 1, events: 1, slow: true },
  { name: 'etiqueta bloqueada', config: ads, tags: 1, events: 1, blocked: true },
  { name: 'enlace sin medición', config: analytics, tags: 1, events: 0, target: '#ordinary' },
  { name: 'ubicación desconocida', config: analytics, tags: 1, events: 0, target: '#unknown' },
];
const results = [];
let browser;
try {
  browser = await chromium.launch({ headless: true });
  for (const scenario of cases) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    let resolveCaptured;
    const clickCaptured = new Promise(resolve => { resolveCaptured = resolve; });
    let tagRequests = 0;
    let resolveRequested;
    const tagRequested = new Promise(resolve => { resolveRequested = resolve; });
    let releaseTag;
    const delayedTag = new Promise(resolve => { releaseTag = resolve; });
    let captured;
    page.on('console', message => {
      if (!message.text().startsWith('JL_CAPTURE:')) return;
      captured = JSON.parse(message.text().slice('JL_CAPTURE:'.length));
      resolveCaptured();
    });
    await context.route('**/*', async route => {
      const host = new URL(route.request().url()).hostname;
      if (host === '127.0.0.1') return route.continue();
      if (host === 'www.googletagmanager.com') {
        tagRequests++;
        resolveRequested();
        if (scenario.blocked) return route.abort('blockedbyclient');
        if (scenario.slow) await delayedTag;
        try { await route.fulfill({ contentType: 'text/javascript', body: fakeTag }); } catch (error) {
          // Native navigation may cancel a deliberately delayed tag request.
          if (!scenario.slow) throw error;
        }
        return;
      }
      if (host === 'wa.me') {
        await clickCaptured;
        return route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Contacto simulado</title><p>Destino de contacto alcanzado.</p>' });
      }
      throw new Error(`La prueba no permite solicitudes externas: ${host}`);
    });
    try {
      await page.goto(origin);
      await page.evaluate(({ config, repeat }) => {
        window.JLMeasurement.initMeasurement(config);
        if (repeat) window.JLMeasurement.initMeasurement(config);
        document.addEventListener('click', event => {
          console.log('JL_CAPTURE:' + JSON.stringify({
            entries: window.__received || Array.from(window.dataLayer || [], entry => Array.from(entry)),
            prevented: event.defaultPrevented,
          }));
        });
      }, scenario);
      if (scenario.tags) {
        await tagRequested;
        if (!scenario.slow && !scenario.blocked) await page.waitForFunction(() => Boolean(window.__received));
      }
      assert.equal(await page.locator('script[src*="googletagmanager"]').count(), scenario.tags);
      const start = Date.now();
      await Promise.all([page.waitForURL(contactUrl), page.locator(scenario.target || '#contact').click()]);
      assert.equal(await page.title(), 'Contacto simulado');
      assert.equal(captured.prevented, false, `${scenario.name}: el contacto debe conservar la navegación nativa`);
      assert.equal(tagRequests, scenario.tags);
      const events = captured.entries.filter(entry => entry[0] === 'event');
      assert.equal(events.length, scenario.events, scenario.name);
      for (const event of events) {
        if (event[1] === 'whatsapp_click') assert.deepEqual(event[2], { cta_location: 'products' });
        else {
          assert.equal(event[1], 'conversion');
          assert.deepEqual(event[2], { send_to: 'AW-123456789/TEST_label' });
        }
      }
      assert(!JSON.stringify(events).includes('Consulta'), 'Los eventos no deben recoger el mensaje');
      assert(!JSON.stringify(events).includes('5491100000000'), 'Los eventos no deben recoger el teléfono');
      assert.equal(errors.length, 0, errors.join('\n'));
      results.push({ scenario: scenario.name, tags: tagRequests, events: events.length, nativeNavigation: true, navigationMs: Date.now() - start, simulated: true, pass: true });
      console.log(`${scenario.name}: OK`);
    } finally {
      releaseTag();
      await context.close();
    }
  }
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
await fs.mkdir('qa/artifacts', { recursive: true });
await fs.writeFile('qa/artifacts/measurement-results.json', JSON.stringify({ measuredAt: new Date().toISOString(), simulated: true, results }, null, 2));
console.log(`${results.length} escenarios de medición simulada pasaron. La recepción en cuentas reales sigue pendiente.`);
