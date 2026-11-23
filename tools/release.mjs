// npm run release              Bumps the version (0.6.0 -> 0.6.1), checks everything,
//                              and builds dist/ehhs-extension-<version>.zip.
// npm run release -- minor     0.6.1 -> 0.7.0
// npm run release -- 1.0.0     An exact version.
// Upload the zip in the Chrome Web Store developer dashboard.
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { rel, ext, red, green } from './lib.mjs';

const check = spawnSync(process.execPath, [rel('tools/check.mjs')], { stdio: 'inherit' });
if (check.status !== 0) { console.log(red('\nFix the problems above, then run the release again.')); process.exit(1); }

const manifestPath = ext('manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const [maj, min, pat] = manifest.version.split('.').map(Number);
const arg = process.argv[2] || 'patch';
const version = arg === 'patch' ? `${maj}.${min}.${pat + 1}`
  : arg === 'minor' ? `${maj}.${min + 1}.0`
  : arg === 'major' ? `${maj + 1}.0.0`
  : arg;
if (!/^\d+\.\d+\.\d+$/.test(version)) { console.log(red(`"${arg}" isn't a version. Use patch, minor, major or something like 1.2.3.`)); process.exit(1); }
manifest.version = version;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

// The zip is the extension/ folder's contents, with manifest.json at the top
// level, which is what the Chrome Web Store expects.
fs.mkdirSync(rel('dist'), { recursive: true });
const zipName = `ehhs-extension-${version}.zip`;
const zipPath = rel('dist', zipName);
if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
const zip = process.platform === 'win32'
  ? spawnSync('tar', ['-a', '-c', '-f', zipPath, '*'], { cwd: ext(), stdio: 'inherit', shell: true })
  : spawnSync('zip', ['-qr', zipPath, '.', '-x', '*.DS_Store', 'images/ICONS.md'], { cwd: ext(), stdio: 'inherit' });
if (zip.status !== 0) { console.log(red('Couldn\'t create the zip (is the "zip" command installed?).')); process.exit(1); }

const kb = Math.round(fs.statSync(zipPath).size / 1024);
console.log(green(`\n✓ Version ${version}: dist/${zipName} (${kb} KB)`));
console.log('Next: commit, then upload the zip at https://chrome.google.com/webstore/devconsole');
