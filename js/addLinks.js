// Renders the popup's link "waffle". The same file powers the live preview on the
// editing page (mainPage.html?edit=1), where icons can be rearranged and removed
// like apps on an iPhone home screen.
(function () {
  const EDIT_HOST = new URLSearchParams(location.search).get('edit') === '1';
  const LONG_PRESS_MS = 450;

  let items = [];          // [{ id, link }] in display order
  let nextId = 1;
  let rowHolder = 3;
  let isDarkMode = false;
  let jiggling = false;
  let drag = null;
  let pendingReload = false;
  let suppressClickUntil = 0;
  const elById = new Map();

  const storageGet = (area, keys) => new Promise((r) => chrome.storage[area].get(keys, r));
  const linkKey = (link) => JSON.stringify(link);

  async function readLinks() {
    await migrateStoredLinks();
    const { addedLinks } = await storageGet('local', ['addedLinks']);
    return addedLinks ? JSON.parse(addedLinks) : DEFAULT_ADDED_LINKS.map((l) => l.slice());
  }

  // Keep the same ids for unchanged links so they animate instead of popping.
  function setLinks(links) {
    const pool = new Map();
    items.forEach((it) => {
      const k = linkKey(it.link);
      if (!pool.has(k)) pool.set(k, []);
      pool.get(k).push(it.id);
    });
    items = links.map((link) => {
      const ids = pool.get(linkKey(link));
      return { id: ids && ids.length ? ids.shift() : nextId++, link };
    });
  }

  async function readRowHolder() {
    const data = await storageGet('sync', ['sliderValue']);
    return data.sliderValue ? parseInt(data.sliderValue) : 3;
  }

  function setTitleText(rowHolder) {
    const root = document.documentElement;
    const sizes = {
      1: ['106px', '50px', '0px', '0px', '8px', '', 'FB?'],
      2: ['180px', '140px', '5px', '8px', '0px', 'HS', 'Feedback?'],
      3: ['270px', '230px', '5px', '8px', '0px', 'HIGH SCHOOL', 'Feedback?'],
      4: ['360px', '320px', '5px', '8px', '0px', 'HIGH SCHOOL', 'Feedback?'],
      5: ['450px', '410px', '5px', '8px', '0px', 'HIGH SCHOOL', 'Feedback?']
    };
    const s = sizes[rowHolder] || sizes[3];
    root.style.setProperty('--link-container-width', s[0]);
    root.style.setProperty('--title-row-container-width', s[1]);
    root.style.setProperty('--feedback-margin-left', s[2]);
    root.style.setProperty('--body-sides-margin', s[3]);
    root.style.setProperty('--ehhs-logo-margin-left', s[4]);
    document.getElementById('titleText').innerHTML = s[5];
    document.getElementById('feedbackText').innerHTML = s[6];
  }

  function buildIcon(item) {
    const link = item.link;
    const linkContainer = document.createElement('a');
    linkContainer.classList.add('nameText');
    linkContainer.href = link[1];
    if (!String(link[1]).startsWith('/')) linkContainer.target = '_blank';
    linkContainer.dataset.id = item.id;
    linkContainer._key = linkKey(link);

    const box = document.createElement('div');
    box.classList.add('linkContainerBox');
    // Each icon wobbles slightly out of sync, like iOS.
    box.style.animationDelay = (-Math.random() * 0.3).toFixed(2) + 's';

    const iconImage = document.createElement('img');
    iconImage.classList.add('iconImage');
    iconImage.setAttribute('src', link[2]);
    iconImage.setAttribute('alt', link[3]);
    if (isDarkMode && link[3] === 'black') iconImage.classList.add('dark-mode');

    const nameContainer = document.createElement('div');
    nameContainer.classList.add('nameContainer');
    const nameText = document.createElement('p');
    nameText.classList.add('nameText');
    nameText.textContent = link[0];
    nameContainer.appendChild(nameText);

    box.appendChild(iconImage);
    box.appendChild(nameContainer);

    if (EDIT_HOST) {
      const badge = document.createElement('span');
      badge.className = 'removeBadge';
      badge.title = 'Remove from home screen';
      badge.setAttribute('role', 'button');
      box.appendChild(badge);
    }

    linkContainer.appendChild(box);
    return linkContainer;
  }

  function snapshot() {
    const rects = new Map();
    elById.forEach((el, id) => { if (el.isConnected) rects.set(id, el.getBoundingClientRect()); });
    return rects;
  }

  function render(animate) {
    const grid = document.getElementById('linkGrid');
    const before = animate ? snapshot() : null;
    grid.textContent = '';
    let row = null;
    items.forEach((item, i) => {
      if (i % rowHolder === 0) {
        row = document.createElement('div');
        row.classList.add('linkRow');
        grid.appendChild(row);
      }
      let el = elById.get(item.id);
      if (!el || el._key !== linkKey(item.link)) {
        el = buildIcon(item);
        elById.set(item.id, el);
      }
      row.appendChild(el);
    });
    const live = new Set(items.map((it) => it.id));
    for (const id of [...elById.keys()]) if (!live.has(id)) elById.delete(id);

    if (EDIT_HOST && items.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'emptyGrid';
      empty.textContent = 'No links yet — add some from the App Library.';
      grid.appendChild(empty);
    }

    // Untransformed layout centres, used for drag hit-testing.
    elById.forEach((el) => {
      el.style.transition = 'none';
      el.style.transform = '';
      const r = el.getBoundingClientRect();
      el._center = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });

    if (before) {
      elById.forEach((el, id) => {
        const b = before.get(id);
        if (!b || el.classList.contains('dragSource')) return;
        const a = el.getBoundingClientRect();
        const dx = b.left - a.left, dy = b.top - a.top;
        if (!dx && !dy) return;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        void el.offsetWidth;
        el.style.transition = 'transform 260ms cubic-bezier(.2,.8,.2,1)';
        el.style.transform = '';
      });
    }
    document.dispatchEvent(new CustomEvent('imageAdded'));
    reportSize();
  }

  // ---------- Editing (only on the editing page's preview) ----------

  function notifyParent(msg) {
    if (EDIT_HOST && window.parent !== window) window.parent.postMessage(msg, location.origin);
  }

  function reportSize() {
    if (!EDIT_HOST) return;
    const c = document.querySelector('.linksContainer');
    const r = c.getBoundingClientRect();
    notifyParent({ type: 'size', width: Math.ceil(r.right + r.left), height: Math.ceil(r.bottom + r.top) });
  }

  function setJiggle(on, fromInside) {
    jiggling = on;
    document.body.classList.toggle('jiggling', on);
    if (fromInside) notifyParent({ type: 'jiggle', on });
  }

  async function saveOrder() {
    await chrome.storage.local.set({ addedLinks: JSON.stringify(items.map((it) => it.link)) });
  }

  async function removeItem(id) {
    const index = items.findIndex((it) => it.id === id);
    if (index === -1) return;
    const el = elById.get(id);
    el.classList.add('removing');
    await new Promise((r) => setTimeout(r, 180));

    const [removed] = items.splice(index, 1);
    render(true);

    const [{ removedLinks }, { isChecked }] = await Promise.all([
      storageGet('local', ['removedLinks']),
      storageGet('sync', ['isChecked'])
    ]);
    const removedList = removedLinks ? JSON.parse(removedLinks) : DEFAULT_REMOVED_LINKS.map((l) => l.slice());
    if (isChecked) removedList.unshift(removed.link); else removedList.push(removed.link);
    await chrome.storage.local.set({
      addedLinks: JSON.stringify(items.map((it) => it.link)),
      removedLinks: JSON.stringify(removedList)
    });
  }

  function beginDrag(x, y) {
    const a = elById.get(drag.id);
    const r = a.getBoundingClientRect();
    const ghost = a.cloneNode(true);
    ghost.classList.add('dragGhost');
    ghost.style.left = r.left + 'px';
    ghost.style.top = r.top + 'px';
    ghost.style.width = r.width + 'px';
    ghost.style.height = r.height + 'px';
    ghost.style.transform = '';
    ghost.style.transition = '';
    document.body.appendChild(ghost);
    a.classList.add('dragSource');
    drag.started = true;
    drag.ghost = ghost;
    drag.offsetX = x - r.left;
    drag.offsetY = y - r.top;
  }

  function moveGhost(x, y) {
    drag.ghost.style.left = (x - drag.offsetX) + 'px';
    drag.ghost.style.top = (y - drag.offsetY) + 'px';
  }

  function reorderAt(x, y) {
    let best = -1, bestD = Infinity;
    items.forEach((it, idx) => {
      const c = elById.get(it.id)._center;
      const d = Math.hypot(x - c.x, y - c.y);
      if (d < bestD) { bestD = d; best = idx; }
    });
    const from = items.findIndex((it) => it.id === drag.id);
    if (best !== -1 && best !== from && bestD < 42) {
      const [it] = items.splice(from, 1);
      items.splice(best, 0, it);
      render(true);
    }
  }

  function endDrag() {
    const d = drag;
    drag = null;
    clearTimeout(d.longPress);
    if (!d.started) return d;
    suppressClickUntil = Date.now() + 400;
    const source = elById.get(d.id);
    const ghost = d.ghost;
    if (source && ghost) {
      const r = source.getBoundingClientRect();
      ghost.classList.add('dropping');
      ghost.style.left = r.left + 'px';
      ghost.style.top = r.top + 'px';
      setTimeout(() => {
        ghost.remove();
        source.classList.remove('dragSource');
      }, 200);
    } else if (ghost) {
      ghost.remove();
    }
    saveOrder();
    if (pendingReload) { pendingReload = false; reload(); }
    return d;
  }

  function enableEditing() {
    document.body.classList.add('editHost');
    const grid = document.getElementById('linkGrid');

    grid.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      const a = e.target.closest('a[data-id]');
      if (!a || e.target.closest('.removeBadge')) return;
      e.preventDefault();
      drag = { id: +a.dataset.id, startX: e.clientX, startY: e.clientY, started: false, longPress: null, pressedAt: Date.now() };
      document.body.setPointerCapture(e.pointerId);
      if (!jiggling) {
        drag.longPress = setTimeout(() => {
          if (!drag) return;
          setJiggle(true, true);
          beginDrag(drag.lastX ?? drag.startX, drag.lastY ?? drag.startY);
        }, LONG_PRESS_MS);
      }
    });

    document.body.addEventListener('pointermove', (e) => {
      if (!drag) return;
      drag.lastX = e.clientX; drag.lastY = e.clientY;
      const dist = Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY);
      if (!drag.started) {
        if (!jiggling) { if (dist > 8) { clearTimeout(drag.longPress); drag = null; } return; }
        if (dist < 5) return;
        beginDrag(e.clientX, e.clientY);
      }
      moveGhost(e.clientX, e.clientY);
      reorderAt(e.clientX, e.clientY);
    });

    const finish = (e) => {
      if (!drag) return;
      const d = endDrag();
      if (d.started || !jiggling) return;
      // A quick tap while jiggling opens the link editor on the editing page.
      if (e.type === 'pointerup') {
        const index = items.findIndex((it) => it.id === d.id);
        if (index !== -1) notifyParent({ type: 'editLink', index, link: items[index].link });
      }
    };
    document.body.addEventListener('pointerup', finish);
    document.body.addEventListener('pointercancel', finish);

    grid.addEventListener('click', (e) => {
      const badge = e.target.closest('.removeBadge');
      const a = e.target.closest('a[data-id]');
      if (badge && jiggling) {
        e.preventDefault();
        e.stopPropagation();
        removeItem(+a.dataset.id);
        return;
      }
      // While editing, icons don't open. The Schedule link would replace the preview, so block it too.
      if (jiggling || Date.now() < suppressClickUntil || (a && !a.target)) e.preventDefault();
    });

    // Pencil + feedback stay visible (it's a true preview) but don't open anything.
    document.querySelectorAll('.feedbackContainer a').forEach((a) =>
      a.addEventListener('click', (e) => e.preventDefault()));

    window.addEventListener('message', (e) => {
      if (e.origin !== location.origin || !e.data) return;
      if (e.data.type === 'setJiggle') setJiggle(!!e.data.on, false);
    });

    new ResizeObserver(reportSize).observe(document.querySelector('.linksContainer'));
  }

  async function reload() {
    if (drag) { pendingReload = true; return; }
    setLinks(await readLinks());
    render(true);
  }

  async function init() {
    const [links, rows, dark] = await Promise.all([readLinks(), readRowHolder(), storageGet('sync', ['isDarkMode'])]);
    rowHolder = rows;
    isDarkMode = !!dark.isDarkMode;
    setLinks(links);
    setTitleText(rowHolder);
    if (EDIT_HOST) enableEditing();
    render(false);

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes.addedLinks) {
        const incoming = changes.addedLinks.newValue;
        if (incoming !== JSON.stringify(items.map((it) => it.link))) reload();
      }
      if (area === 'sync' && changes.sliderValue) {
        rowHolder = parseInt(changes.sliderValue.newValue) || 3;
        setTitleText(rowHolder);
        render(true);
      }
      if (area === 'sync' && changes.isDarkMode) isDarkMode = !!changes.isDarkMode.newValue;
    });

    if (EDIT_HOST) notifyParent({ type: 'ready' });
  }

  window.addEventListener('load', init);
})();
