// npm run check          Catches mistakes in extension/data/ before they reach students.
// npm run check:links    Also visits every website and reports dead or moved ones.
import fs from 'node:fs';
import { loadData, rel, ext, red, yellow, green, dim } from './lib.mjs';

const online = process.argv.includes('--online');
const { BELL_SCHEDULES, SCHOOL_YEARS, SUBJECTS, LINKS, MOVED_LINKS } = loadData();
const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

// ---------- Links ----------
const all = [];
for (const [category, list] of Object.entries(LINKS)) {
  if (!Array.isArray(list)) { err(`Category "${category}" must be a list [ ... ].`); continue; }
  list.forEach((e) => all.push({ ...e, category }));
}
const urls = new Map();
const homes = new Map();
const iconsUsed = new Set();
const allowed = new Set(['name', 'url', 'icon', 'mono', 'home', 'about', 'subjects', 'category']);
for (const e of all) {
  const who = `"${e.name || e.url || '(no name)'}" in ${e.category}`;
  for (const k of Object.keys(e)) if (!allowed.has(k)) err(`${who}: unknown field "${k}" (typo?).`);
  if (!e.name) err(`${who}: needs a name.`);
  else if (e.name.length > 24 || e.name.split(/\s+/).some((w) => w.length > 12)) warn(`${who}: the name may be cut off under the icon. Labels wrap onto two lines of about 12 characters.`);
  if (!e.url) err(`${who}: needs a url.`);
  else if (!/^https:\/\//.test(e.url) && !e.url.startsWith('/html/')) err(`${who}: url should start with https:// (got ${e.url}).`);
  if (e.url && urls.has(e.url)) err(`${who}: same url as "${urls.get(e.url)}". Each link needs its own url.`);
  if (e.url) urls.set(e.url, e.name);
  if (!e.icon) err(`${who}: needs an icon.`);
  else if (!fs.existsSync(ext('images', e.icon))) err(`${who}: extension/images/${e.icon} doesn't exist. Get it with: npm run icon -- ${e.icon.replace(/\.\w+$/, '')} <website>`);
  else iconsUsed.add(e.icon);
  if (!e.about) warn(`${who}: no "about" sentence, so students won't know what it's for.`);
  if (!Array.isArray(e.subjects)) err(`${who}: subjects must be a list, e.g. subjects: ['School'] (or [] to show only under All).`);
  else for (const s of e.subjects) if (!SUBJECTS.includes(s)) err(`${who}: subject "${s}" isn't in SUBJECTS. Choose from: ${SUBJECTS.join(', ')}.`);
  if (e.home != null) {
    if (!Number.isInteger(e.home) || e.home < 1) err(`${who}: home must be 1, 2, 3...`);
    else if (homes.has(e.home)) err(`${who}: home ${e.home} is already "${homes.get(e.home)}".`);
    else homes.set(e.home, e.name);
  }
}
if (!homes.size) err('No link has a home position, so a new install would have an empty home screen.');
for (const [from, to] of Object.entries(MOVED_LINKS)) {
  if (urls.has(from)) err(`MOVED_LINKS: ${from} is still in the catalog. Delete its entry, or remove it from MOVED_LINKS.`);
  if (to !== null && !urls.has(to)) err(`MOVED_LINKS: ${from} points to ${to}, which isn't in the catalog.`);
}

// ---------- Calendar ----------
const isoOf = (d) => d.toISOString().slice(0, 10);
const isDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(new Date(d + 'T12:00').getTime());
const today = new Date().toISOString().slice(0, 10);
let prevLast = '';
for (const y of SCHOOL_YEARS) {
  const who = `Calendar ${y.name || '(no name)'}`;
  if (!isDate(y.firstDay) || !isDate(y.lastDay)) { err(`${who}: firstDay and lastDay must look like '2027-09-08'.`); continue; }
  if (y.firstDay >= y.lastDay) err(`${who}: firstDay is after lastDay.`);
  if (y.firstDay <= prevLast) err(`${who}: overlaps the year before it (keep years in order).`);
  prevLast = y.lastDay;
  for (const c of y.closed || []) {
    const [a, b, why] = c;
    if (!isDate(a) || !isDate(b) || !why) { err(`${who}: closed entry ${JSON.stringify(c)} should be ['YYYY-MM-DD', 'YYYY-MM-DD', 'Reason'].`); continue; }
    if (a > b) err(`${who}: "${why}" ends before it starts.`);
    if (a < y.firstDay || b > y.lastDay) err(`${who}: "${why}" (${a}) is outside the school year.`);
  }
}
const last = SCHOOL_YEARS[SCHOOL_YEARS.length - 1];
if (last) {
  const daysLeft = (new Date(last.lastDay) - new Date(today)) / 864e5;
  if (daysLeft < 0) err(`The calendar ends ${last.lastDay}, so the period timer is off. Add the next school year to extension/data/calendar.js.`);
  else if (daysLeft < 90) warn(`The calendar ends ${last.lastDay}. Add next year to extension/data/calendar.js once the Board adopts it.`);
}
// Estimated years should be replaced by the real calendar before they start.
const soon = new Date(today); soon.setDate(soon.getDate() + 150);
for (const y of SCHOOL_YEARS) {
  if (y.estimated && y.firstDay <= isoOf(soon) && y.lastDay >= today) {
    warn(`${y.name} is still estimated (from past calendars; no spring break). Replace it with the Board-adopted calendar in extension/data/calendar.js and remove "estimated: true".`);
  }
}

// ---------- Bells ----------
const mins = (t) => { const m = /^(\d{1,2}):(\d{2})$/.exec(t); return m && +m[2] < 60 ? +m[1] * 60 + +m[2] : NaN; };
if (!BELL_SCHEDULES.regular) err("Bells: there must be a schedule called 'regular'.");
for (const [id, sched] of Object.entries(BELL_SCHEDULES)) {
  const who = `Bells (${id})`;
  if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(id)) err(`${who}: ids should be letters and numbers only.`);
  if (id === 'early' || id === 'closed') err(`${who}: "${id}" is reserved for early dismissal / snow days.`);
  if (!sched.name) err(`${who}: needs a name.`);
  if (!Array.isArray(sched.periods) || !sched.periods.length) { err(`${who}: needs periods.`); continue; }
  let prevEnd = 0;
  for (const [label, s, e] of sched.periods) {
    const a = mins(s), b = mins(e);
    if (Number.isNaN(a) || Number.isNaN(b)) { err(`${who}: period ${label} times should look like '7:40' or '13:45' (24-hour).`); continue; }
    if (a < 6 * 60) err(`${who}: period ${label} starts at ${s}. Use 24-hour times (1:45 pm is '13:45').`);
    if (a >= b) err(`${who}: period ${label} ends before it starts (afternoon times are 24-hour: '13:45').`);
    if (a < prevEnd) err(`${who}: period ${label} starts before the previous period ends.`);
    prevEnd = b;
  }
}
for (const y of SCHOOL_YEARS) {
  for (const sp of y.special || []) {
    const [day, id, time] = sp;
    const who = `Calendar ${y.name}: special ${JSON.stringify(sp)}`;
    if (!isDate(day) || day < y.firstDay || day > y.lastDay) err(`${who}: the date must be a school day in this year.`);
    if (id === 'early') { if (Number.isNaN(mins(time || ''))) err(`${who}: early dismissal needs a time, like ['2027-06-24', 'early', '11:00'].`); }
    else if (id !== 'closed' && !BELL_SCHEDULES[id]) err(`${who}: "${id}" isn't a schedule in extension/data/bells.js (${Object.keys(BELL_SCHEDULES).join(', ')}).`);
  }
}

// ---------- announcements.json ----------
let announcementCount = 0;
try {
  const text = fs.readFileSync(rel('announcements.json'), 'utf8');
  let json;
  try { json = JSON.parse(text); } catch (e) {
    err(`announcements.json isn't valid JSON (${e.message}). Usually a missing or extra comma, or a missing quote. Students keep the last good version until it's fixed.`);
  }
  if (json) {
    if (!Array.isArray(json.days)) err('announcements.json needs a "days": [ ... ] list.');
    else for (const row of json.days) {
      const who = `announcements.json ${JSON.stringify(row)}`;
      announcementCount++;
      if (!row || !isDate(row.date)) { err(`${who}: "date" should look like "2027-01-26".`); continue; }
      const ok = row.schedule === 'closed' || row.schedule === 'early' || BELL_SCHEDULES[row.schedule];
      if (!ok) err(`${who}: "schedule" must be one of ${[...Object.keys(BELL_SCHEDULES), 'early', 'closed'].join(', ')}.`);
      if (row.schedule === 'early' && Number.isNaN(mins(row.dismissal || ''))) err(`${who}: early dismissal needs "dismissal": "11:00" (24-hour).`);
      const extra = Object.keys(row).filter((k) => !['date', 'schedule', 'dismissal', 'message'].includes(k));
      if (extra.length) err(`${who}: unknown field ${extra.join(', ')} (typo?).`);
      const d = new Date(row.date + 'T12:00').getDay();
      if (d === 0 || d === 6) warn(`${who}: that's a weekend.`);
    }
  }
} catch {
  // No announcements file yet: nothing to check.
}

// ---------- Images nobody uses ----------
const extensionImages = new Set(['clock.png', 'open.png', 'pencil.png', 'moon.png', 'lightBulb.png', 'leftArrow.png', 'add.svg', 'remove.svg', 'ICONS.md']);
const unused = fs.readdirSync(ext('images')).filter((f) => !iconsUsed.has(f) && !extensionImages.has(f) && !/SimpleBonac/.test(f));

// ---------- Websites ----------
async function visit(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(url, { redirect: 'follow', signal: ctrl.signal, headers: { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131 Safari/537.36', accept: 'text/html,*/*' } });
    return { status: res.status, final: res.url };
  } catch (e) {
    return { status: 0, error: e.name === 'AbortError' ? 'timed out' : (e.cause && e.cause.code) || e.message };
  } finally {
    clearTimeout(timer);
  }
}
const dead = [], blocked = [], moved = [];
if (online) {
  const queue = all.filter((e) => e.url && e.url.startsWith('https://'));
  process.stdout.write(`Visiting ${queue.length} websites`);
  const work = async () => {
    for (let e = queue.shift(); e; e = queue.shift()) {
      const r = await visit(e.url);
      process.stdout.write('.');
      const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return u; } };
      if (r.status === 0) dead.push(`${e.name}: ${e.url} (${r.error})`);
      else if (r.status === 404 || r.status === 410 || r.status >= 500) dead.push(`${e.name}: ${e.url} (HTTP ${r.status})`);
      else if (r.status === 401 || r.status === 403 || r.status === 429) blocked.push(`${e.name}: ${e.url} (HTTP ${r.status}, the site blocks robots; open it yourself)`);
      else if (r.final && host(r.final) !== host(e.url) && !/accounts\.google|login|signin|auth/i.test(r.final)) moved.push(`${e.name}: ${e.url}\n      now goes to ${r.final}`);
    }
  };
  await Promise.all(Array.from({ length: 8 }, work));
  console.log('\n');
}

// ---------- Report ----------
const count = all.length;
console.log(`${count} links in ${Object.keys(LINKS).length} categories, ${homes.size} on a new home screen, ${SCHOOL_YEARS.length} school years, ${Object.keys(BELL_SCHEDULES).length} bell schedules, ${announcementCount} announcement(s).`);
if (unused.length) console.log(dim(`${unused.length} images aren't used by any current link (${unused.join(', ')}).\n  Keep them for a school year: deleted links can still be on students' home screens.`));
for (const w of warnings) console.log(yellow('! ' + w));
if (online) {
  for (const m of moved) console.log(yellow('→ Redirects elsewhere (update the url?): ' + m));
  for (const b of blocked) console.log(dim('? ' + b));
  for (const d of dead) console.log(red('✗ Looks dead: ' + d));
  if (!dead.length) console.log(green('✓ Every website responded.'));
}
for (const e of errors) console.log(red('✗ ' + e));
if (errors.length || (online && dead.length)) {
  console.log(red(`\n${errors.length + (online ? dead.length : 0)} problem(s) to fix.`));
  process.exit(1);
}
console.log(green('✓ All good.'));
