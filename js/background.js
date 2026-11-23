// The time-left chip in the popup. Follows today's bell schedule (schedule.js):
// the regular bells, a delay or homeroom schedule, or an early dismissal.
const periodElement = document.getElementById("periodTime");
let picked = null;
let announced = null;

function updateBadge() {
  const now = new Date();
  if (!getSchoolDayInfo(now).schoolDay) {
    periodElement.remove();
    return false;
  }
  const plan = todaysPlan(now, picked, announced);
  const status = plan.closed ? null : getPeriodStatus(now, plan);
  if (!status) {
    periodElement.remove();
    return false;
  }
  updateBadgeTextAndColor(status.secondsLeft, status.inPeriod);
  return true;
}

function updateBadgeTextAndColor(timeLeft, inPeriod) {
  let timeText = "";
  let color;

  if (timeLeft <= 60) {
    timeText = timeLeft.toString() + "s";
    color = "var(--title-color)";
  } else if (timeLeft <= 3600) {
    timeText = Math.ceil(timeLeft / 60).toString() + "m";
    color = inPeriod ? "var(--grey-time-color)" : "var(--blue-time-color)";
  } else {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.ceil((timeLeft % 3600) / 60);
    timeText = hours.toString() + "h" + minutes.toString() + "m";
    color = inPeriod ? "var(--grey-time-color)" : "var(--blue-time-color)";
  }

  periodElement.innerText = timeText;
  periodElement.style.backgroundColor = color;
}

// A one-line notice when today (or tomorrow) isn't a regular day.
function showNotice() {
  const box = document.getElementById('schoolNotice');
  if (!box || new URLSearchParams(location.search).has('edit')) return;
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 12);
  const describe = (plan) => plan.name + (plan.message ? ' · ' + plan.message : '');
  let text = '';
  if (getSchoolDayInfo(now).schoolDay) {
    const today = todaysPlan(now, picked, announced);
    if (today.id !== 'regular') text = 'Today: ' + describe(today);
  }
  if (!text && getSchoolDayInfo(tomorrow).schoolDay) {
    const next = todaysPlan(tomorrow, null, announced);
    if (next.source === 'school' || next.source === 'calendar') text = 'Tomorrow: ' + describe(next);
  }
  box.textContent = text;
  box.hidden = !text;
}

Promise.all([getPickedSchedule(), getAnnouncements()]).then(([p, a]) => {
  picked = p;
  announced = a;
  showNotice();
  if (!updateBadge()) return;
  (function scheduleUpdate() {
    const delay = 1000 - new Date().getMilliseconds();
    setTimeout(() => { if (updateBadge()) scheduleUpdate(); }, delay);
  })();
});

// Opening the popup also refreshes the toolbar badge, in case Chrome put the
// background worker to sleep longer than expected.
// Opening the popup also checks for new school announcements.
if (typeof refreshBadge === 'function') refreshBadge();
if (typeof syncAnnouncements === 'function') {
  syncAnnouncements().then(async () => {
    announced = await getAnnouncements();
    showNotice();
  });
}
