import type { APIRoute } from 'astro';
import { site } from '../config/site';
export const GET: APIRoute = ({ site: baseUrl }) => {
  const sitemap = site.production && baseUrl ? `Sitemap: ${new URL('/sitemap-index.xml', baseUrl)}\n` : '';
  return new Response(`User-agent: *\nAllow: /\n${sitemap}`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
