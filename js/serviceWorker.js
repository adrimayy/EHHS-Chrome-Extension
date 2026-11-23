// Background service worker: keeps the toolbar badge showing time left in the
// period, and checks for school announcements. Chrome puts it to sleep between
// alarms; refreshBadge() only keeps alarms running during school hours.
importScripts('/data/bells.js', '/data/calendar.js', '/data/links.js', '/js/schoolCalendar.js', '/js/defaultLinks.js', '/js/schedule.js');

function checkAnnouncements() {
  if (worthCheckingAnnouncements(new Date())) syncAnnouncements();
}

// Chrome forgets a changed toolbar icon when it restarts; put the dark-mode one back.
function restoreIcon() {
  chrome.storage.sync.get('mode', ({ mode }) => {
    if (mode !== 'dark') return;
    const path = {};
    for (const size of [16, 32, 48, 128]) path[size] = `/images/lightSimpleBonac${size}.png`;
    chrome.action.setIcon({ path });
  });
}

function setup() {
  restoreIcon();
  chrome.alarms.create('announcements', { periodInMinutes: 15 });
  checkAnnouncements();
  refreshBadge();
}

// After an update, bring saved links in step with data/links.js.
chrome.runtime.onInstalled.addListener(() => migrateStoredLinks());
chrome.runtime.onInstalled.addListener(setup);
chrome.runtime.onStartup.addListener(setup);

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name.startsWith('badge-')) refreshBadge();
  if (alarm.name === 'announcements') checkAnnouncements();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if ((area === 'sync' && changes.badgeEnabled) || (area === 'local' && (changes.todaySchedule || changes.announcements))) refreshBadge();
});

// Waking up (alarm, computer waking from sleep, browser start): fix the badge
// right away, and make sure the announcements check exists.
chrome.alarms.get('announcements', (alarm) => {
  if (!alarm) chrome.alarms.create('announcements', { periodInMinutes: 15 });
});
refreshBadge();
