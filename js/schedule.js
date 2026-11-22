// Shared bell schedule + toolbar-badge logic. Needs schoolCalendar.js loaded first.
// Loaded by the service worker (importScripts) and by extension pages (<script>).

// [period, start (seconds after midnight), end (seconds after midnight)]
const PERIOD_TIMES = [
  [1, 7*3600 + 40*60, 8*3600 + 21*60],
  [2, 8*3600 + 30*60, 9*3600 + 11*60],
  [3, 9*3600 + 15*60, 9*3600 + 56*60],
  [4, 10*3600 + 0*60, 10*3600 + 41*60],
  [5, 10*3600 + 45*60, 11*3600 + 26*60],
  [6, 11*3600 + 30*60, 12*3600 + 11*60],
  [7, 12*3600 + 15*60, 12*3600 + 56*60],
  [8, 13*3600 + 0*60, 13*3600 + 41*60],
  [9, 13*3600 + 45*60, 14*3600 + 26*60]
];

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

// Where we are in the bell schedule right now, or null after the last period.
function getPeriodStatus(date) {
  const t = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  for (const [num, start, end] of PERIOD_TIMES) {
    if (t < start) return { period: num, inPeriod: false, secondsLeft: start - t };
    if (t < end) return { period: num, inPeriod: true, secondsLeft: end - t };
  }
  return null;
}

// Returns { text, color, secondsUntilChange } — text '' means show no badge.
function computeBadge(date, settings) {
  if (!settings.badgeEnabled || !isSchoolDay(date)) return { text: '', secondsUntilChange: null };
  const status = getPeriodStatus(date);
  if (!status) return { text: '', secondsUntilChange: null };

  if (!status.inPeriod && status.period === 1 && status.secondsLeft > BADGE_MORNING_LEAD_SECONDS) {
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

function getBadgeSettings() {
  return new Promise((resolve) => chrome.storage.sync.get(BADGE_DEFAULTS, resolve));
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
