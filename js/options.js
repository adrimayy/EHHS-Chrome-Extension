// Editing page. The preview is the real popup (mainPage.html?edit=1) so it always
// matches; this page handles settings, the App Library and the link editor.
(function () {
  'use strict';

  const ICON_SIZE = 128; // uploaded images are resized to this (px) and stored in the extension
  const $ = (id) => document.getElementById(id);
  const storageGet = (area, keys) => new Promise((r) => chrome.storage[area].get(keys, r));

  const isCustom = (link) => link[4] === 'custom' || String(link[2]).startsWith('data:') || !DEFAULT_BY_URL.has(link[1]);

  async function readLists() {
    await migrateStoredLinks();
    const { addedLinks, removedLinks } = await storageGet('local', ['addedLinks', 'removedLinks']);
    return {
      added: addedLinks ? JSON.parse(addedLinks) : DEFAULT_ADDED_LINKS.map((l) => l.slice()),
      removed: removedLinks ? JSON.parse(removedLinks) : DEFAULT_REMOVED_LINKS.map((l) => l.slice())
    };
  }
  function writeLists(added, removed) {
    return chrome.storage.local.set({ addedLinks: JSON.stringify(added), removedLinks: JSON.stringify(removed) });
  }
  const addToTop = () => $('addToTopCheckbox').checked;

  // ---------------- Settings ----------------
  const slider = $('myRange');
  const sliderValue = $('sliderValue');

  chrome.storage.sync.get(['sliderValue', 'isChecked'], (data) => {
    if (data.sliderValue) slider.value = data.sliderValue;
    sliderValue.textContent = slider.value;
    $('addToTopCheckbox').checked = !!data.isChecked;
  });
  slider.addEventListener('input', () => {
    sliderValue.textContent = slider.value;
    chrome.storage.sync.set({ sliderValue: slider.value });
  });
  $('addToTopCheckbox').addEventListener('change', (e) => chrome.storage.sync.set({ isChecked: e.target.checked }));

  // Period timer: school days come from the district calendar (schoolCalendar.js).
  const fmtDay = (d) => d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  function showCalendar() {
    const now = new Date();
    const info = getSchoolDayInfo(now);
    const lastYear = SCHOOL_YEARS[SCHOOL_YEARS.length - 1];
    const upcoming = SCHOOL_YEARS.find((y) => isoDay(now) <= y.lastDay);
    $('calYear').textContent = info.year ? info.year.name : (upcoming ? upcoming.name + ' (starts ' + fmtDay(new Date(upcoming.firstDay + 'T12:00')) + ')' : 'none loaded');
    $('calToday').textContent = info.schoolDay ? 'School day' : info.reason;
    const off = getNextDayOff(now);
    $('calNextOff').textContent = off ? `${fmtDay(off.date)} · ${off.reason}` : '—';
    const warn = $('calWarning');
    // Remind from April of the last loaded year on, when next year's calendar is usually out.
    warn.hidden = isoDay(now) < lastYear.lastDay.slice(0, 4) + '-04-01';
    warn.textContent = `The newest calendar loaded ends ${fmtDay(new Date(lastYear.lastDay + 'T12:00'))}. Add next year's dates to js/schoolCalendar.js when the district posts them.`;
  }
  getBadgeSettings().then((s) => {
    $('badgeEnabled').checked = s.badgeEnabled;
    showCalendar();
    updateBadgeNow();
  });
  $('badgeEnabled').addEventListener('change', (e) => chrome.storage.sync.set({ badgeEnabled: e.target.checked }));

  async function updateBadgeNow() {
    const badge = await refreshBadge();
    const chip = $('badgeNow');
    if (badge && badge.text) {
      chip.textContent = badge.text;
      chip.style.background = badge.color;
    } else {
      chip.textContent = 'off';
      chip.style.background = '#d6d0d2';
    }
  }
  setInterval(() => { updateBadgeNow(); showCalendar(); }, 15000);

  $('resetButton').addEventListener('click', async () => {
    const ok = confirm('Reset your home screen, App Library and settings? Custom links and uploaded images will be erased. This can’t be undone.');
    if (!ok) return;
    await chrome.storage.local.clear();
    await chrome.storage.sync.set({ isChecked: false, sliderValue: 3, mode: 'light', ...BADGE_DEFAULTS });
    location.reload();
  });

  // ---------------- Preview + jiggle mode ----------------
  const frame = $('previewFrame');
  const jiggleButton = $('jiggleButton');
  let jiggling = false;

  function setJiggle(on, tellFrame) {
    jiggling = on;
    jiggleButton.textContent = on ? 'Done' : 'Edit';
    jiggleButton.classList.toggle('active', on);
    $('previewHint').textContent = on
      ? 'Drag to move. Tap − to send a link to the App Library. Tap an icon to edit it.'
      : 'Exactly what the popup shows. Hold an icon or press Edit to move things around.';
    if (tellFrame) frame.contentWindow.postMessage({ type: 'setJiggle', on }, location.origin);
  }
  jiggleButton.addEventListener('click', () => setJiggle(!jiggling, true));

  window.addEventListener('message', (e) => {
    if (e.origin !== location.origin || e.source !== frame.contentWindow || !e.data) return;
    const msg = e.data;
    if (msg.type === 'size') {
      frame.style.width = Math.max(120, msg.width) + 'px';
      frame.style.height = Math.max(120, msg.height) + 'px';
    } else if (msg.type === 'jiggle') {
      setJiggle(msg.on, false);
    } else if (msg.type === 'ready') {
      // Start in edit mode: that's what this page is for.
      setJiggle(true, true);
    } else if (msg.type === 'editLink') {
      openSheet({ mode: 'edit', index: msg.index, link: msg.link });
    }
  });

  // ---------------- App Library ----------------
  const libraryGrid = $('libraryGrid');
  const search = $('librarySearch');

  function buildTile(link, index) {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'libraryTile' + (isCustom(link) ? ' custom' : '');
    tile.title = `Add ${link[0]} to the home screen\n${link[1]}`;

    const img = document.createElement('img');
    img.src = link[2];
    img.alt = '';
    const label = document.createElement('span');
    label.className = 'tileLabel';
    label.textContent = link[0];
    const add = document.createElement('span');
    add.className = 'addBadge';
    add.textContent = '+';
    tile.append(add, img, label);

    if (isCustom(link)) {
      const del = document.createElement('span');
      del.className = 'deleteBadge';
      del.textContent = '✕';
      del.title = 'Delete this custom link';
      del.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteFromLibrary(index, link);
      });
      tile.append(del);
    }
    tile.addEventListener('click', () => {
      tile.classList.add('adding');
      setTimeout(() => addFromLibrary(index, link), 160);
    });
    return tile;
  }

  // Grouped into categories, like the iPhone App Library.
  async function renderLibrary() {
    const { removed } = await readLists();
    const q = search.value.trim().toLowerCase();
    $('libraryCount').textContent = removed.length ? `(${removed.length})` : '';
    const groups = new Map([...LINK_CATEGORIES, CUSTOM_CATEGORY].map((c) => [c, []]));
    removed.forEach((link, index) => {
      if (q && !link[0].toLowerCase().includes(q) && !link[1].toLowerCase().includes(q) && !categoryOf(link).toLowerCase().includes(q)) return;
      groups.get(isCustom(link) ? CUSTOM_CATEGORY : categoryOf(link)).push([link, index]);
    });

    const scrollTop = libraryGrid.scrollTop;
    libraryGrid.textContent = '';
    let shown = 0;
    groups.forEach((entries, category) => {
      if (!entries.length) return;
      shown += entries.length;
      const section = document.createElement('section');
      section.className = 'librarySection';
      const heading = document.createElement('h3');
      heading.className = 'libraryHeading';
      heading.textContent = category;
      const grid = document.createElement('div');
      grid.className = 'libraryTiles';
      entries.forEach(([link, index]) => grid.appendChild(buildTile(link, index)));
      section.append(heading, grid);
      libraryGrid.appendChild(section);
    });
    if (!shown) {
      const empty = document.createElement('div');
      empty.className = 'emptyLibrary';
      empty.textContent = q ? 'No matches.' : 'Everything is on your home screen.';
      libraryGrid.appendChild(empty);
    }
    libraryGrid.scrollTop = scrollTop;
  }

  // Find the link again by value, in case the lists changed since rendering.
  function locate(list, index, link) {
    const key = JSON.stringify(link);
    if (JSON.stringify(list[index]) === key) return index;
    return list.findIndex((l) => JSON.stringify(l) === key);
  }

  async function addFromLibrary(index, link) {
    const { added, removed } = await readLists();
    const i = locate(removed, index, link);
    if (i === -1) return renderLibrary();
    removed.splice(i, 1);
    if (addToTop()) added.unshift(link); else added.push(link);
    await writeLists(added, removed);
  }

  async function deleteFromLibrary(index, link) {
    if (!confirm(`Delete “${link[0]}” for good?`)) return;
    const { added, removed } = await readLists();
    const i = locate(removed, index, link);
    if (i !== -1) removed.splice(i, 1);
    await writeLists(added, removed);
  }

  search.addEventListener('input', renderLibrary);
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && (changes.removedLinks || changes.addedLinks)) renderLibrary();
  });
  renderLibrary();

  // ---------------- New / edit link sheet ----------------
  const sheet = $('linkSheet');
  const form = $('add-link-form');
  const nameInput = $('link-name');
  const urlInput = $('link-url');
  const fileInput = $('link-image-file');
  const dropZone = $('dropZone');
  let sheetState = null; // { mode: 'new' | 'edit', index, link, image }

  function setImage(src) {
    sheetState.image = src;
    const preview = $('iconPreview');
    const tileImg = $('tilePreviewImg');
    if (src) {
      preview.src = src; preview.hidden = false;
      tileImg.src = src;
      $('dropZoneText').innerHTML = 'Click or drop<br>to replace';
    } else {
      preview.hidden = true; preview.removeAttribute('src');
      tileImg.removeAttribute('src');
      $('dropZoneText').innerHTML = 'Drop an image,<br>click to choose,<br>or paste';
    }
    showError('');
  }
  function showError(text) {
    $('imageError').textContent = text;
    $('imageError').hidden = !text;
  }

  function openSheet(state) {
    sheetState = { ...state, image: null };
    const editing = state.mode === 'edit';
    $('sheetTitle').textContent = editing ? 'Edit link' : 'New link';
    $('sheetSave').textContent = editing ? 'Save' : 'Add';
    $('sheetRemove').hidden = !editing;
    form.reset();
    if (editing) {
      nameInput.value = state.link[0];
      urlInput.value = state.link[1];
      form.querySelector(`input[name="link-color"][value="${state.link[3] === 'black' ? 'black' : 'color'}"]`).checked = true;
      setImage(state.link[2]);
    } else {
      setImage(null);
    }
    $('tilePreviewName').textContent = nameInput.value || 'Name';
    sheet.hidden = false;
    setTimeout(() => (editing ? nameInput : dropZone).focus(), 50);
  }
  function closeSheet() {
    sheet.hidden = true;
    sheetState = null;
  }

  nameInput.addEventListener('input', () => ($('tilePreviewName').textContent = nameInput.value || 'Name'));
  $('newLinkButton').addEventListener('click', () => openSheet({ mode: 'new' }));
  $('sheetCancel').addEventListener('click', closeSheet);
  sheet.addEventListener('mousedown', (e) => { if (e.target === sheet) closeSheet(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sheet.hidden) closeSheet(); });

  // Read any image file, fit it into a square and keep it as a data URL in extension storage.
  function fileToIcon(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) return reject(new Error('That file isn’t an image.'));
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth || ICON_SIZE, h = img.naturalHeight || ICON_SIZE;
        const scale = Math.min(ICON_SIZE / w, ICON_SIZE / h, 1) || 1;
        const dw = Math.max(1, Math.round(w * scale)), dh = Math.max(1, Math.round(h * scale));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(dw, dh);
        canvas.height = Math.max(dw, dh);
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Chrome can’t open that image. Try a PNG, JPG, SVG or WebP.'));
      };
      img.src = url;
    });
  }
  async function takeFile(file) {
    try {
      setImage(await fileToIcon(file));
    } catch (err) {
      showError(err.message);
    }
  }

  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); } });
  fileInput.addEventListener('change', () => fileInput.files[0] && takeFile(fileInput.files[0]));
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('over'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('over'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('over');
    const file = [...e.dataTransfer.files].find((f) => f.type.startsWith('image/'));
    if (file) takeFile(file); else showError('Drop an image file from your computer.');
  });
  document.addEventListener('paste', (e) => {
    if (sheet.hidden) return;
    const item = [...e.clipboardData.items].find((i) => i.type.startsWith('image/'));
    if (item) { e.preventDefault(); takeFile(item.getAsFile()); }
  });

  // Accepts full links, bare domains (adds https://) and the extension's own pages (/html/...).
  function normalizeUrl(raw) {
    let value = raw.trim();
    if (!value) return '';
    if (value.startsWith('/')) return value;
    if (!/^[a-z][a-z0-9+.-]*:/i.test(value)) value = 'https://' + value;
    try {
      const u = new URL(value);
      if (!['http:', 'https:'].includes(u.protocol) || (!u.hostname.includes('.') && u.hostname !== 'localhost')) return '';
      return u.href;
    } catch (e) {
      return '';
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!sheetState) return;
    if (!sheetState.image) {
      showError('Add an image for the icon.');
      return;
    }
    const url = normalizeUrl(urlInput.value);
    if (!url) {
      showError('That link doesn’t look right. Try something like https://www.desmos.com');
      urlInput.focus();
      return;
    }
    urlInput.value = url;
    const color = form.querySelector('input[name="link-color"]:checked').value;
    const { added, removed } = await readLists();

    if (sheetState.mode === 'edit') {
      const i = locate(added, sheetState.index, sheetState.link);
      if (i === -1) { closeSheet(); return; }
      const wasCustom = isCustom(sheetState.link);
      const updated = [nameInput.value.trim(), url, sheetState.image, color];
      if (wasCustom || sheetState.image.startsWith('data:')) updated.push('custom');
      added[i] = updated;
    } else {
      added.unshift([nameInput.value.trim(), url, sheetState.image, color, 'custom']);
    }
    await writeLists(added, removed);
    closeSheet();
  });

  $('sheetRemove').addEventListener('click', async () => {
    if (!sheetState || sheetState.mode !== 'edit') return;
    const { added, removed } = await readLists();
    const i = locate(added, sheetState.index, sheetState.link);
    if (i !== -1) {
      const [link] = added.splice(i, 1);
      if (addToTop()) removed.unshift(link); else removed.push(link);
      await writeLists(added, removed);
    }
    closeSheet();
  });
})();
