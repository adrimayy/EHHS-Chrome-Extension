// Toolbar-badge logic. Needs data/bells.js and schoolCalendar.js loaded first.
// Loaded by the service worker (importScripts) and by extension pages (<script>).

const toSeconds = (hm) => { const [h, m] = hm.split(':').map(Number); return h * 3600 + m * 60; };

// Extra choices besides the bell schedules in data/bells.js.
const CLOSED_ID = 'closed';
const EARLY_ID = 'early';

// Which schedule a day follows:
//   1. what the student picked for today (chrome.storage.local `todaySchedule`),
//   2. else a `special` day in data/calendar.js,
//   3. else the regular schedule.
// Returns { id, name, source, closed, dismissal, periods: [[label, startSec, endSec]] }.
function todaysPlan(date, picked) {
  const day = isoDay(date);
  let choice = null;
  let source = '';
  if (picked && picked.date === day && picked.id) { choice = picked; source = 'picked'; }
  else {
    const info = getSchoolDayInfo(date);
    if (info.special) { choice = info.special; source = 'calendar'; }
  }
  const id = choice ? choice.id : 'regular';
  if (id === CLOSED_ID) return { id, name: 'No school today', source, closed: true, periods: [] };
  if (id === EARLY_ID && choice.dismissal) {
    // No official half-day schedule is published, so follow the regular bells
    // and stop at the dismissal time.
    const cut = toSeconds(choice.dismissal);
    const periods = BELL_SCHEDULES.regular.periods
      .map(([label, a, b]) => [label, toSeconds(a), Math.min(toSeconds(b), cut)])
      .filter(([, a, b]) => a < cut && a < b);
    return { id, name: 'Early dismissal at ' + formatClock(choice.dismissal), source, dismissal: choice.dismissal, periods };
  }
  const schedule = BELL_SCHEDULES[id] || BELL_SCHEDULES.regular;
  return {
    id: BELL_SCHEDULES[id] ? id : 'regular',
    name: schedule.name,
    source,
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
// Saves a choice for today only; it expires on its own tomorrow.
function setPickedSchedule(id, dismissal) {
  const now = new Date();
  // Picking 'regular' just clears the pick, unless the calendar set something else today.
  const backToNormal = id === 'regular' && !getSchoolDayInfo(now).special;
  const value = backToNormal ? null : { date: isoDay(now), id, dismissal: dismissal || null };
  return chrome.storage.local.set({ todaySchedule: value });
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
  const plan = todaysPlan(date, settings.todaySchedule);
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
  return settings;
}

async function refreshBadge() {
  if (!chrome.action) return null;
  const settings = await getBadgeSettings();
  const badge = computeBadge(new Date(), settings);
  try {
    await chrome.action.setBadgeText({ text: badge.text });
    if (badge.text) {
      await chrome.action.setBadgeBackgroundColor({ color: badge.color });
      if (chrome.action.setBadgeTextColor) await chrome.action.setBadgeTextColor({ color: '#ffffff' });
    }
    // One exact wake-up for the next time the text changes. A 1-minute heartbeat
    // (set in the service worker) backs this up in case Chrome delays or drops it.
    if (chrome.alarms && badge.secondsUntilChange) {
      chrome.alarms.create('badge-exact', { when: Date.now() + badge.secondsUntilChange * 1000 });
    }
    chrome.storage.local.set({ badgeUpdatedAt: Date.now() });
  } catch (e) {
    console.warn('Badge update failed', e);
  }
  return badge;
}
