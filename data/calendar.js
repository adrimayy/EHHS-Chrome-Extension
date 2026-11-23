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
//  Old years can stay; they do no harm. Years marked `estimated: true` are
//  placeholders: replace them with the real calendar (see below).
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
  },

  // ---------------------------------------------------------------------------
  //  ESTIMATED years (estimated: true). Not from the Board: built from rules that
  //  held in BOTH official calendars above (2025–26 and 2026–27), so the timer
  //  keeps working until the real calendar is adopted. Replace each one with the
  //  Board-adopted calendar when it comes out, and delete `estimated: true`.
  //    First day      Tuesday after Labor Day
  //    Last day       4th Friday of June (it was also the last Friday both years;
  //                   when those differ, the earlier date, so the timer can't
  //                   run into summer vacation)
  //    Closed         Rosh Hashanah (1st day) and Yom Kippur when on a weekday,
  //                   Columbus Day, Election Day, Veterans' Day when on a weekday,
  //                   Thanksgiving Wed–Fri, Dec 24–Jan 1, MLK Day, Presidents'
  //                   Day week, Good Friday, Memorial Day, Juneteenth (Friday
  //                   when it falls on a Saturday)
  //    NOT included   Spring recess (no consistent pattern), any winter-recess
  //                   days before Dec 24 (2025 started Dec 22, 2026 Dec 24), and
  //                   snow make-up closures. Those days count as school days.
  //  Regenerate or extend with:  python3 tools/estimate-years.py
  // ---------------------------------------------------------------------------
  {
    name: '2027–28',
    estimated: true,
    firstDay: '2027-09-07',
    lastDay: '2028-06-23',
    closed: [
      ['2027-10-11', '2027-10-11', 'Columbus Day / Yom Kippur'],
      ['2027-11-02', '2027-11-02', 'Superintendent’s Conference Day / Election Day'],
      ['2027-11-11', '2027-11-11', 'Veterans’ Day'],
      ['2027-11-24', '2027-11-26', 'Thanksgiving Recess'],
      ['2027-12-24', '2028-01-01', 'Winter Recess'],
      ['2028-01-17', '2028-01-17', 'Martin Luther King, Jr. Day'],
      ['2028-02-21', '2028-02-25', 'Mid-Winter Recess'],
      ['2028-04-14', '2028-04-14', 'Good Friday'],
      ['2028-05-29', '2028-05-29', 'Memorial Day'],
      ['2028-06-19', '2028-06-19', 'Juneteenth']
    ],
    special: []
  },
  {
    name: '2028–29',
    estimated: true,
    firstDay: '2028-09-05',
    lastDay: '2029-06-22',
    closed: [
      ['2028-09-21', '2028-09-21', 'Rosh Hashanah'],
      ['2028-10-09', '2028-10-09', 'Columbus Day'],
      ['2028-11-07', '2028-11-07', 'Superintendent’s Conference Day / Election Day'],
      ['2028-11-22', '2028-11-24', 'Thanksgiving Recess'],
      ['2028-12-24', '2029-01-01', 'Winter Recess'],
      ['2029-01-15', '2029-01-15', 'Martin Luther King, Jr. Day'],
      ['2029-02-19', '2029-02-23', 'Mid-Winter Recess'],
      ['2029-03-30', '2029-03-30', 'Good Friday'],
      ['2029-05-28', '2029-05-28', 'Memorial Day'],
      ['2029-06-19', '2029-06-19', 'Juneteenth']
    ],
    special: []
  },
  {
    name: '2029–30',
    estimated: true,
    firstDay: '2029-09-04',
    lastDay: '2030-06-28',
    closed: [
      ['2029-09-10', '2029-09-10', 'Rosh Hashanah'],
      ['2029-09-19', '2029-09-19', 'Yom Kippur'],
      ['2029-10-08', '2029-10-08', 'Columbus Day'],
      ['2029-11-06', '2029-11-06', 'Superintendent’s Conference Day / Election Day'],
      ['2029-11-21', '2029-11-23', 'Thanksgiving Recess'],
      ['2029-12-24', '2030-01-01', 'Winter Recess'],
      ['2030-01-21', '2030-01-21', 'Martin Luther King, Jr. Day'],
      ['2030-02-18', '2030-02-22', 'Mid-Winter Recess'],
      ['2030-04-19', '2030-04-19', 'Good Friday'],
      ['2030-05-27', '2030-05-27', 'Memorial Day'],
      ['2030-06-19', '2030-06-19', 'Juneteenth']
    ],
    special: []
  },
  {
    name: '2030–31',
    estimated: true,
    firstDay: '2030-09-03',
    lastDay: '2031-06-27',
    closed: [
      ['2030-10-07', '2030-10-07', 'Yom Kippur'],
      ['2030-10-14', '2030-10-14', 'Columbus Day'],
      ['2030-11-05', '2030-11-05', 'Superintendent’s Conference Day / Election Day'],
      ['2030-11-11', '2030-11-11', 'Veterans’ Day'],
      ['2030-11-27', '2030-11-29', 'Thanksgiving Recess'],
      ['2030-12-24', '2031-01-01', 'Winter Recess'],
      ['2031-01-20', '2031-01-20', 'Martin Luther King, Jr. Day'],
      ['2031-02-17', '2031-02-21', 'Mid-Winter Recess'],
      ['2031-04-11', '2031-04-11', 'Good Friday'],
      ['2031-05-26', '2031-05-26', 'Memorial Day'],
      ['2031-06-19', '2031-06-19', 'Juneteenth']
    ],
    special: []
  },
  {
    name: '2031–32',
    estimated: true,
    firstDay: '2031-09-02',
    lastDay: '2032-06-25',
    closed: [
      ['2031-09-18', '2031-09-18', 'Rosh Hashanah'],
      ['2031-10-13', '2031-10-13', 'Columbus Day'],
      ['2031-11-04', '2031-11-04', 'Superintendent’s Conference Day / Election Day'],
      ['2031-11-11', '2031-11-11', 'Veterans’ Day'],
      ['2031-11-26', '2031-11-28', 'Thanksgiving Recess'],
      ['2031-12-24', '2032-01-01', 'Winter Recess'],
      ['2032-01-19', '2032-01-19', 'Martin Luther King, Jr. Day'],
      ['2032-02-16', '2032-02-20', 'Mid-Winter Recess'],
      ['2032-03-26', '2032-03-26', 'Good Friday'],
      ['2032-05-31', '2032-05-31', 'Memorial Day'],
      ['2032-06-18', '2032-06-18', 'Juneteenth (observed)']
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
