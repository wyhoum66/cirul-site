import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { render, routeFromFile, pageMeta } from './src/build/render.js';
import { BASE, absUrl } from './src/config.js';

const root = process.cwd();
const SKIP = new Set(['node_modules', 'dist', 'public', 'src', 'scripts', '.git', '.github']);

function findPages(dir = root, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory() && !SKIP.has(e.name)) findPages(path.join(dir, e.name), acc);
    else if (e.isFile() && (e.name === 'index.html' || (dir === root && e.name === '404.html'))) acc.push(path.join(dir, e.name));
  }
  return acc;
}

const pagesList = findPages();
const input = Object.fromEntries(pagesList.map((f) => [path.relative(root, f).replace(/\\/g, '/').replace(/\.html$/, '').replace(/\//g, '_') || 'index', f]));

function sitePlugin() {
  let base = BASE;
  return {
    name: 'cirul-site',
    configResolved(c) { base = c.base; },
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const file = ctx.filename || path.join(root, ctx.path);
        return render(html, routeFromFile(file, root), base);
      },
    },
    generateBundle() {
      const routes = pagesList.map((f) => routeFromFile(f, root)).filter((r) => !pageMeta(r).noindex).sort();
      const today = new Date().toISOString().slice(0, 10);
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${absUrl(r)}</loc><lastmod>${today}</lastmod><priority>${r === '/' ? '1.0' : r.split('/').length > 3 ? '0.6' : '0.8'}</priority></url>`).join('\n')}
</urlset>
`;
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\nDisallow: /404.html\n\nSitemap: ${absUrl('/sitemap.xml')}\n` });
    },
  };
}

export default defineConfig({
  base: BASE,
  plugins: [sitePlugin()],
  build: { rollupOptions: { input }, assetsInlineLimit: 0 },
  server: { port: 5173 },
});
