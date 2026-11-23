// ============================================================================
//  School calendar: which days the period timer runs.
//  Recipe in DEVELOPING.md. After editing, run:  npm run check
//
//  Each summer, when the Board adopts next year's calendar, copy the last year
//  below and fill it in from the PDF:
//    firstDay / lastDay   First and last days STUDENTS attend (YYYY-MM-DD).
//    closed               Weekdays with no school: [first day, last day, name].
//                         Weekends are skipped automatically.
//    special              (optional) School days known ahead to run on another
//                         bell schedule from data/bells.js:
//                           ['2027-01-26', 'homeroom']
//                           ['2027-06-24', 'early', '11:00']   early dismissal
//                         Snow days and delays aren't known ahead, so students
//                         pick those on the day (Schedule page or editing page).
//  Old years can stay; they do no harm.
// ============================================================================

//   2025–26: Board adopted February 11, 2025
//   2026–27: Board adopted January 20, 2026
const SCHOOL_YEARS = [
  {
    name: '2025–26',
    firstDay: '2025-09-02',
    lastDay: '2026-06-26',
    closed: [
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
    ],
    special: []
  },
  {
    name: '2026–27',
    firstDay: '2026-09-08',
    lastDay: '2027-06-25',
    // If no snow days are used, the district will also close May 28, 2027.
    // That isn't known ahead of time, so it's treated as a school day.
    closed: [
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
    ],
    special: []
  }
];

// ============================================================================
//  School announcements (delays, snow days, early dismissals) don't go here.
//  They go in announcements.json at the top of the repository, which every
//  student's extension checks every 15 minutes, so there's no update to
//  release. See DEVELOPING.md, "Post a delay or snow day".
// ============================================================================
const ANNOUNCEMENTS_URL = 'https://raw.githubusercontent.com/adrimayy/EHHS-Chrome-Extension/main/announcements.json';
