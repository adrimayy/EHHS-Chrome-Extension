// Light/dark mode for the popup. The choice is saved to chrome.storage.sync only
// when it changes (not on every popup open), so it doesn't use up Chrome's sync
// limits. The Schedule page reads `cssProperties` through applyStyles.js.
document.addEventListener('DOMContentLoaded', function () {
  const button = document.getElementById('lightDarkModeContainer');
  const darkModeClass = 'dark-mode';
  const THEMES = {
    dark: {
      '--background-color': '#2c2124',
      '--background-dark-color': '#1d1618',
      '--border-color': '#fbf9fa',
      '--border-eh-color': '#fbf9fa',
      '--text-color': '#fbf9fa',
      '--title-color': '#a80038',
      '--blue-time-color': '#183a93',
      '--grey-time-color': '#353230'
    },
    light: {
      '--background-color': '#fbf9fa',
      '--background-dark-color': '#f2f2f2',
      '--border-color': '#2c2124',
      '--border-eh-color': 'gray',
      '--text-color': '#2c2124',
      '--title-color': '#7A0C0D',
      '--blue-time-color': '#214fc6',
      '--grey-time-color': '#595959'
    }
  };
  let mode = 'light';

  function setIconFor(m) {
    const shade = m === 'dark' ? 'light' : 'dark';
    chrome.action.setIcon({
      path: {
        16: `/images/${shade}SimpleBonac16.png`,
        32: `/images/${shade}SimpleBonac32.png`,
        48: `/images/${shade}SimpleBonac48.png`,
        128: `/images/${shade}SimpleBonac128.png`
      }
    });
  }

  function apply(m) {
    mode = m;
    const dark = m === 'dark';
    const root = document.documentElement.style;
    for (const [property, value] of Object.entries(THEMES[m])) root.setProperty(property, value);
    // Icons marked alt="black" are one-color glyphs that turn white in dark mode.
    // New icons get the class from addLinks.js when they're built.
    document.querySelectorAll('img[alt="black"]').forEach((img) => img.classList.toggle(darkModeClass, dark));
    document.getElementById('lightDarkModeImage').setAttribute('src', dark ? '/images/lightBulb.png' : '/images/moon.png');
    document.getElementById('titleImage').setAttribute('src', dark ? '/images/lightSimpleBonac128.png' : '/images/darkSimpleBonac128.png');
  }

  // Only writes what's actually different from what's saved.
  function save(m, stored) {
    const changes = {};
    if (stored.mode !== m) changes.mode = m;
    if (stored.isDarkMode !== (m === 'dark')) changes.isDarkMode = m === 'dark';
    if (JSON.stringify(stored.cssProperties) !== JSON.stringify(THEMES[m])) changes.cssProperties = THEMES[m];
    if (Object.keys(changes).length) chrome.storage.sync.set(changes);
  }

  chrome.storage.sync.get(['mode', 'isDarkMode', 'cssProperties'], (stored) => {
    const m = stored.mode === 'dark' ? 'dark' : 'light';
    apply(m);
    save(m, stored); // first run (or an older version's leftovers) only
  });

  button.addEventListener('click', function () {
    const next = mode === 'light' ? 'dark' : 'light';
    apply(next);
    setIconFor(next);
    chrome.storage.sync.get(['mode', 'isDarkMode', 'cssProperties'], (stored) => save(next, stored));
    document.dispatchEvent(new CustomEvent('lightDarkModeChanged', { detail: next }));
  });
});
