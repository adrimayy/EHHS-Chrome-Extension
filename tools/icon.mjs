// npm run icon -- <file-name> <website>
// Downloads a site's logo (the same one Google shows next to search results)
// into images/<file-name>.png, ready to use as  icon: '<file-name>.png'.
//   e.g.  npm run icon -- khan https://www.khanacademy.org
import fs from 'node:fs';
import { rel, red, yellow, green } from './lib.mjs';

const [name, site] = process.argv.slice(2);
if (!name || !site) {
  console.log('Usage: npm run icon -- <file-name> <website>\n  e.g. npm run icon -- khan https://www.khanacademy.org');
  process.exit(1);
}
const file = name.replace(/\.png$/, '') + '.png';
const dest = rel('images', file);
if (fs.existsSync(dest) && !process.argv.includes('--force')) {
  console.log(yellow(`images/${file} already exists. Add --force to replace it.`));
  process.exit(1);
}

const api = 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=128&url=';
const res = await fetch(api + encodeURIComponent(site)).catch((e) => ({ ok: false, status: e.message }));
if (typeof res.status !== 'number') {
  console.log(red(`Couldn't reach Google (${res.status}). Check your internet connection.`));
  process.exit(1);
}
if (!res.ok) {
  console.log(red(`Google has no logo for ${site} (HTTP ${res.status}).`));
  console.log('Save a square PNG yourself (128 to 192 px) as images/' + file + ',\nor use a one-color glyph from https://fonts.google.com/icons with mono: true.');
  process.exit(1);
}
const buf = Buffer.from(await res.arrayBuffer());
const isPng = buf.subarray(1, 4).toString() === 'PNG';
const width = isPng ? buf.readUInt32BE(16) : 0;
fs.writeFileSync(dest, buf);
console.log(green(`Saved images/${file}`) + (width ? ` (${width}px)` : ''));
if (width && width < 64) console.log(yellow(`Only ${width}px, so it will look blurry. Look for a bigger square logo (e.g. on Google Images) and save it over this file.`));
console.log(`Use it in data/links.js as:  icon: '${file}'`);
