# Updating the EHHS extension

Everything Chrome loads is in the **`extension/`** folder. That folder *is* the extension: load it in Chrome to test, and zip it for the Web Store (`npm run release` does that for you).

Everything you'll normally change is in **`extension/data/`**. Each file is a plain list with instructions at the top:

| To change… | Edit |
|---|---|
| Links: add, remove, rename, re-categorize | `extension/data/links.js` |
| Which days the period timer runs | `extension/data/calendar.js` |
| Bell schedules (regular, homeroom, delays) | `extension/data/bells.js` |
| **Today's** delay, snow day or early dismissal | `announcements.json`. Edit it on GitHub; no release needed |

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
   This saves `extension/images/khan.png`.

   If Google has no logo, or only a small one, save a square PNG (128 to 192 px) into `extension/images/` yourself. For a one-color symbol instead of a logo, download one from [Google Fonts icons](https://fonts.google.com/icons) and set `mono: true`.

2. In `extension/data/links.js`, add an entry to a category:
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

`extension/data/calendar.js` already has **estimated** years through 2031–32 (marked `estimated: true`), so the timer never stops working. They're built only from rules that held in both official calendars: the first and last day, and the holidays that repeat. Spring break isn't included, because it didn't follow a pattern. When the Board adopts the real calendar, **replace** that year's estimated block with the real dates and delete `estimated: true`. `npm run check` reminds you five months before an estimated year starts. To add more estimated years: `pip install convertdate python-dateutil`, then `python3 tools/estimate-years.py 2032 2034`.

#### Entering the real calendar

When the Board adopts the calendar, open `extension/data/calendar.js`, copy the last year's block and fill it in from the PDF:

- `firstDay` / `lastDay`: the first and last days **students** attend.
- `closed`: every weekday off, as `['2027-11-25', '2027-11-26', 'Thanksgiving Recess']`. Weekends are skipped automatically.

Tip: count the school days in each month and compare them to the PDF's monthly totals.

`npm run check` starts warning 90 days before the calendar runs out. Once it runs out, the period timer turns off until a new year is added.

### Change bell times, or add a schedule

`extension/data/bells.js` holds every bell schedule: regular, 15-minute homeroom, 1-hour delay and 2-hour delay. They're copied from the PDFs under **Bell Schedules** on the EHHS page.

- **To change a time,** edit it. Times are 24-hour, like `'13:45'`.
- **To add a schedule,** copy a block and give it a new id and name. It shows up in the Today's schedule picker automatically.

The badge timer, the popup's timer and the Schedule page all read from this file.

### Post a delay, snow day or early dismissal (no release needed)

Students' extensions read **`announcements.json`** straight from GitHub, about every 15 minutes and whenever the popup opens. Post a change once and everyone's timer switches to the right bells. The popup also shows a red line like **"Today: 2-hour delay · Snow"**, or **"Tomorrow: …"** if it's posted the day before.

To post one:

1. Open the file on GitHub, logged in to an account that can edit the repository:
   https://github.com/adrimayy/EHHS-Chrome-Extension/edit/main/announcements.json
   The GitHub phone app works too.
2. Add an entry to `days`:
   ```json
   "days": [
     { "date": "2027-01-26", "schedule": "delay2", "message": "Snow" },
     { "date": "2027-06-24", "schedule": "early", "dismissal": "11:00" }
   ]
   ```
   - `schedule` is one of:
     - `delay1` (1-hour delay)
     - `delay2` (2-hour delay)
     - `homeroom` (15-minute homeroom)
     - `early` (early dismissal; also needs a `dismissal` time)
     - `closed` (no school)
     - `regular` (to undo something)
   - `message` is optional.
3. Commit. Everyone has it within about 15 to 20 minutes.

**Planning ahead:** post future days any time. Past days are ignored, so the list never needs cleaning.

**Mistakes:** the Actions tab shows a green check if the file is valid, or a red ✗ explaining what's wrong. If the file breaks, students simply keep the last good version until it's fixed.

To give a teacher access: on GitHub, open the repository's **Settings → Collaborators → Add people**.

**Students can still pick a schedule themselves** under **Today's schedule** (Schedule page or editing page), for example if they hear about a delay before it's posted. Whichever was set most recently wins, and a student's pick lasts only that day.

**Days known when the calendar is written** (for example a homeroom day) can also go under `special` in `extension/data/calendar.js`. Those only reach students with the next release, so `announcements.json` is usually easier.

EHHS doesn't publish a half-day bell schedule, so `early` follows the regular bells and stops at the dismissal time. If the school posts one, add it to `extension/data/bells.js` as its own schedule.

**If GitHub ever limits requests:** the whole school shares one internet connection, and GitHub limits how often one connection can download raw files. Each copy checks at most every 5 minutes, which should be well within the limit. If it ever becomes a problem, turn on GitHub Pages for the repository (**Settings → Pages → Deploy from branch: main**). Then set `ANNOUNCEMENTS_URL` in `extension/data/calendar.js` to `https://adrimayy.github.io/EHHS-Chrome-Extension/announcements.json` and release.

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

This runs the checks, bumps the version in `extension/manifest.json`, and zips the `extension/` folder into `dist/ehhs-extension-<version>.zip`, ready to upload as is.

Then:

1. Commit.
2. Upload the zip in the [Chrome Web Store dashboard](https://chrome.google.com/webstore/devconsole).

To test before releasing, open `chrome://extensions`, turn on Developer mode, choose **Load unpacked** and pick the **`extension`** folder. After editing, click the reload arrow on the extension's card.

## Where things live

```
extension/          The extension itself: load it in Chrome, zip it for the Web Store
  manifest.json
  data/             What you edit: links, calendar, bell times
  images/           Logos and icons (credits in images/ICONS.md)
  html/             Popup (mainPage), editing page (options), Schedule page (clockPage)
  js/               Code; reads data/ and keeps saved links in sync
  css/              Styles
announcements.json  Today's delays and snow days (read live from GitHub, not shipped)
tools/              npm run check / icon / release
DEVELOPING.md       This guide
```

**Old images:** `npm run check` lists images no current link uses. Keep them for about a school year, because deleted links can still be on students' home screens. After that they're safe to delete.
