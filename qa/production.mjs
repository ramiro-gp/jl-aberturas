import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { officialOrigin, demoOrigin } from '../src/config/origins.mjs';
const output = 'release/hostinger';
const html=await fs.readFile(`${output}/index.html`,'utf8');
assert(html.includes('content="index,follow"'));
assert(!html.includes('content="noindex,follow"'));
assert(html.includes(`rel="canonical" href="${officialOrigin}/"`));
assert(html.includes(`${officialOrigin}/og.png`));
assert(!html.includes(demoOrigin), 'Ninguna URL de Vercel en el sitio oficial');
assert(!html.includes('Demo comercial'));
assert(html.includes('Imágenes ilustrativas'));
assert(html.includes('Aberturas de aluminio'));
assert(html.includes('data-whatsapp-placement="products"'));
assert(html.includes('data-whatsapp-placement="options"'));
assert(html.includes('href="tel:+5491141695236"'));
assert(!/<script[^>]+src=["']https:\/\/www\.googletagmanager\.com/.test(html), 'Medición desactivada: no hay etiquetas externas');
assert((await fs.readFile(`${output}/robots.txt`,'utf8')).includes(`${officialOrigin}/sitemap-index.xml`));
const sitemap=await fs.readFile(`${output}/sitemap-0.xml`,'utf8');
assert(sitemap.includes(`${officialOrigin}/`));
assert(!sitemap.includes('404'));
const notFound=await fs.readFile(`${output}/404.html`,'utf8');
assert(notFound.includes('content="noindex,follow"'));
assert(!notFound.includes('rel="canonical"'));
assert(!notFound.includes('application/ld+json'));
const entity=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
assert.equal(entity['@id'], `${officialOrigin}/#business`);
assert.equal(entity.logo.url, `${officialOrigin}/logo.png`);
assert(entity.sameAs.includes('https://share.google/Kp1DXKrPlq93V9DPx'));
for(const key of ['geo','openingHours','aggregateRating','review']) assert(!(key in entity));
for(const [file,width,height] of [['logo.png',512,512],['favicon.png',96,96],['apple-touch-icon.png',180,180],['og.png',1200,630]]){
  const image=await sharp(`${output}/${file}`).metadata();
  assert.equal(image.width,width); assert.equal(image.height,height);
}
assert((await fs.readFile(`${output}/.htaccess`,'utf8')).includes('ErrorDocument 404 /404.html'));
assert((await fs.readFile(`${output}/_astro/.htaccess`,'utf8')).includes('immutable'));
assert((await fs.readFile('dist/index.html','utf8')).includes('content="noindex,follow"'),'El build entregado debe permanecer demo');
assert((await fs.readFile('dist/index.html','utf8')).includes(`${demoOrigin}/og.png`));
await assert.rejects(fs.access('dist/sitemap-index.xml'));
if(process.platform==='win32'){
  const entries=JSON.parse(execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-Command',
    'Add-Type -AssemblyName System.IO.Compression.FileSystem; $qaArchive=[System.IO.Compression.ZipFile]::OpenRead($env:JL_QA_ARCHIVE); try { ConvertTo-Json -InputObject @($qaArchive.Entries | ForEach-Object { $_.FullName.Replace("\\", "/") }) -Compress } finally { $qaArchive.Dispose() }'],
    {env:{...process.env,JL_QA_ARCHIVE:path.resolve('release/jl-aberturas-hostinger.zip')},encoding:'utf8'}));
  for(const file of ['index.html','404.html','.htaccess','_astro/.htaccess','robots.txt','sitemap-index.xml']) assert(entries.includes(file), `ZIP: falta ${file}`);
  assert(!entries.some(file=>/(^|\/)(\.env|node_modules|src|\.git)(\/|$)/.test(file)), 'ZIP debe contener solo archivos públicos');
  console.log(`ZIP verificado: ${entries.length} archivos, incluidos ambos .htaccess.`);
}
console.log('Sitio oficial: canonical, entidad, logo, metadata, sitemap, robots, 404 y separación de demo: OK.');
