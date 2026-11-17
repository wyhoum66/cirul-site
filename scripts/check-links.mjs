import fs from 'node:fs';
import path from 'node:path';
const DIST = 'dist', BASE = '/cirul-site/';
const files = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.html') && files.push(path.join(d, e.name)));
walk(DIST);
let bad = 0;
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const urls = [...html.matchAll(/(?:href|src|poster|data-full)="([^"#]+)"/g), ...html.matchAll(/srcset="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(' ')[0]));
  for (const u of urls) {
    if (!u.startsWith('/')) continue;
    if (!u.startsWith(BASE)) { console.log('NO BASE', f, u); bad++; continue; }
    let p = path.join(DIST, decodeURI(u.slice(BASE.length)));
    if (u.endsWith('/')) p = path.join(p, 'index.html');
    if (!fs.existsSync(p)) { console.log('MISSING', f, u); bad++; }
  }
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) { console.log('H1 x' + h1, f); bad++; }
  const noAlt = (html.match(/<img(?![^>]*\balt=)[^>]*>/g) || []).length;
  if (noAlt) { console.log('IMG без alt', f, noAlt); bad++; }
}
console.log(files.length, 'pages,', bad, 'problems');
process.exit(bad ? 1 : 0);
