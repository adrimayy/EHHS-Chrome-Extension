// The Schedule page: today's bells, with the current period highlighted.
// Bell times come from data/bells.js; which schedule applies today comes from
// todaysPlan() in schedule.js (regular, a delay, homeroom, early dismissal...).
const locX = 12;
const ROW = 20;
const devicePixelRatio = window.devicePixelRatio || 1;
const canvas = document.getElementById('period-schedule');
const ctx = canvas.getContext('2d');
const WIDTH = 270;
const SCALE = WIDTH / 175;
let HEIGHT = 0;

// Tall enough for today's periods plus the "min left" line under them.
function sizeCanvas() {
  const h = Math.ceil((rowY(Math.max(plan.periods.length, 1)) + 14) * SCALE);
  if (h === HEIGHT) return;
  HEIGHT = h;
  canvas.width = WIDTH * devicePixelRatio;
  canvas.height = HEIGHT * devicePixelRatio;
  canvas.style.width = WIDTH + 'px';
  canvas.style.height = HEIGHT + 'px';
}

let picked = null;
let plan = todaysPlan(new Date(), null);
const toClock = (sec) => formatClock(Math.floor(sec / 3600) + ':' + String(Math.floor(sec / 60) % 60).padStart(2, '0'));
const rowY = (i) => ROW * i + 44;

function draw() {
  const scale = SCALE;
  sizeCanvas();
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  ctx.fillStyle = getBackgroundColor();
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.scale(scale, scale);
  const now = new Date();
  const t = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  displayTime(now);
  if (plan.closed || !getSchoolDayInfo(now).schoolDay) {
    ctx.font = '13px sans-serif';
    ctx.fillStyle = getTextColor();
    ctx.fillText(plan.closed ? 'No school today.' : `No school today (${getSchoolDayInfo(now).reason}).`, locX, 44);
    return;
  }
  printPeriodsAndTimes();
  highlightCurrentPeriod(t);
}

function displayTime(now) {
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  ctx.font = 'bold 21px sans-serif';
  ctx.fillStyle = getTextColor();
  ctx.fillText(`Time: ${h > 12 ? h - 12 : h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`, locX, 19);
}

function printPeriodsAndTimes() {
  ctx.font = 'normal 13px sans-serif';
  ctx.fillStyle = getTextColor();
  plan.periods.forEach(([label, start, end], i) => {
    ctx.fillText(label === 'HR' ? 'Homeroom' : `Period ${label}`, locX, rowY(i), 60);
    ctx.fillText(`${toClock(start)} - ${toClock(end)}`, locX + 70, rowY(i));
  });
  ctx.strokeStyle = getTextColor();
  ctx.beginPath();
  ctx.moveTo(locX + 63, rowY(0) - 14);
  ctx.lineTo(locX + 63, rowY(plan.periods.length - 1) + 6);
  ctx.stroke();
}

function highlightCurrentPeriod(t) {
  const footer = rowY(plan.periods.length) + 6;
  plan.periods.forEach(([, start, end], i) => {
    if (t >= start && t < end) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 12, 12, 0.35)';
      ctx.fillRect(locX - 7, rowY(i) - 14.5, 160, 20);
      const left = Math.ceil((end - t) / 60);
      ctx.fillStyle = left <= 5 ? getTitleColor() : getTextColor();
      ctx.font = '18px sans-serif';
      ctx.fillText(`(${left} min left)`, locX, footer);
      ctx.restore();
    } else if (i === 0 && t < start && start - t <= 3 * 3600) {
      ctx.save();
      ctx.font = '13px sans-serif';
      ctx.fillStyle = getTextColor();
      ctx.fillText(`(School starts in ${Math.ceil((start - t) / 60)} min)`, locX, footer);
      ctx.restore();
    } else if (i > 0 && t >= plan.periods[i - 1][2] && t < start) {
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = getTitleColor();
      ctx.moveTo(locX, rowY(i) - 14.5);
      ctx.lineTo(locX + 150, rowY(i) - 14.5);
      ctx.stroke();
      ctx.font = '9px sans-serif';
      ctx.fillStyle = getTextColor();
      ctx.fillText(`(Next period in less than ${Math.ceil((start - t) / 60)} min)`, locX, footer);
      ctx.restore();
    }
  });
}

function loop() {
  draw();
  requestAnimationFrame(loop);
}

document.getElementById('officialSchedules').href = BELL_SCHEDULES_SOURCE;
mountSchedulePicker(document.getElementById('schedulePicker'), (p) => { plan = p; });
getPickedSchedule().then((p) => {
  picked = p;
  plan = todaysPlan(new Date(), picked);
  loop();
});
