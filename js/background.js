// The time-left chip in the popup. Follows today's bell schedule (schedule.js):
// the regular bells, a delay or homeroom schedule, or an early dismissal.
const periodElement = document.getElementById("periodTime");
let picked = null;

function updateBadge() {
  const now = new Date();
  if (!getSchoolDayInfo(now).schoolDay) {
    periodElement.remove();
    return false;
  }
  const plan = todaysPlan(now, picked);
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

getPickedSchedule().then((p) => {
  picked = p;
  if (!updateBadge()) return;
  (function scheduleUpdate() {
    const delay = 1000 - new Date().getMilliseconds();
    setTimeout(() => { if (updateBadge()) scheduleUpdate(); }, delay);
  })();
});

// Opening the popup also refreshes the toolbar badge, in case Chrome put the
// background worker to sleep longer than expected.
if (typeof refreshBadge === 'function') refreshBadge();
