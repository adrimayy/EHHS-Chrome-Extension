// East Hampton UFSD school calendars, copied from the Board-adopted PDFs.
// Only days students are in school count. Add next year's calendar here when
// the district publishes it; outside these years the timer stays off.
//   2025–26: Board adopted February 11, 2025
//   2026–27: Board adopted January 20, 2026

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

const SCHOOL_YEARS = [
  {
    name: '2025–26',
    firstDay: '2025-09-02',
    lastDay: '2026-06-26',
    closed: closures([
      ['2025-09-23', '2025-09-23', 'Rosh Hashanah'],
      ['2025-10-02', '2025-10-02', 'Yom Kippur'],
      ['2025-10-13', '2025-10-13', 'Columbus Day'],
      ['2025-11-04', '2025-11-04', 'Superintendent’s Conference Day / Election Day'],
      ['2025-11-11', '2025-11-11', 'Veterans’ Day'],
      ['2025-11-26', '2025-11-28', 'Thanksgiving Recess'],
      ['2025-12-22', '2026-01-02', 'Winter Recess'],
      ['2026-01-19', '2026-01-19', 'Martin Luther King, Jr. Day'],
      ['2026-02-16', '2026-02-20', 'Mid-Winter Recess'],
      ['2026-04-02', '2026-04-10', 'Spring Recess'],
      ['2026-05-25', '2026-05-25', 'Memorial Day'],
      ['2026-06-19', '2026-06-19', 'Juneteenth']
    ])
  },
  {
    name: '2026–27',
    firstDay: '2026-09-08',
    lastDay: '2027-06-25',
    // If no snow days are used, the district will also close May 28, 2027.
    // That isn't known ahead of time, so it's treated as a school day.
    closed: closures([
      ['2026-09-21', '2026-09-21', 'Yom Kippur'],
      ['2026-10-12', '2026-10-12', 'Columbus Day'],
      ['2026-11-03', '2026-11-03', 'Superintendent’s Conference Day / Election Day'],
      ['2026-11-11', '2026-11-11', 'Veterans’ Day'],
      ['2026-11-25', '2026-11-27', 'Thanksgiving Recess'],
      ['2026-12-24', '2027-01-01', 'Winter Recess'],
      ['2027-01-18', '2027-01-18', 'Martin Luther King, Jr. Day'],
      ['2027-02-15', '2027-02-19', 'Mid-Winter Recess'],
      ['2027-03-26', '2027-03-26', 'Good Friday'],
      ['2027-04-19', '2027-04-23', 'Spring Recess'],
      ['2027-05-31', '2027-05-31', 'Memorial Day'],
      ['2027-06-18', '2027-06-18', 'Juneteenth']
    ])
  }
];

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
  if (year.closed[day]) return { schoolDay: false, reason: year.closed[day], year };
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
