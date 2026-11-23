// Toolbar-badge logic. Needs data/bells.js and schoolCalendar.js loaded first.
// Loaded by the service worker (importScripts) and by extension pages (<script>).

const toSeconds = (hm) => { const [h, m] = hm.split(':').map(Number); return h * 3600 + m * 60; };

// Extra choices besides the bell schedules in data/bells.js.
const CLOSED_ID = 'closed';
const EARLY_ID = 'early';

// Which schedule a day follows, newest decision first:
//   - a school announcement (announcements.json, posted by the teacher), or what
//     the student picked for today: whichever was set most recently,
//   - else a `special` day in data/calendar.js,
//   - else the regular schedule.
// Returns { id, name, source, message, closed, dismissal, periods: [[label, startSec, endSec]] }.
function todaysPlan(date, picked, announced) {
  const day = isoDay(date);
  let choice = null;
  let source = '';
  const pick = picked && picked.date === day && picked.id ? picked : null;
  const news = announced && announced.days && announced.days[day] ? announced.days[day] : null;
  if (pick && (!news || (pick.at || 0) > (news.seenAt || 0))) { choice = pick; source = 'picked'; }
  else if (news) { choice = news; source = 'school'; }
  else {
    const info = getSchoolDayInfo(date);
    if (info.special) { choice = info.special; source = 'calendar'; }
  }
  const message = source === 'school' ? news.message || '' : '';
  const id = choice ? choice.id : 'regular';
  if (id === CLOSED_ID) return { id, name: 'No school', source, message, closed: true, periods: [] };
  if (id === EARLY_ID && choice.dismissal) {
    // No official half-day schedule is published, so follow the regular bells
    // and stop at the dismissal time.
    const cut = toSeconds(choice.dismissal);
    const periods = BELL_SCHEDULES.regular.periods
      .map(([label, a, b]) => [label, toSeconds(a), Math.min(toSeconds(b), cut)])
      .filter(([, a, b]) => a < cut && a < b);
    return { id, name: 'Early dismissal at ' + formatClock(choice.dismissal), source, message, dismissal: choice.dismissal, periods };
  }
  const schedule = BELL_SCHEDULES[id] || BELL_SCHEDULES.regular;
  return {
    id: BELL_SCHEDULES[id] ? id : 'regular',
    name: schedule.name,
    source,
    message,
    periods: schedule.periods.map(([label, a, b]) => [label, toSeconds(a), toSeconds(b)])
  };
}

// '13:45' -> '1:45'
function formatClock(hm) {
  const [h, m] = hm.split(':').map(Number);
  return (h > 12 ? h - 12 : h) + ':' + String(m).padStart(2, '0');
}

// The picker's options: every bell schedule, then early dismissal and closed.
function scheduleChoices() {
  return [
    ...Object.entries(BELL_SCHEDULES).map(([id, s]) => ({ id, name: s.name })),
    { id: EARLY_ID, name: 'Early dismissal' },
    { id: CLOSED_ID, name: 'No school (snow day)' }
  ];
}

function getPickedSchedule() {
  return new Promise((resolve) => chrome.storage.local.get('todaySchedule', (d) => resolve(d.todaySchedule || null)));
}
// Saves a choice for today only (null clears it); it expires on its own tomorrow.
function setPickedSchedule(id, dismissal) {
  const value = id ? { date: isoDay(new Date()), id, dismissal: dismissal || null, at: Date.now() } : null;
  return chrome.storage.local.set({ todaySchedule: value });
}

// ---------- School announcements ----------
// The extension reads announcements.json from GitHub (ANNOUNCEMENTS_URL in
// data/calendar.js) every 15 minutes and when the popup opens, so a teacher can post a delay, snow day
// or early dismissal once and every student's timer follows it.
const VALID_ID = (id) => id === CLOSED_ID || id === EARLY_ID || Object.prototype.hasOwnProperty.call(BELL_SCHEDULES, id);

function getAnnouncements() {
  return new Promise((resolve) => chrome.storage.local.get('announcements', (d) => resolve(d.announcements || null)));
}

// Turns the file into { days: { 'YYYY-MM-DD': { id, dismissal, message } } }, skipping bad rows.
function parseAnnouncements(json) {
  const days = {};
  const rows = json && Array.isArray(json.days) ? json.days : [];
  for (const row of rows) {
    if (!row || !/^\d{4}-\d{2}-\d{2}$/.test(row.date) || !VALID_ID(row.schedule)) continue;
    if (row.schedule === EARLY_ID && !/^\d{1,2}:\d{2}$/.test(row.dismissal || '')) continue;
    days[row.date] = { id: row.schedule, dismissal: row.schedule === EARLY_ID ? row.dismissal : null, message: String(row.message || '').slice(0, 200) };
  }
  return days;
}

// Checks at most once every 5 minutes per computer (the whole school shares one
// internet connection, and GitHub limits how often one connection can ask).
const ANNOUNCEMENT_MIN_GAP_MS = 5 * 60 * 1000;

async function syncAnnouncements() {
  if (typeof ANNOUNCEMENTS_URL !== 'string' || !ANNOUNCEMENTS_URL) return null;
  const { announcementsCheckedAt = 0 } = await chrome.storage.local.get('announcementsCheckedAt');
  if (Date.now() - announcementsCheckedAt < ANNOUNCEMENT_MIN_GAP_MS) return null;
  await chrome.storage.local.set({ announcementsCheckedAt: Date.now() });
  try {
    const res = await fetch(ANNOUNCEMENTS_URL + '?t=' + Math.floor(Date.now() / 60000), { cache: 'no-store' });
    if (!res.ok) return null;
    const fresh = parseAnnouncements(await res.json());
    const old = (await getAnnouncements()) || { days: {} };
    const now = Date.now();
    const today = isoDay(new Date());
    const days = {};
    for (const [day, entry] of Object.entries(fresh)) {
      if (day < today) continue;
      const before = old.days[day];
      const same = before && before.id === entry.id && before.dismissal === entry.dismissal && before.message === entry.message;
      // seenAt: when this announcement first reached this computer. A student's
      // own pick made after it wins; an announcement posted after a pick wins.
      days[day] = { ...entry, seenAt: same ? before.seenAt : now };
    }
    const value = { days };
    if (JSON.stringify(old.days) !== JSON.stringify(days)) await chrome.storage.local.set({ announcements: value });
    return value;
  } catch (e) {
    return null; // offline or a broken file: keep the last good copy
  }
}

// Chrome only wakes an extension's service worker about every 30 seconds (alarms
// can't fire sooner, and they can fire late). So the badge is calculated as if it
// were already 30 seconds later: whatever it shows stays true until the next
// update. "4m" always means "4 minutes or less left", never more.
const BADGE_BUFFER_SECONDS = 30;

// Show the countdown to period 1 starting this long before it begins.
const BADGE_MORNING_LEAD_SECONDS = 60 * 60;

const BADGE_DEFAULTS = {
  badgeEnabled: true
};

const BADGE_COLORS = {
  inPeriod: '#595959',
  passing: '#214fc6',
  almostDone: '#a80038'
};

// School days come from the district calendar in schoolCalendar.js.
function isSchoolDay(date) {
  return getSchoolDayInfo(date).schoolDay;
}

// Where we are in today's bells right now, or null after the last period.
function getPeriodStatus(date, plan = todaysPlan(date, null)) {
  const t = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  for (let i = 0; i < plan.periods.length; i++) {
    const [label, start, end] = plan.periods[i];
    if (t < start) return { period: label, index: i, inPeriod: false, secondsLeft: start - t };
    if (t < end) return { period: label, index: i, inPeriod: true, secondsLeft: end - t };
  }
  return null;
}

// Returns { text, color, secondsUntilChange } — text '' means show no badge.
function computeBadge(date, settings) {
  if (!settings.badgeEnabled || !isSchoolDay(date)) return { text: '', secondsUntilChange: null };
  const plan = todaysPlan(date, settings.todaySchedule, settings.announcements);
  if (plan.closed) return { text: '', secondsUntilChange: null };
  const status = getPeriodStatus(date, plan);
  if (!status) return { text: '', secondsUntilChange: null };

  if (!status.inPeriod && status.index === 0 && status.secondsLeft > BADGE_MORNING_LEAD_SECONDS) {
    return { text: '', secondsUntilChange: status.secondsLeft - BADGE_MORNING_LEAD_SECONDS };
  }

  const buffered = status.secondsLeft - BADGE_BUFFER_SECONDS;
  if (buffered <= 0) {
    return { text: '<1m', color: BADGE_COLORS.almostDone, secondsUntilChange: status.secondsLeft + 1 };
  }
  const minutes = Math.ceil(buffered / 60);
  const color = minutes <= 1 ? BADGE_COLORS.almostDone : (status.inPeriod ? BADGE_COLORS.inPeriod : BADGE_COLORS.passing);
  // The text next changes when the buffered time drops below the next whole minute.
  const untilTick = (buffered % 60) || 60;
  return { text: minutes + 'm', color, secondsUntilChange: untilTick + 1 };
}

// Badge on/off (synced) plus today's picked schedule (this computer only).
async function getBadgeSettings() {
  const settings = await new Promise((resolve) => chrome.storage.sync.get(BADGE_DEFAULTS, resolve));
  settings.todaySchedule = await getPickedSchedule();
  settings.announcements = await getAnnouncements();
  return settings;
}

// When the badge next needs to be showing: the morning lead before the first
// bell of the next school day (today included). Null if no calendar covers it.
function nextBadgeStart(now, settings) {
  const enabled = settings.badgeEnabled;
  if (!enabled) return null;
  for (let i = 0; i < 400; i++) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, 12);
    const info = getSchoolDayInfo(day);
    if (!info.year && isoDay(day) > SCHOOL_YEARS[SCHOOL_YEARS.length - 1].lastDay) return null;
    if (!info.schoolDay) continue;
    const plan = todaysPlan(day, settings.todaySchedule, settings.announcements);
    if (plan.closed || !plan.periods.length) continue;
    const midnight = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
    const start = midnight + (plan.periods[0][1] - BADGE_MORNING_LEAD_SECONDS) * 1000;
    const end = midnight + plan.periods[plan.periods.length - 1][2] * 1000;
    if (end > now.getTime()) return Math.max(start, now.getTime());
  }
  return null;
}

// Keeps the badge right while using as little of the computer as possible:
// during school hours, an exact alarm for each change plus a 1-minute backup;
// outside them (nights, weekends, breaks, summer), one alarm for the next
// morning and nothing else.
async function refreshBadge() {
  if (!chrome.action) return null;
  const settings = await getBadgeSettings();
  const now = new Date();
  const badge = computeBadge(now, settings);
  try {
    await chrome.action.setBadgeText({ text: badge.text });
    if (badge.text) {
      await chrome.action.setBadgeBackgroundColor({ color: badge.color });
      if (chrome.action.setBadgeTextColor) await chrome.action.setBadgeTextColor({ color: '#ffffff' });
    }
    if (chrome.alarms) {
      const next = nextBadgeStart(now, settings);
      const active = next !== null && next <= now.getTime() + 60 * 1000;
      if (active) {
        if (badge.secondsUntilChange) chrome.alarms.create('badge-exact', { when: Date.now() + badge.secondsUntilChange * 1000 });
        const beat = await chrome.alarms.get('badge-heartbeat');
        if (!beat) chrome.alarms.create('badge-heartbeat', { periodInMinutes: 1 });
      } else {
        chrome.alarms.clear('badge-heartbeat');
        if (next) chrome.alarms.create('badge-exact', { when: next });
        else chrome.alarms.clear('badge-exact');
      }
    }
  } catch (e) {
    console.warn('Badge update failed', e);
  }
  return badge;
}

// Background checks for announcements only when one could matter: 5 am to 10 pm,
// from two weeks before the school year until it ends. (Opening the popup
// always checks.)
function worthCheckingAnnouncements(now) {
  const hour = now.getHours();
  if (hour < 5 || hour >= 22) return false;
  const day = isoDay(now);
  return SCHOOL_YEARS.some((y) => {
    const early = new Date(y.firstDay + 'T12:00');
    early.setDate(early.getDate() - 14);
    return day >= isoDay(early) && day <= y.lastDay;
  });
}
