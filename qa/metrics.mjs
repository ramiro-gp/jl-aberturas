import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { gzipSync } from 'node:zlib';
import { chromium } from 'playwright';
const url = process.env.QA_URL || 'http://127.0.0.1:4321/';
const origin = new URL(url).origin;
const official = process.env.QA_MODE === 'production';
const buildDir = official ? 'release/hostinger' : 'dist';
const html = await fs.readFile(`${buildDir}/index.html`, 'utf8');
const files = await fs.readdir(`${buildDir}/_astro`);
const inlineScripts = [...html.matchAll(/<script type="module"[^>]*>([\s\S]*?)<\/script>/g)].map(match=>match[1]).join('');
const scripts = Buffer.concat([Buffer.from(inlineScripts), ...await Promise.all(files.filter(file=>file.endsWith('.js')).map(file=>fs.readFile(`${buildDir}/_astro/${file}`)))]);
const css = Buffer.concat(await Promise.all(files.filter(file=>file.endsWith('.css')).map(file=>fs.readFile(`${buildDir}/_astro/${file}`))));
const sizes = {
  htmlRaw:Buffer.byteLength(html),htmlGzip:gzipSync(html).length,
  scriptRaw:Buffer.byteLength(scripts),scriptGzip:gzipSync(scripts).length,
  cssRaw:css.length,cssGzip:gzipSync(css).length,
  fontBytes:(await fs.stat(`${buildDir}/_astro/${files.find(file=>file.endsWith('.woff2'))}`)).size,
};
const browser=await chromium.launch({headless:true});
try {
  const page=await browser.newPage({viewport:{width:1366,height:768}});
  const externalRequests = [];
  page.on('request', request => {
    if (new URL(request.url()).origin !== origin) externalRequests.push(request.url());
  });
  await page.goto(url,{waitUntil:'networkidle'});
  const bytes=()=>page.evaluate(()=>{
    const own = performance.getEntriesByType('resource').filter(item => new URL(item.name).origin === location.origin);
    return { bodyBytes: performance.getEntriesByType('navigation')[0].encodedBodySize + own.reduce((sum,item)=>sum+item.encodedBodySize,0), requests: own.length + 1, firstPartyOnly: true };
  });
  sizes.initial=await bytes();
  sizes.mapRequestedInitially=externalRequests.some(request => request.includes('google.com/maps'));
  const height=await page.evaluate(()=>document.documentElement.scrollHeight);
  for(let y=0;y<height;y+=600){await page.evaluate(value=>scrollTo({top:value,behavior:'instant'}),y);await page.waitForTimeout(80);}
  await page.waitForTimeout(400);
  sizes.fullPage=await bytes();
  sizes.externalRequests=externalRequests.length;
  sizes.measurementRequested=externalRequests.some(request => /googletagmanager\.com|google-analytics\.com|googleadservices\.com/.test(new URL(request).hostname));
  assert.equal(sizes.measurementRequested, false, 'No se deben descargar etiquetas de medición desactivadas');
  sizes.requestedImages=await page.locator('.product-photo img, .roof-photo img, .gallery-photo img').evaluateAll(images=>images.map(image=>({src:image.currentSrc ? new URL(image.currentSrc).pathname : null,loaded:image.complete&&image.naturalWidth>0})));
  const missing=await page.request.get(new URL('/pagina-inexistente-qa', url).href);
  assert.equal(missing.status(), 404);
  assert((await missing.text()).includes('Página no encontrada'));
  sizes.custom404=true;
}finally{await browser.close();}
await fs.writeFile(`qa/artifacts/size-report-${official ? 'official' : 'demo'}.json`,JSON.stringify(sizes,null,2));
console.log(JSON.stringify(sizes,null,2));
