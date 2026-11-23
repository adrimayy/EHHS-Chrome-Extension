// School-day logic. The calendar data is in data/calendar.js.

function dateRange(start, end) {
  const days = [];
  const d = new Date(start + 'T12:00:00');
  const last = new Date(end + 'T12:00:00');
  while (d <= last) {
    days.push(d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function closures(list) {
  const map = {};
  for (const [start, end, reason] of list) {
    for (const day of dateRange(start, end)) map[day] = reason;
  }
  return map;
}

// The years themselves live in data/calendar.js; this file only reads them.
for (const year of SCHOOL_YEARS) year.closedDays = closures(year.closed);


function isoDay(date) {
  return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
}

// { schoolDay, reason, year } for a given date.
function getSchoolDayInfo(date) {
  const day = isoDay(date);
  const year = SCHOOL_YEARS.find((y) => day >= y.firstDay && day <= y.lastDay) || null;
  if (!year) return { schoolDay: false, reason: 'No school calendar for this date', year: null };
  const weekday = date.getDay();
  if (weekday === 0 || weekday === 6) return { schoolDay: false, reason: 'Weekend', year };
  if (year.closedDays[day]) return { schoolDay: false, reason: year.closedDays[day], year };
  return { schoolDay: true, reason: '', year };
}

// The next weekday off (holiday/recess) from `from` on, within the loaded calendars.
function getNextDayOff(from) {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate(), 12);
  for (let i = 0; i < 400; i++) {
    const info = getSchoolDayInfo(d);
    if (!info.year && isoDay(d) > SCHOOL_YEARS[SCHOOL_YEARS.length - 1].lastDay) return null;
    if (info.year && !info.schoolDay && info.reason !== 'Weekend') return { date: new Date(d), reason: info.reason };
    d.setDate(d.getDate() + 1);
  }
  return null;
}
