import fs from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { chromium } from 'playwright';
const html = await fs.readFile('dist/index.html', 'utf8');
const files = await fs.readdir('dist/_astro');
const scripts = [...html.matchAll(/<script type="module"[^>]*>([\s\S]*?)<\/script>/g)].map(match=>match[1]).join('');
const css = Buffer.concat(await Promise.all(files.filter(file=>file.endsWith('.css')).map(file=>fs.readFile(`dist/_astro/${file}`))));
const sizes = {
  htmlRaw:Buffer.byteLength(html),htmlGzip:gzipSync(html).length,
  scriptRaw:Buffer.byteLength(scripts),scriptGzip:gzipSync(scripts).length,
  cssRaw:css.length,cssGzip:gzipSync(css).length,
  fontBytes:(await fs.stat(`dist/_astro/${files.find(file=>file.endsWith('.woff2'))}`)).size,
};
const browser=await chromium.launch({headless:true});
try {
  const page=await browser.newPage({viewport:{width:1366,height:768}});
  const externalRequests = [];
  page.on('request', request => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4321') externalRequests.push(request.url());
  });
  await page.goto('http://127.0.0.1:4321/',{waitUntil:'networkidle'});
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
  sizes.requestedImages=await page.locator('.product-photo img').evaluateAll(images=>images.map(image=>({src:new URL(image.currentSrc).pathname,loaded:image.complete&&image.naturalWidth>0})));
}finally{await browser.close();}
await fs.writeFile('qa/artifacts/size-report.json',JSON.stringify(sizes,null,2));
console.log(JSON.stringify(sizes,null,2));
