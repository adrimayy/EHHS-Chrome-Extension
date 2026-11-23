// ============================================================================
//  Bell schedules: drive the period timer badge and the Schedule page.
//  Copied from the PDFs under "Bell Schedules" on easthamptonschools.org/highschool
//  (checked November 2026). If the school changes a schedule, edit its times here
//  (24-hour, like '13:45'). After editing, run:  npm run check
//
//  'regular' is used every school day unless:
//    - a student picks another schedule for today (on the Schedule page or the
//      editing page), e.g. when a delay is announced on a snowy morning, or
//    - data/calendar.js lists the day under `special` (for days known ahead).
//
//  To add a schedule, add a block with a new id (letters and numbers). Each period is
//  [label, starts, ends]; use 'HR' for homeroom.
// ============================================================================

const BELL_SCHEDULES = {
  regular: {
    name: 'Regular',
    periods: [
      ['1', '7:40', '8:21'],
      ['2', '8:30', '9:11'],
      ['3', '9:15', '9:56'],
      ['4', '10:00', '10:41'],
      ['5', '10:45', '11:26'],
      ['6', '11:30', '12:11'],
      ['7', '12:15', '12:56'],
      ['8', '13:00', '13:41'],
      ['9', '13:45', '14:26']
    ]
  },
  homeroom: {
    name: '15-minute homeroom',
    periods: [
      ['HR', '7:40', '7:55'],
      ['1', '7:59', '8:38'],
      ['2', '8:46', '9:25'],
      ['3', '9:29', '10:08'],
      ['4', '10:12', '10:51'],
      ['5', '10:55', '11:34'],
      ['6', '11:38', '12:17'],
      ['7', '12:21', '13:00'],
      ['8', '13:04', '13:43'],
      ['9', '13:47', '14:26']
    ]
  },
  delay1: {
    name: '1-hour delay',
    periods: [
      ['1', '8:40', '9:14'],
      ['2', '9:19', '9:54'],
      ['3', '9:58', '10:33'],
      ['4', '10:37', '11:12'],
      ['5', '11:16', '11:51'],
      ['6', '11:55', '12:31'],
      ['7', '12:35', '13:10'],
      ['8', '13:14', '13:49'],
      ['9', '13:53', '14:26']
    ]
  },
  delay2: {
    name: '2-hour delay',
    periods: [
      ['1', '9:40', '10:08'],
      ['2', '10:13', '10:41'],
      ['3', '10:45', '11:13'],
      ['4', '11:17', '11:45'],
      ['5', '11:49', '12:17'],
      ['6', '12:21', '12:49'],
      ['7', '12:53', '13:21'],
      ['8', '13:25', '13:53'],
      ['9', '13:59', '14:26']
    ]
  }
};

// Where students can see the official schedules.
const BELL_SCHEDULES_SOURCE = 'https://www.easthamptonschools.org/highschool';
