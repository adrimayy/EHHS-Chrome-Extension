// Background service worker: keeps the toolbar badge showing time left in the period.
importScripts('/data/bells.js', '/data/calendar.js', '/data/links.js', '/js/schoolCalendar.js', '/js/defaultLinks.js', '/js/schedule.js');

function setupBadge() {
  chrome.alarms.create('badge-heartbeat', { periodInMinutes: 1 });
  refreshBadge();
}

// After an update, fix dead links in lists saved by older versions.
chrome.runtime.onInstalled.addListener(() => migrateStoredLinks());

chrome.runtime.onInstalled.addListener(setupBadge);
chrome.runtime.onStartup.addListener(setupBadge);

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name.startsWith('badge-')) refreshBadge();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.badgeEnabled) refreshBadge();
});

// Any time the worker wakes up (alarm, computer waking from sleep, browser start),
// fix the badge right away. Make sure the heartbeat exists too.
chrome.alarms.get('badge-heartbeat', (alarm) => {
  if (!alarm) chrome.alarms.create('badge-heartbeat', { periodInMinutes: 1 });
});
refreshBadge();
