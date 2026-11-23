// Turns data/links.js into what the pages use, and keeps every student's saved
// links in step with it. You shouldn't need to edit this file to change links.
//
// Saved link format: [name, url, image, iconStyle ('color' | 'black'), flag ('custom' or '')]

const CUSTOM_CATEGORY = 'My links';
const LINK_CATEGORIES = Object.keys(LINKS);
const toSaved = (e) => [e.name, e.url, '/images/' + e.icon, e.mono ? 'black' : 'color'];
const ALL_DEFAULT_LINKS = LINK_CATEGORIES.flatMap((c) => LINKS[c].map(toSaved));
const DEFAULT_BY_URL = new Map(ALL_DEFAULT_LINKS.map((l) => [l[1], l]));
const CATEGORY_BY_URL = new Map(LINK_CATEGORIES.flatMap((c) => LINKS[c].map((e) => [e.url, c])));
const INFO_BY_URL = new Map(LINK_CATEGORIES.flatMap((c) => LINKS[c].map((e) => [e.url, { desc: e.about || '', tags: e.subjects || [] }])));

// A fresh install's home screen: every link with `home`, in that order.
const DEFAULT_HOME_URLS = LINK_CATEGORIES.flatMap((c) => LINKS[c])
  .filter((e) => e.home).sort((a, b) => a.home - b.home).map((e) => e.url);
const DEFAULT_ADDED_LINKS = DEFAULT_HOME_URLS.map((url) => DEFAULT_BY_URL.get(url).slice());
const DEFAULT_REMOVED_LINKS = ALL_DEFAULT_LINKS.filter((l) => !DEFAULT_HOME_URLS.includes(l[1])).map((l) => l.slice());

function categoryOf(link) {
  if (link[4] === 'custom') return CUSTOM_CATEGORY;
  return CATEGORY_BY_URL.get(link[1]) || CUSTOM_CATEGORY;
}
function infoOf(link) {
  return (link[4] !== 'custom' && INFO_BY_URL.get(link[1])) || { desc: '', tags: [] };
}

// ---------- Keeping saved links in step with data/links.js ----------
// Runs whenever the catalog changes (detected with a fingerprint, so there's no
// version number to bump). It remembers which links the catalog had last time,
// so it can tell a link the developer deleted from one a student added.

// Links removed in reviews before this system existed (it can't know about them
// on its own). Never needs adding to: deleting from data/links.js is enough now.
const LEGACY_REMOVED_URLS = new Set([
  'https://zbib.org/', 'https://www.symbolab.com/', 'https://www.geogebra.org/calculator',
  'https://www.udemy.com/', 'https://www.verbix.com/', 'https://www.shmoop.com/',
  'https://brainly.com/', 'https://www.coursehero.com/', 'https://pixlr.com/'
]);

const CATALOG_FINGERPRINT = (() => {
  const text = JSON.stringify([LINKS, MOVED_LINKS]);
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h * 33) ^ text.charCodeAt(i)) >>> 0;
  return h.toString(36) + text.length.toString(36);
})();

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

// Brings saved lists up to date. Safe to call from any page or the service worker.
async function migrateStoredLinks() {
  const data = await chrome.storage.local.get(['addedLinks', 'removedLinks', 'catalogFingerprint', 'catalogNames']);
  if (data.catalogFingerprint === CATALOG_FINGERPRINT) return false;
  const catalogNames = Object.fromEntries(ALL_DEFAULT_LINKS.map((l) => [l[1], l[0]]));
  const stamp = { catalogFingerprint: CATALOG_FINGERPRINT, catalogNames };
  if (!data.addedLinks && !data.removedLinks) {
    await chrome.storage.local.set(stamp);
    return false;
  }
  const lastNames = data.catalogNames || null; // null: first run of this system
  const wasBuiltIn = (url) => (lastNames ? hasOwn(lastNames, url) : DEFAULT_BY_URL.has(url)) || LEGACY_REMOVED_URLS.has(url);

  // Home screen: keep the student's order. Built-in links pick up new logos and
  // names (unless the student renamed them); moved links follow; dead ones go.
  const seen = new Set();
  const added = [];
  for (const link of data.addedLinks ? JSON.parse(data.addedLinks) : DEFAULT_ADDED_LINKS) {
    let next = link;
    if (link[4] !== 'custom') {
      if (hasOwn(MOVED_LINKS, link[1])) {
        const to = MOVED_LINKS[link[1]];
        if (to === null || !DEFAULT_BY_URL.has(to)) continue;
        next = DEFAULT_BY_URL.get(to).slice();
      } else if (DEFAULT_BY_URL.has(link[1])) {
        const d = DEFAULT_BY_URL.get(link[1]);
        const renamed = lastNames ? link[0] !== lastNames[link[1]] : true;
        const ownIcon = !String(link[2]).startsWith('/images/');
        next = [renamed ? link[0] : d[0], d[1], ownIcon ? link[2] : d[2], ownIcon ? link[3] : d[3]];
      }
    }
    const key = next[4] === 'custom' ? JSON.stringify(next) : next[1];
    if (seen.has(key)) continue;
    seen.add(key);
    added.push(next);
  }

  // App Library: the student's own links, then every catalog link not on the
  // home screen, in catalog order. Links the developer deleted drop out.
  const removed = [];
  for (const link of data.removedLinks ? JSON.parse(data.removedLinks) : []) {
    const own = link[4] === 'custom' || (!wasBuiltIn(link[1]) && !hasOwn(MOVED_LINKS, link[1]) && !DEFAULT_BY_URL.has(link[1]));
    const key = link[4] === 'custom' ? JSON.stringify(link) : link[1];
    if (own && !seen.has(key)) { seen.add(key); removed.push(link); }
  }
  for (const link of ALL_DEFAULT_LINKS) {
    if (!seen.has(link[1])) { seen.add(link[1]); removed.push(link.slice()); }
  }

  await chrome.storage.local.set({ addedLinks: JSON.stringify(added), removedLinks: JSON.stringify(removed), ...stamp });
  return true;
}
