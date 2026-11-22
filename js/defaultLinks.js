// Every built-in link, grouped the way the App Library shows them.
// Link format: [name, url, image, iconStyle ('color' | 'black'), flag ('custom' or '')]
// Links checked November 2026; school links come from easthamptonschools.org.
// Icons added in v0.6.0 are Google Material Symbols (filled, Apache 2.0), exported
// as 512px PNGs to match the original icons.

const LINK_LIBRARY = [
  { category: 'EHHS', links: [
    ['Schedule', '/html/clockPage.html', '/images/clock.png', 'black'],
    ['SchoolTool', 'https://esb.schooltool.com/eh', '/images/schoolTool.png', 'color'],
    ['EHHS', 'https://www.easthamptonschools.org/highschool', '/images/bonac.png', 'color'],
    ['Guidance', 'https://www.easthamptonschools.org/guidance', '/images/guidance.png', 'black'],
    ['Tech Help', 'https://easthamptonufsd.schoolinsites.com/remotehelpdesk', '/images/support.png', 'black'],
    ['Program of Studies', 'https://drive.google.com/file/d/1MFGGMvMxjg64xsAQdArYz1TNGZBdjYZA/view', '/images/programOfStudies.png', 'black'],
    ['Edgenuity', 'https://auth.edgenuity.com/Login/Login', '/images/edgenuity.png', 'black'],
    ['BOCES Programs', 'https://www.academyli.org/', '/images/boces.png', 'black'],
    ['BBS: The Current', 'https://www.youtube.com/@bbsthecurrent', '/images/bbs.png', 'color'],
    ['LTV EH', 'https://www.youtube.com/@LTVEastHampton', '/images/ltv.png', 'color']
  ] },
  { category: 'Google', links: [
    ['Drive', 'https://drive.google.com/drive/u/0/', '/images/drive.png', 'color'],
    ['Gmail', 'https://mail.google.com/', '/images/gmail.png', 'color'],
    ['Classroom', 'https://classroom.google.com/', '/images/classroom.png', 'color'],
    ['Docs', 'https://docs.google.com/document/u/0/', '/images/docs.png', 'color'],
    ['Slides', 'https://docs.google.com/presentation/u/0/', '/images/slides.png', 'color'],
    ['Sheets', 'https://docs.google.com/spreadsheets/u/0/', '/images/sheets.png', 'color'],
    ['Calendar', 'https://calendar.google.com/calendar/u/0/r', '/images/calendar.png', 'color'],
    ['Keep', 'https://keep.google.com/u/0/', '/images/keep.png', 'color'],
    ['Translate', 'https://translate.google.com/', '/images/googleTranslate.png', 'color']
  ] },
  { category: 'Library & Research', links: [
    ['Sora eBooks', 'https://soraapp.com/welcome/login/370662/ils/ehufsdny/form/East%20Hampton%20UFSD', '/images/sora.png', 'black'],
    ['Library Catalog', 'https://search.follettsoftware.com/metasearch/ui/29877', '/images/libraryCatalog.png', 'black'],
    ['Databases', 'https://auth.orc.scoolaid.net/bin/listdb?sysCode=xaaa&schoolId=773', '/images/database.png', 'black'],
    ['NewsBank', 'https://infoweb.newsbank.com/home', '/images/newspaper.png', 'black'],
    ['JSTOR', 'https://www.jstor.org/', '/images/jstor.png', 'color'],
    ['NoodleTools', 'https://my.noodletools.com/web2.0/projects.html', '/images/noodleTools.png', 'color'],
    ['ZoteroBib', 'https://zbib.org/', '/images/citation.png', 'black'],
    ['Purdue OWL', 'https://owl.purdue.edu/', '/images/writingLab.png', 'black'],
    ['Gutenberg', 'https://www.gutenberg.org/', '/images/gutenberg.png', 'black'],
    ['EH Library', 'https://easthamptonlibrary.org/teens/', '/images/book.png', 'black'],
    ['NY Times', 'https://www.nytimes.com/', '/images/nyTimes.png', 'black']
  ] },
  { category: 'Math & Science', links: [
    ['Delta Math', 'https://www.deltamath.com/app/student', '/images/deltaMath.png', 'black'],
    ['Desmos', 'https://www.desmos.com/calculator', '/images/desmos.png', 'color'],
    ['GeoGebra', 'https://www.geogebra.org/calculator', '/images/geogebra.png', 'black'],
    ['Symbolab', 'https://www.symbolab.com/', '/images/symbolab.png', 'color'],
    ['WolframAlpha', 'https://www.wolframalpha.com/', '/images/wolframAlpha.png', 'color'],
    ['PhET Sims', 'https://phet.colorado.edu/', '/images/phet.png', 'black'],
    ['Khan Academy', 'https://www.khanacademy.org/', '/images/khanAcademy.png', 'color']
  ] },
  { category: 'AP, Regents & SAT', links: [
    ['AP Classroom', 'https://myap.collegeboard.org/', '/images/collegeBoard.png', 'black'],
    ['AP Registration', 'https://user.totalregistration.net/AP/331700', '/images/apRegistration.png', 'black'],
    ['AP Exam Dates', 'https://apcentral.collegeboard.org/exam-administration-ordering-scores/exam-dates', '/images/schedule.png', 'black'],
    ['AP Study Guides', 'https://library.fiveable.me/', '/images/fiveable.png', 'color'],
    ['Knowt', 'https://knowt.io/', '/images/knowt.png', 'color'],
    ['AP Score Calculator', 'https://www.albert.io/blog/ap-score-calculators/', '/images/albert.png', 'color'],
    ['Past Regents', 'https://www.nysedregents.org/', '/images/regents.png', 'black'],
    ['SAT Practice', 'https://satsuite.collegeboard.org/sat/practice-preparation', '/images/satPractice.png', 'black'],
    ['Castle Learning', 'https://cl.castlelearning.com/Review/CLO/Account/LogOn', '/images/castleLearning.png', 'color']
  ] },
  { category: 'College & Career', links: [
    ['Naviance', 'https://student.naviance.com/ehhs', '/images/naviance.png', 'black'],
    ['Common App', 'https://apply.commonapp.org/dashboard', '/images/commonApp.png', 'color'],
    ['FAFSA', 'https://studentaid.gov/h/apply-for-aid/fafsa', '/images/fafsa.png', 'black'],
    ['NYS Aid (TAP)', 'https://www.hesc.ny.gov/pay-for-college/apply-for-financial-aid/nys-tap.html', '/images/nysAid.png', 'black'],
    ['SUNY', 'https://www.suny.edu/', '/images/university.png', 'black'],
    ['CUNY', 'https://www.cuny.edu/', '/images/university.png', 'black'],
    ['EdX', 'https://home.edx.org/', '/images/edX.png', 'black'],
    ['Udemy', 'https://www.udemy.com/', '/images/udemy.png', 'black']
  ] },
  { category: 'Languages', links: [
    ['Rosetta Stone', 'https://easthamptonufsd.rosettastoneclassroom.com/en-US', '/images/rosettaStone.png', 'color'],
    ['Duolingo', 'https://www.duolingo.com/', '/images/duolingo.png', 'color'],
    ['Word Reference', 'https://www.wordreference.com/', '/images/wordReference.png', 'color'],
    ['Verbix', 'https://www.verbix.com/', '/images/verbix.png', 'color']
  ] },
  { category: 'Classwork', links: [
    ['Kami', 'https://web.kamihq.com/web/viewer.html', '/images/kami.png', 'color'],
    ['EdPuzzle', 'https://edpuzzle.com/', '/images/edpuzzle.png', 'color'],
    ['Remind', 'https://www.remind.com/', '/images/remind.png', 'color'],
    ['Quizlet', 'https://quizlet.com/latest', '/images/quizlet.png', 'color'],
    ['Kahoot', 'https://kahoot.it/', '/images/kahoot.png', 'color'],
    ['Blooket', 'https://play.blooket.com/play', '/images/blooket.png', 'color'],
    ['Gimkit', 'https://www.gimkit.com/join', '/images/gimkit.png', 'color'],
    ['Wayground', 'https://wayground.com/join', '/images/quizizz.png', 'color'],
    ['Grammarly', 'https://www.grammarly.com/', '/images/grammarly.png', 'color'],
    ['Typing Club', 'https://www.typingclub.com/sportal/', '/images/typingClub.png', 'color']
  ] },
  { category: 'Coding & Making', links: [
    ['GitHub', 'https://github.com/', '/images/github.png', 'black'],
    ['Code HS', 'https://codehs.com/', '/images/codeHS.png', 'color'],
    ['Code.org', 'https://studio.code.org/home', '/images/code.png', 'black'],
    ['p5.js', 'https://editor.p5js.org/', '/images/p5.png', 'color'],
    ['W3schools', 'https://www.w3schools.com/', '/images/w3schools.png', 'color'],
    ['Scratch', 'https://scratch.mit.edu/', '/images/scratch.png', 'black'],
    ['Tinkercad', 'https://www.tinkercad.com/dashboard', '/images/tinkercad.png', 'color']
  ] },
  { category: 'Study Help & Videos', links: [
    ['SparkNotes', 'https://www.sparknotes.com/', '/images/sparknotes.png', 'color'],
    ['Shmoop', 'https://www.shmoop.com/', '/images/shmoop.png', 'color'],
    ['Brainly', 'https://brainly.com/', '/images/brainly.png', 'black'],
    ['Course Hero', 'https://www.coursehero.com/', '/images/courseHero.png', 'color'],
    ['CrashCourse', 'https://www.youtube.com/@crashcourse', '/images/crashCourse.png', 'color'],
    ["Heimler's History", 'https://www.youtube.com/@heimlershistory', '/images/heilmer.png', 'color'],
    ['Organic Chemistry Tutor', 'https://www.youtube.com/@theorganicchemistrytutor', '/images/organicChemistryTutor.png', 'color'],
    ['Bozeman Science', 'https://www.youtube.com/@Bozemanscience1', '/images/bozeman.png', 'color'],
    ['Flipping Physics', 'https://www.youtube.com/@flippingphysics', '/images/flippingPhysics.png', 'black'],
    ['Coding Train', 'https://www.youtube.com/@thecodingtrain', '/images/codingTrain.png', 'color'],
    ['Brian McLogan', 'https://www.youtube.com/@brianmclogan', '/images/brianMclogan.png', 'color'],
    ['YouTube', 'https://www.youtube.com/', '/images/youtube.png', 'color']
  ] },
  { category: 'Creative & Fun', links: [
    ['Canva', 'https://www.canva.com/', '/images/canva.png', 'black'],
    ['Photopea', 'https://www.photopea.com/', '/images/photopea.png', 'black'],
    ['Pixlr', 'https://pixlr.com/', '/images/pixlr.png', 'color'],
    ['Img BG Remover', 'https://www.remove.bg/', '/images/removeBG.png', 'black'],
    ['Sight Reading', 'https://www.sightreadingfactory.com/sight-reading', '/images/sightReading.png', 'black'],
    ['Spotify', 'https://open.spotify.com/', '/images/spotify.png', 'color'],
    ['Wordle', 'https://www.nytimes.com/games/wordle/index.html', '/images/wordle.png', 'color'],
    ['Seterra', 'https://www.seterra.com/', '/images/seterra.png', 'color'],
    ['Weather', 'https://weather.com/weather/tenday/l/11937:4:US', '/images/weather.png', 'black']
  ] }
];

const CUSTOM_CATEGORY = 'My links';
const LINK_CATEGORIES = LINK_LIBRARY.map((g) => g.category);
const ALL_DEFAULT_LINKS = LINK_LIBRARY.flatMap((g) => g.links);
const DEFAULT_BY_URL = new Map(ALL_DEFAULT_LINKS.map((l) => [l[1], l]));
const CATEGORY_BY_URL = new Map(LINK_LIBRARY.flatMap((g) => g.links.map((l) => [l[1], g.category])));

// What a fresh install puts on the home screen, in order.
const DEFAULT_HOME_URLS = [
  'https://drive.google.com/drive/u/0/',
  'https://mail.google.com/',
  'https://classroom.google.com/',
  '/html/clockPage.html',
  'https://esb.schooltool.com/eh',
  'https://student.naviance.com/ehhs',
  'https://www.easthamptonschools.org/highschool',
  'https://www.easthamptonschools.org/guidance',
  'https://easthamptonufsd.schoolinsites.com/remotehelpdesk',
  'https://myap.collegeboard.org/',
  'https://www.deltamath.com/app/student',
  'https://www.desmos.com/calculator'
];

const DEFAULT_ADDED_LINKS = DEFAULT_HOME_URLS.map((url) => DEFAULT_BY_URL.get(url));
const DEFAULT_REMOVED_LINKS = ALL_DEFAULT_LINKS.filter((l) => !DEFAULT_HOME_URLS.includes(l[1]));

function categoryOf(link) {
  if (link[4] === 'custom') return CUSTOM_CATEGORY;
  return CATEGORY_BY_URL.get(link[1]) || CUSTOM_CATEGORY;
}

// ---------- Updating lists saved by older versions ----------
// Old URL → new URL (the link takes the new name/icon), or null to drop a dead link.
const LINKS_VERSION = 3;
const LINK_MIGRATIONS = {
  'http://mail.ehschools.org/': 'https://mail.google.com/',
  'https://easthamptonst.esboces.org/schooltoolweb/': 'https://esb.schooltool.com/eh',
  'https://student.naviance.com/main': 'https://student.naviance.com/ehhs',
  'https://ehschools.mojohelpdesk.com/': 'https://easthamptonufsd.schoolinsites.com/remotehelpdesk',
  'https://apstudents.collegeboard.org/': 'https://myap.collegeboard.org/',
  'https://sites.google.com/ehschools.org/ehhslibrary/databases?pli=1': 'https://auth.orc.scoolaid.net/bin/listdb?sysCode=xaaa&schoolId=773',
  'http://easthamptonlibrary.org/teens/': 'https://easthamptonlibrary.org/teens/',
  'https://weather.com/en-BZ/weather/tenday/l/11937:4:US': 'https://weather.com/weather/tenday/l/11937:4:US',
  'https://www.rosettastone.com/': 'https://easthamptonufsd.rosettastoneclassroom.com/en-US',
  'https://ehufsd.owschools.com/owsoo/login/auth': 'https://auth.edgenuity.com/Login/Login',
  'https://codehs.com/sections/3059537': 'https://codehs.com/',
  'https://quizizz.com/join': 'https://wayground.com/join',
  'https://docs.google.com/presentation/d/1T-idGOxDysnA_qrA0ilTapPdZNXiYt-09Ew1kL1AUbk/preview?slide=id.gb047d9a6b6_0_28': null, // old Virtual Bulletin
  'https://bonacbeachcomber.com/': null, // site no longer loads
  'http://astromech.net/': null // R2-D2 builders club, not school-related
};

function migrateList(list, seen) {
  const out = [];
  for (const link of list) {
    let next = link;
    if (link[4] !== 'custom' && Object.prototype.hasOwnProperty.call(LINK_MIGRATIONS, link[1])) {
      const to = LINK_MIGRATIONS[link[1]];
      if (to === null) continue;
      next = DEFAULT_BY_URL.get(to).slice();
    } else if (link[4] !== 'custom' && DEFAULT_BY_URL.has(link[1]) && String(link[2]).startsWith('/images/generic/')) {
      next = DEFAULT_BY_URL.get(link[1]).slice(); // icon set replaced in v3
    }
    const key = next[4] === 'custom' ? JSON.stringify(next) : next[1];
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(next);
  }
  return out;
}

// Fixes dead links in saved lists and adds new built-in links to the App Library.
// Safe to call from any page or the service worker; it only runs once per version.
async function migrateStoredLinks() {
  const data = await chrome.storage.local.get(['addedLinks', 'removedLinks', 'linksVersion']);
  if (data.linksVersion >= LINKS_VERSION) return false;
  if (!data.addedLinks && !data.removedLinks) {
    await chrome.storage.local.set({ linksVersion: LINKS_VERSION });
    return false;
  }
  const seen = new Set();
  const added = migrateList(data.addedLinks ? JSON.parse(data.addedLinks) : DEFAULT_ADDED_LINKS, seen);
  const removed = migrateList(data.removedLinks ? JSON.parse(data.removedLinks) : DEFAULT_REMOVED_LINKS, seen);
  for (const link of ALL_DEFAULT_LINKS) {
    if (!seen.has(link[1])) { seen.add(link[1]); removed.push(link.slice()); }
  }
  await chrome.storage.local.set({
    addedLinks: JSON.stringify(added),
    removedLinks: JSON.stringify(removed),
    linksVersion: LINKS_VERSION
  });
  return true;
}
