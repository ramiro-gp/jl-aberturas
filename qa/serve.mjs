// Local static QA server. Hostinger's actual redirects/headers still require
// a check after DNS and SSL are available; this never publishes to the internet.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const root = path.resolve(process.argv[2] || 'dist');
const port = Number(process.argv[3] || 4331);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain' };
const server = http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, `http://127.0.0.1:${port}`).pathname);
    let file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep) && file !== root) { response.writeHead(404).end(); return; }
    if (pathname.split('/').some(part => part.startsWith('.'))) { response.writeHead(404).end(); return; }
    let status = 200;
    try {
      if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html');
      await fs.access(file);
    } catch { file = path.join(root, '404.html'); status = 404; }
    const body = await fs.readFile(file);
    const type = types[path.extname(file)] || 'application/octet-stream';
    const compressed = /text|xml/.test(type) && /gzip/.test(request.headers['accept-encoding'] || '');
    response.writeHead(status, {
      'Content-Type': type,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': pathname.startsWith('/_astro/') ? 'public, max-age=31536000, immutable' : 'no-cache',
      ...(compressed ? { 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' } : {}),
    });
    response.end(compressed ? gzipSync(body) : body);
  } catch { response.writeHead(500).end('QA server error'); }
});
server.listen(port, '127.0.0.1', () => console.log(`QA: http://127.0.0.1:${port}/ → ${root}`));
