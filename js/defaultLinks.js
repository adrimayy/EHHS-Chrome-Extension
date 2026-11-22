// Every built-in link, grouped the way the App Library shows them.
// Saved link format: [name, url, image, iconStyle ('color' | 'black'), flag ('custom' or '')]
// Curated November 2026. School links come from easthamptonschools.org.
// Icons: each site's own logo where one exists; Material Symbols glyphs otherwise.

// Subjects drive the filter chips on the editing page.
const SUBJECTS = [
  'School', 'Math', 'Science', 'English', 'History & Gov', 'Languages',
  'Computer Science', 'Arts & Music', 'Research', 'Test Prep', 'College & Career', 'Health & Support'
];

// L(name, url, icon, iconStyle, what students get out of it, subjects)
const L = (name, url, icon, style, desc, tags) => ({ link: [name, url, '/images/' + icon, style], desc, tags });

const LINK_LIBRARY = [
  { category: 'EHHS', links: [
    L('Schedule', '/html/clockPage.html', 'clock.png', 'black', 'Today’s bell schedule and how long is left in the period.', ['School']),
    L('SchoolTool', 'https://esb.schooltool.com/eh', 'schoolTool.png', 'color', 'Grades, attendance and report cards (EHHS student portal).', ['School']),
    L('EHHS', 'https://www.easthamptonschools.org/highschool', 'bonac.png', 'color', 'The high school’s site: calendar, bell schedules, forms and announcements.', ['School']),
    L('Guidance', 'https://www.easthamptonschools.org/guidance', 'guidance.png', 'black', 'EHHS counselors Marsilio, Pierro, Quinteros, Ritz, Sokolowski and Vasquez: schedule changes, college planning, or just someone to talk to. Stop by or call 631-329-4135.', ['School', 'College & Career', 'Health & Support']),
    L('Course Change', 'https://docs.google.com/forms/d/1XtjnYJg8a7otf25TCCJ7n6NIo2QldNrHHTNEY0Ewiu4/viewform', 'courseChange.png', 'black', 'Guidance’s form for a wrong, missing or dropped class on your schedule.', ['School']),
    L('Transcript Request', 'https://docs.google.com/forms/d/e/1FAIpQLSe0dmWVAGhasDYi_oyjWCoOrv3HS-ALXlPHQrc8UQDTXUio1g/viewform', 'transcript.png', 'black', 'Request your EHHS transcript for jobs, programs or scholarships (college transcripts go through Naviance). Sign in with your school account first.', ['School', 'College & Career']),
    L('Handbook', 'https://drive.google.com/file/d/1SY83s9NI7QGxY8iMDxuc1fQuEzYoHMdG/view', 'handbook.png', 'black', 'The 2026–27 EHHS Student Handbook: rules, attendance, phones, grading. A Spanish edition is on the EHHS page.', ['School']),
    L('Lunch Menu', 'https://www.fdmealplanner.com/', 'lunch.png', 'color', 'This week’s breakfast and lunch menus. Pay for meals with My School Bucks (link on the EHHS page).', ['School']),
    L('Final Forms', 'https://easthampton-ny.finalforms.com/', 'finalforms.png', 'color', 'Required sign-up for school sports: forms, physicals and consent. Athletic office: 631-329-4143.', ['School']),
    L('Service Hours', 'https://drive.google.com/file/d/1-UKXAUMxipXV8O26yaHUDQdDM5cyki24/view', 'communityService.png', 'black', 'The form for logging your volunteer hours.', ['School', 'College & Career']),
    L('Biliteracy Seal', 'https://www.easthamptonschools.org/nysbiliteracy', 'biliteracy.png', 'black', 'Earn a diploma seal for being fluent in English and another language, including the one you speak at home.', ['School', 'Languages', 'College & Career']),
    L('Permit Practice', 'https://dmv.ny.gov/new-york-state-drivers-manual-practice-tests', 'dmv.png', 'color', 'Official NYS practice tests for the learner permit. Driver’s Ed sign-up and permit-test requests are on the EHHS page.', ['School']),
    L('Tech Help', 'https://easthamptonufsd.schoolinsites.com/remotehelpdesk', 'support.png', 'black', 'Report a broken Chromebook or account problem to district IT.', ['School']),
    L('Program of Studies', 'https://drive.google.com/file/d/1MFGGMvMxjg64xsAQdArYz1TNGZBdjYZA/view', 'programOfStudies.png', 'black', 'Every EHHS course for 2026–27, with prerequisites. Use it when picking classes. The Spanish edition is on the Guidance page.', ['School', 'College & Career']),
    L('Edgenuity', 'https://auth.edgenuity.com/Login/Login', 'edgenuity.png', 'color', 'Online courses and credit recovery assigned through EHHS.', ['School']),
    L('BOCES Programs', 'https://www.academyli.org/', 'boces.png', 'color', 'Eastern Suffolk BOCES career and technical programs you can take alongside EHHS.', ['School', 'College & Career']),
    L('BBS: The Current', 'https://www.youtube.com/@bbsthecurrent', 'bbs.png', 'color', 'EHHS’s student-run news broadcast.', ['School']),
    L('LTV EH', 'https://www.youtube.com/@LTVEastHampton', 'ltv.png', 'color', 'East Hampton’s local TV: town meetings, sports and community events.', ['History & Gov'])
  ] },
  { category: 'Google', links: [
    L('Drive', 'https://drive.google.com/drive/u/0/', 'drive.png', 'color', 'Your school Google Drive files.', ['School']),
    L('Gmail', 'https://mail.google.com/', 'gmail.png', 'color', 'Your school email.', ['School']),
    L('Classroom', 'https://classroom.google.com/', 'classroom.png', 'color', 'Assignments, due dates and class posts.', ['School']),
    L('Docs', 'https://docs.google.com/document/u/0/', 'docs.png', 'color', 'Write and share documents.', ['School', 'English']),
    L('Slides', 'https://docs.google.com/presentation/u/0/', 'slides.png', 'color', 'Make presentations.', ['School']),
    L('Sheets', 'https://docs.google.com/spreadsheets/u/0/', 'sheets.png', 'color', 'Spreadsheets for labs, data and budgets.', ['School', 'Math', 'Science']),
    L('Calendar', 'https://calendar.google.com/calendar/u/0/r', 'calendar.png', 'color', 'Your school calendar.', ['School']),
    L('Keep', 'https://keep.google.com/u/0/', 'keep.png', 'color', 'Quick notes and checklists that sync to your phone.', ['School']),
    L('Translate', 'https://translate.google.com/', 'googleTranslate.png', 'color', 'Translate text, documents and websites in 100+ languages.', ['Languages'])
  ] },
  { category: 'Library & Research', links: [
    L('Libby', 'https://libbyapp.com/library/livebrary', 'libby.png', 'color', 'Free ebooks and audiobooks with an East Hampton Library card (Suffolk County Livebrary).', ['English', 'Research']),
    L('Library Catalog', 'https://search.follettsoftware.com/metasearch/ui/29877', 'libraryCatalog.png', 'color', 'Search the EHHS library’s books (Destiny).', ['Research', 'School']),
    L('Databases', 'https://auth.orc.scoolaid.net/bin/listdb?sysCode=xaaa&schoolId=773', 'database.png', 'black', 'Paid research databases the district gives you free: encyclopedias, articles, primary sources.', ['Research']),
    L('NewsBank', 'https://infoweb.newsbank.com/home', 'newsbank.png', 'color', 'Full-text newspaper archives for research papers, provided by the district.', ['Research', 'History & Gov']),
    L('JSTOR', 'https://www.jstor.org/', 'jstor.png', 'color', 'Scholarly journal articles and primary sources.', ['Research', 'History & Gov']),
    L('Google Scholar', 'https://scholar.google.com/', 'scholar.png', 'color', 'Search academic papers across every field, with citation counts and free PDFs where available.', ['Research', 'Science']),
    L('NoodleTools', 'https://my.noodletools.com/web2.0/projects.html', 'noodleTools.png', 'color', 'MLA/APA citations, notecards and outlines; the tool EHHS teachers use for research papers.', ['Research', 'English']),
    L('Purdue OWL', 'https://owl.purdue.edu/', 'writingLab.png', 'color', 'The go-to free guide for essay writing, grammar and citation rules.', ['English', 'Research']),
    L('Gutenberg', 'https://www.gutenberg.org/', 'gutenberg.png', 'color', '70,000+ free classic books, including many assigned in English class.', ['English']),
    L('EH Library', 'https://easthamptonlibrary.org/teens/', 'book.png', 'black', 'East Hampton Library’s teen page: events, volunteering, getting a library card.', ['English', 'Research'])
  ] },
  { category: 'Math & Science', links: [
    L('Delta Math', 'https://www.deltamath.com/app/student', 'deltaMath.png', 'black', 'Math practice your teachers assign, with instant feedback.', ['Math']),
    L('Desmos', 'https://www.desmos.com/calculator', 'desmos.png', 'color', 'Graphing, scientific, geometry and 3D calculators; the same Desmos built into the SAT.', ['Math', 'Test Prep']),
    L('WolframAlpha', 'https://www.wolframalpha.com/', 'wolframAlpha.png', 'color', 'Solves and explains math, chemistry and physics problems; checks your work.', ['Math', 'Science']),
    L('Khan Academy', 'https://www.khanacademy.org/', 'khanAcademy.png', 'color', 'Free lessons and practice for nearly every class, from Algebra to AP courses.', ['Math', 'Science', 'History & Gov', 'Test Prep']),
    L('JMAP', 'https://www.jmap.org/', 'jmap.png', 'color', 'Every NY math Regents question sorted by topic, with answers; the best free Regents math practice.', ['Math', 'Test Prep']),
    L('PhET Sims', 'https://phet.colorado.edu/', 'phet.png', 'color', 'Interactive physics, chemistry and biology simulations from CU Boulder.', ['Science']),
    L('Ptable', 'https://ptable.com/', 'ptable.png', 'color', 'Interactive periodic table: properties, electron configurations, isotopes.', ['Science'])
  ] },
  { category: 'AP, Regents & SAT', links: [
    L('AP Classroom', 'https://myap.collegeboard.org/', 'collegeBoard.png', 'black', 'AP practice questions, progress checks and your AP scores.', ['Test Prep']),
    L('AP Registration', 'https://user.totalregistration.net/AP/331700', 'apRegistration.png', 'black', 'Sign up and pay for AP exams at EHHS (Total Registration).', ['Test Prep', 'School']),
    L('AP Exam Dates', 'https://apcentral.collegeboard.org/exam-administration-ordering-scores/exam-dates', 'schedule.png', 'black', 'This year’s AP exam schedule.', ['Test Prep']),
    L('Fiveable', 'https://library.fiveable.me/', 'fiveable.png', 'color', 'Free AP study guides and unit reviews for every AP course.', ['Test Prep']),
    L('Knowt', 'https://knowt.io/', 'knowt.png', 'color', 'Free flashcards and practice tests; imports Quizlet sets without the paywall.', ['Test Prep']),
    L('AP Score Calculator', 'https://www.albert.io/blog/ap-score-calculators/', 'albert.png', 'color', 'Estimate your AP score from a practice test.', ['Test Prep']),
    L('Past Regents', 'https://www.nysedregents.org/', 'regents.png', 'color', 'Official past Regents exams, answer keys and rating guides from NYSED.', ['Test Prep', 'Science', 'History & Gov', 'English']),
    L('SAT Practice', 'https://satsuite.collegeboard.org/sat/practice-preparation', 'collegeBoard.png', 'black', 'Official free full-length SATs in Bluebook, plus Khan Academy prep.', ['Test Prep', 'College & Career']),
    L('Castle Learning', 'https://cl.castlelearning.com/Review/CLO/Account/LogOn', 'castleLearning.png', 'color', 'Regents-style review questions some EHHS teachers assign.', ['Test Prep'])
  ] },
  { category: 'College & Career', links: [
    L('Naviance', 'https://student.naviance.com/ehhs', 'naviance.png', 'black', 'EHHS’s college planning portal: send transcripts and track applications.', ['College & Career', 'School']),
    L('Common App', 'https://apply.commonapp.org/dashboard', 'commonApp.png', 'color', 'Apply to 1,000+ colleges with one application.', ['College & Career']),
    L('BigFuture', 'https://bigfuture.collegeboard.org/', 'bigfuture.png', 'color', 'Free college search, scholarship search and career quizzes.', ['College & Career']),
    L('College Scorecard', 'https://collegescorecard.ed.gov/', 'scorecard.png', 'color', 'US government data on any college: real cost after aid, graduation rates and graduates’ earnings.', ['College & Career']),
    L('Senior Forms', 'https://drive.google.com/file/d/1l_sidhiUY5l5mImLIdnsrSm6rP1GS0JP/view', 'seniorForms.png', 'black', 'The 2026–27 senior meeting packet. Brag sheets and the teacher recommendation request are on the Guidance page.', ['College & Career', 'School']),
    L('Scholarships', 'https://drive.google.com/drive/folders/1xqH-9kCW75CZ0MbwRHPDU_pZhQslTLEk', 'scholarships.png', 'black', 'Local East Hampton scholarships for seniors, posted by EHHS Guidance.', ['College & Career', 'School']),
    L('FAFSA', 'https://studentaid.gov/h/apply-for-aid/fafsa', 'fafsa.png', 'color', 'The federal form for grants, work-study and loans. File it senior year.', ['College & Career']),
    L('NYS Dream Act', 'https://www.hesc.ny.gov/dream/', 'dreamAct.png', 'black', 'State aid (TAP, scholarships) for New York students who can’t file the FAFSA, including undocumented students. Apply here instead.', ['College & Career']),
    L('NYS Aid (TAP)', 'https://www.hesc.ny.gov/pay-for-college/apply-for-financial-aid/nys-tap.html', 'nysAid.png', 'black', 'New York’s TAP grants and Excelsior Scholarship for in-state colleges.', ['College & Career']),
    L('SUNY', 'https://www.suny.edu/', 'university.png', 'black', 'New York’s state university system: 64 campuses, one application.', ['College & Career']),
    L('CUNY', 'https://www.cuny.edu/', 'cuny.png', 'color', 'City University of New York: 25 campuses in NYC.', ['College & Career']),
    L('Career OneStop', 'https://www.careeronestop.org/', 'careeronestop.png', 'black', 'US Department of Labor guide to careers, apprenticeships, trades and certifications: paths beyond a 4-year degree.', ['College & Career']),
    L('edX', 'https://home.edx.org/', 'edX.png', 'black', 'Free courses from Harvard, MIT and others: try a subject before college.', ['College & Career', 'Computer Science'])
  ] },
  { category: 'Languages', links: [
    L('Rosetta Stone', 'https://easthamptonufsd.rosettastoneclassroom.com/en-US', 'rosettaStone.png', 'color', 'Full language courses, free through the district.', ['Languages']),
    L('Duolingo', 'https://www.duolingo.com/', 'duolingo.png', 'color', 'Daily bite-size language practice.', ['Languages']),
    L('SpanishDict', 'https://www.spanishdict.com/', 'spanishdict.png', 'color', 'The best free Spanish dictionary, conjugator and grammar guide.', ['Languages']),
    L('Word Reference', 'https://www.wordreference.com/', 'wordReference.png', 'color', 'Dictionaries and forums for French, Italian, Spanish and more, with real usage examples.', ['Languages'])
  ] },
  { category: 'Classwork', links: [
    L('Kami', 'https://web.kamihq.com/web/viewer.html', 'kami.png', 'color', 'Annotate and fill in PDF worksheets.', ['School']),
    L('EdPuzzle', 'https://edpuzzle.com/', 'edpuzzle.png', 'color', 'Video lessons with questions your teachers assign.', ['School']),
    L('Remind', 'https://www.remind.com/', 'remind.png', 'color', 'Class and team text announcements.', ['School']),
    L('Quizlet', 'https://quizlet.com/latest', 'quizlet.png', 'color', 'Flashcard sets your teachers share.', ['School', 'Test Prep']),
    L('Kahoot', 'https://kahoot.it/', 'kahoot.png', 'color', 'Join a class Kahoot game.', ['School']),
    L('Blooket', 'https://play.blooket.com/play', 'blooket.png', 'color', 'Join a class Blooket game.', ['School']),
    L('Gimkit', 'https://www.gimkit.com/join', 'gimkit.png', 'color', 'Join a class Gimkit game.', ['School']),
    L('Wayground', 'https://wayground.com/join', 'wayground.png', 'color', 'Join a class quiz (formerly Quizizz).', ['School']),
    L('Grammarly', 'https://www.grammarly.com/', 'grammarly.png', 'color', 'Grammar and clarity checks as you write.', ['English']),
    L('Typing Club', 'https://www.typingclub.com/sportal/', 'typingClub.png', 'color', 'Learn to touch-type.', ['Computer Science'])
  ] },
  { category: 'Coding & Making', links: [
    L('GitHub', 'https://github.com/', 'github.png', 'black', 'Host code and projects; free extras with the GitHub Student Pack.', ['Computer Science']),
    L('CodeHS', 'https://codehs.com/', 'codeHS.png', 'color', 'EHHS computer science coursework.', ['Computer Science', 'School']),
    L('Code.org', 'https://studio.code.org/home', 'code.png', 'black', 'AP CS Principles and intro coding courses.', ['Computer Science']),
    L('p5.js', 'https://editor.p5js.org/', 'p5.png', 'color', 'Code art, games and animations in the browser.', ['Computer Science', 'Arts & Music']),
    L('W3Schools', 'https://www.w3schools.com/', 'w3schools.png', 'color', 'Beginner-friendly tutorials for HTML, CSS, JavaScript and Python.', ['Computer Science']),
    L('Scratch', 'https://scratch.mit.edu/', 'scratch.png', 'color', 'Block-based coding from MIT, great for a first program.', ['Computer Science']),
    L('Tinkercad', 'https://www.tinkercad.com/dashboard', 'tinkercad.png', 'color', '3D design for 3D printing, plus circuits.', ['Computer Science', 'Arts & Music', 'Science'])
  ] },
  { category: 'Study Help & Videos', links: [
    L('SparkNotes', 'https://www.sparknotes.com/', 'sparknotes.png', 'color', 'Book summaries, themes and No Fear Shakespeare (modern-English translations).', ['English']),
    L('CrashCourse', 'https://www.youtube.com/@crashcourse', 'crashCourse.png', 'color', 'Fast, clear videos on history, science, literature and more.', ['History & Gov', 'Science', 'English']),
    L('Heimler’s History', 'https://www.youtube.com/@heimlershistory', 'heilmer.png', 'color', 'AP US, World and European History reviews.', ['History & Gov', 'Test Prep']),
    L('Jacob Clifford', 'https://www.youtube.com/@jacobaclifford', 'clifford.png', 'color', 'Economics explained (ACDC Econ). Covers 12th-grade Economics and AP Micro/Macro.', ['History & Gov', 'Test Prep']),
    L('Organic Chemistry Tutor', 'https://www.youtube.com/@theorganicchemistrytutor', 'organicChemistryTutor.png', 'color', 'Step-by-step math, chemistry and physics problem walkthroughs.', ['Math', 'Science']),
    L('Bozeman Science', 'https://www.youtube.com/@Bozemanscience1', 'bozeman.png', 'color', 'AP Biology and Chemistry lessons.', ['Science', 'Test Prep']),
    L('Flipping Physics', 'https://www.youtube.com/@flippingphysics', 'flippingPhysics.png', 'black', 'Physics and AP Physics lessons.', ['Science', 'Test Prep']),
    L('Coding Train', 'https://www.youtube.com/@thecodingtrain', 'codingTrain.png', 'color', 'Fun creative-coding tutorials (p5.js, JavaScript).', ['Computer Science']),
    L('Brian McLogan', 'https://www.youtube.com/@brianmclogan', 'brianMclogan.png', 'color', 'Algebra through Calculus, worked out example by example.', ['Math']),
    L('YouTube', 'https://www.youtube.com/', 'youtube.png', 'color', 'Everything else.', [])
  ] },
  { category: 'Creative', links: [
    L('Canva', 'https://www.canva.com/', 'canva.png', 'color', 'Posters, slides, flyers and videos with templates.', ['Arts & Music']),
    L('Photopea', 'https://www.photopea.com/', 'photopea.png', 'color', 'Free Photoshop-like photo editor that runs in the browser.', ['Arts & Music']),
    L('Img BG Remover', 'https://www.remove.bg/', 'removeBG.png', 'black', 'Remove an image background in one click.', ['Arts & Music']),
    L('Sight Reading', 'https://www.sightreadingfactory.com/sight-reading', 'sightReading.png', 'black', 'Sight-reading exercises for music classes.', ['Arts & Music']),
    L('Spotify', 'https://open.spotify.com/', 'spotify.png', 'color', 'Music for studying.', ['Arts & Music'])
  ] },
  { category: 'News & Daily', links: [
    L('AP News', 'https://apnews.com/', 'apnews.png', 'color', 'Free, straight-news reporting from the Associated Press wire service.', ['History & Gov']),
    L('NY Times', 'https://www.nytimes.com/', 'nyTimes.png', 'black', 'National and world news. Ask the EHHS library for free access.', ['History & Gov', 'Research']),
    L('East Hampton Star', 'https://www.easthamptonstar.com/', 'ehstar.png', 'color', 'Local news for East Hampton, including Bonac sports and school board coverage.', ['History & Gov']),
    L('Weather', 'https://weather.com/weather/tenday/l/11937:4:US', 'weather.png', 'black', '10-day forecast for East Hampton.', []),
    L('Wordle', 'https://www.nytimes.com/games/wordle/index.html', 'wordle.png', 'color', 'The daily word game.', ['English']),
    L('Seterra', 'https://www.seterra.com/', 'seterra.png', 'color', 'Map quiz games for geography.', ['History & Gov'])
  ] },
  { category: 'Health & Support', links: [
    L('Health Office', 'https://www.easthamptonschools.org/healthservices', 'healthOffice.png', 'black', 'The EHHS nurse: feeling sick, medication, physicals, concussion care. 631-329-4134.', ['School', 'Health & Support']),
    L('Youth Connect', 'https://www.olaofeasternlongisland.org/', 'ola.png', 'color', 'Free, anonymous counselors from the East End for teens. Call or text 631-810-9010, 9am–11pm daily, in English or Spanish.', ['Health & Support', 'Languages']),
    L('FSL Counseling', 'https://www.fsl-li.org/locations/', 'fsl.png', 'color', 'Counseling for teens and families in East Hampton (316 Accabonac Rd). Call 631-324-3344 for an appointment; Spanish spoken.', ['Health & Support']),
    L('Response Hotline', 'https://www.responsecrisiscenter.org/', 'response.png', 'color', 'Long Island crisis line: 631-751-7500. Conexión, its Spanish line: 631-751-7423.', ['Health & Support']),
    L('988 Lifeline', 'https://988lifeline.org/', 'lifeline988.png', 'color', 'Free, confidential support 24/7. Call or text 988 if you or a friend is struggling.', ['Health & Support']),
    L('Trevor Project', 'https://www.thetrevorproject.org/', 'trevor.png', 'color', '24/7 crisis support and community for LGBTQ+ young people.', ['Health & Support']),
    L('The Retreat', 'https://allagainstabuse.org/', 'retreat.png', 'color', 'East Hampton’s help for dating violence, abuse or bullying: counseling, advocacy and a 24-hour hotline, 631-329-2200.', ['Health & Support']),
    L('HOPEline', 'https://oasas.ny.gov/HOPELine', 'hopeline.png', 'black', 'New York’s 24/7 line for drug, alcohol, vaping or gambling worries, yours or a friend’s. Call 1-877-846-7369 or text 467369.', ['Health & Support']),
    L('EH Food Pantry', 'https://www.easthamptonfoodpantry.org/', 'foodpantry.png', 'color', 'Free groceries for East Hampton families (159 Pantigo Rd, plus a pantry at the high school). 631-324-2300.', ['Health & Support'])
  ] }
];

const CUSTOM_CATEGORY = 'My links';
const LINK_CATEGORIES = LINK_LIBRARY.map((g) => g.category);
const ALL_DEFAULT_LINKS = LINK_LIBRARY.flatMap((g) => g.links.map((e) => e.link));
const DEFAULT_BY_URL = new Map(ALL_DEFAULT_LINKS.map((l) => [l[1], l]));
const CATEGORY_BY_URL = new Map(LINK_LIBRARY.flatMap((g) => g.links.map((e) => [e.link[1], g.category])));
const INFO_BY_URL = new Map(LINK_LIBRARY.flatMap((g) => g.links.map((e) => [e.link[1], { desc: e.desc, tags: e.tags }])));

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

const DEFAULT_ADDED_LINKS = DEFAULT_HOME_URLS.map((url) => DEFAULT_BY_URL.get(url).slice());
const DEFAULT_REMOVED_LINKS = ALL_DEFAULT_LINKS.filter((l) => !DEFAULT_HOME_URLS.includes(l[1])).map((l) => l.slice());

function categoryOf(link) {
  if (link[4] === 'custom') return CUSTOM_CATEGORY;
  return CATEGORY_BY_URL.get(link[1]) || CUSTOM_CATEGORY;
}
function infoOf(link) {
  return (link[4] !== 'custom' && INFO_BY_URL.get(link[1])) || { desc: '', tags: [] };
}

// ---------- Updating lists saved by older versions ----------
// Old URL → new URL (the link takes the new name/icon), or null to drop it everywhere.
const LINKS_VERSION = 8;
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
  // Sora no longer serves EHHS; Libby (East Hampton Library card) replaces it.
  'https://soraapp.com/welcome/login/370662/ils/ehufsdny/form/East%20Hampton%20UFSD': 'https://libbyapp.com/library/livebrary',
  'https://docs.google.com/presentation/d/1T-idGOxDysnA_qrA0ilTapPdZNXiYt-09Ew1kL1AUbk/preview?slide=id.gb047d9a6b6_0_28': null,
  'https://bonacbeachcomber.com/': null,
  'http://astromech.net/': null
};

// Dropped in the November 2026 review because a better free option is on the list.
// They leave the App Library, but stay on a home screen that already has them.
const RETIRED_URLS = new Set([
  'https://zbib.org/',                    // NoodleTools (district) does citations + notes
  'https://www.symbolab.com/',            // WolframAlpha + Desmos; Symbolab paywalls steps
  'https://www.geogebra.org/calculator',  // Desmos now has geometry and 3D too
  'https://www.udemy.com/',               // paid; edX and Khan Academy are free
  'https://www.verbix.com/',              // SpanishDict / WordReference conjugate better
  'https://www.shmoop.com/',              // SparkNotes covers it, free
  'https://brainly.com/',                 // answer-sharing; Khan Academy teaches it
  'https://www.coursehero.com/',          // paywalled answers
  'https://pixlr.com/'                    // Photopea is the stronger free editor
]);

function migrateList(list, seen) {
  const out = [];
  for (const link of list) {
    let next = link;
    if (link[4] !== 'custom' && Object.prototype.hasOwnProperty.call(LINK_MIGRATIONS, link[1])) {
      const to = LINK_MIGRATIONS[link[1]];
      if (to === null) continue;
      next = DEFAULT_BY_URL.get(to).slice();
    } else if (link[4] !== 'custom' && DEFAULT_BY_URL.has(link[1]) && String(link[2]).startsWith('/images/')) {
      // Built-in link: pick up its current icon and icon style, keep the user's name.
      const d = DEFAULT_BY_URL.get(link[1]);
      next = [link[0], d[1], d[2], d[3]];
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
  const removed = migrateList(data.removedLinks ? JSON.parse(data.removedLinks) : DEFAULT_REMOVED_LINKS, seen)
    .filter((l) => l[4] === 'custom' || !RETIRED_URLS.has(l[1]));
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
