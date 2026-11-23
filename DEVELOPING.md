# Updating the EHHS extension

Everything you'll normally change is in the **`data/`** folder. Each file is a plain list with instructions at the top:

| To change… | Edit |
|---|---|
| Links: add, remove, rename, re-categorize | `data/links.js` |
| Which days the period timer runs | `data/calendar.js` |
| Bell schedules (regular, homeroom, delays) | `data/bells.js` |

You never need to touch `js/`, `html/` or `css/` for these, and there's no version number to bump inside the code. When students get the update, their copies sync themselves: new links appear in their App Library, deleted ones leave it, and renamed links and new logos update on their home screens (unless a student renamed a link themselves).

**One-time setup:** install [Node.js](https://nodejs.org) (version 18 or newer). The tools need nothing else, so there's no `npm install`.

After any edit, run this in the project folder:

```
npm run check
```

It catches typos, missing logos, unknown subjects, duplicate links, calendar mistakes and bell-time mistakes, and tells you exactly what to fix.

---

## Recipes

### Add a link

1. Get its logo:
   ```
   npm run icon -- khan https://www.khanacademy.org
   ```
   This saves `images/khan.png`.

   If Google has no logo, or only a small one, save a square PNG (128 to 192 px) into `images/` yourself. For a one-color symbol instead of a logo, download one from [Google Fonts icons](https://fonts.google.com/icons) and set `mono: true`.

2. In `data/links.js`, add an entry to a category:
   ```js
   { name: 'Khan Academy', url: 'https://www.khanacademy.org/', icon: 'khan.png',
     about: 'Free lessons and practice for every math and science course.',
     subjects: ['Math', 'Science'] },
   ```

3. Run `npm run check`.

To add a whole new category, add a new `'Name': [ ... ],` block. To add a new filter chip, add it to `SUBJECTS`.

### Remove a link

Delete its entry, then run `npm run check`. It leaves everyone's App Library. Students who put it on their home screen keep it there, because they chose it.

**If the site is dead or harmful**, also add it to `MOVED_LINKS` with `null` so it leaves home screens too:

```js
'https://deadsite.com/': null,
```

### Replace a link (a site moved, or something better came along)

1. Add the new link.
2. Delete the old one.
3. Map old to new in `MOVED_LINKS`:
   ```js
   'https://old-address.com/': 'https://new-address.com/',
   ```

Home screens switch over automatically.

### Change a link's name, logo, description or subjects

Just edit it. To change a logo, save the new image over the old file, or use a new file name and update `icon`.

### Change the starting home screen

The `home: 1`, `home: 2`, … numbers decide which links a **new** install starts with, and in what order. They never move anything on existing students' screens.

### Add next school year's calendar (every summer)

When the Board adopts the calendar, open `data/calendar.js`, copy the last year's block and fill it in from the PDF:

- `firstDay` / `lastDay`: the first and last days **students** attend.
- `closed`: every weekday off, as `['2027-11-25', '2027-11-26', 'Thanksgiving Recess']`. Weekends are skipped automatically.

Tip: count the school days in each month and compare them to the PDF's monthly totals.

`npm run check` starts warning 90 days before the calendar runs out. Once it runs out, the period timer turns off until a new year is added.

### Change bell times, or add a schedule

`data/bells.js` holds every bell schedule: regular, 15-minute homeroom, 1-hour delay and 2-hour delay. They're copied from the PDFs under **Bell Schedules** on the EHHS page.

- **To change a time,** edit it. Times are 24-hour, like `'13:45'`.
- **To add a schedule,** copy a block and give it a new id and name. It shows up in the Today's schedule picker automatically.

The badge timer, the popup's timer and the Schedule page all read from this file.

### Snow days, delays and half days

Students pick these themselves under **Today's schedule**, on the Schedule page or the editing page: a delay, homeroom, early dismissal (with a time) or no school. A pick only lasts for that day.

For days known ahead, list them under `special` for that year in `data/calendar.js`, and every student gets them automatically:

```js
special: [
  ['2027-01-26', 'homeroom'],
  ['2027-06-24', 'early', '11:00'],
],
```

EHHS doesn't publish a half-day bell schedule, so early dismissal follows the regular bells and stops at the dismissal time. If the school ever posts one, add it to `data/bells.js` as its own schedule.

---

## Checking the links still work

```
npm run check:links
```

This visits every website and reports:

- **dead** links (red),
- links that now **redirect** to a different site (yellow: update the url?),
- sites that **block automated checks** (grey: open those yourself).

GitHub also runs it every Monday, and runs `npm run check` on every push (see the Actions tab). A red ✗ there means something needs fixing, and the run's log says what.

## Releasing an update

```
npm run release              # 0.6.0 → 0.6.1
npm run release -- minor     # 0.6.1 → 0.7.0
```

This runs the checks, bumps the version in `manifest.json`, and builds `dist/ehhs-extension-<version>.zip` with only the files the extension needs.

Then:

1. Commit.
2. Upload the zip in the [Chrome Web Store dashboard](https://chrome.google.com/webstore/devconsole).

To test before releasing, open `chrome://extensions`, turn on Developer mode, choose **Load unpacked** and pick this folder. After editing, click the reload arrow on the extension's card.

## Where things live

```
data/       What you edit: links, calendar, bell times
images/     Logos and icons (credits in images/ICONS.md)
html/       Popup (mainPage), editing page (options), Schedule page (clockPage)
js/         Extension code; reads data/ and keeps saved links in sync
css/        Styles
tools/      npm run check / icon / release (not shipped to students)
```

**Old images:** `npm run check` lists images no current link uses. Keep them for about a school year, because deleted links can still be on students' home screens. After that they're safe to delete.
