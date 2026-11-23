# EHHS Chrome Extension

Quick links, a period timer and a customizable home screen for East Hampton High School students.

Developed as a part of the EHHS Coding and Computer Science curriculum by Adriano Rangel and Urban Reininger.

- **`extension/`** is the extension itself. Load it in Chrome (Developer mode → Load unpacked), or zip it for the Chrome Web Store with `npm run release`.
- **Updating links, the school calendar or bell times:** see [DEVELOPING.md](DEVELOPING.md). Everything you edit is in `extension/data/`.
- **Posting a delay or snow day:** edit [`announcements.json`](announcements.json) on GitHub. Every student's extension picks it up within about 15 minutes.
