// "Today's schedule" picker, shared by the Schedule page and the editing page.
// Needs data/bells.js, data/calendar.js, schoolCalendar.js and schedule.js.
// A pick only lasts for today; tomorrow goes back to the calendar's schedule.

function mountSchedulePicker(container, onChange) {
  container.classList.add('schedulePicker');
  container.innerHTML = `
    <label class="pickerRow">
      <span class="pickerLabel">Today’s schedule</span>
      <select class="pickerSelect"></select>
    </label>
    <label class="pickerRow pickerEarly" hidden>
      <span class="pickerLabel">Dismissal at</span>
      <input type="time" class="pickerTime" value="12:00" step="300">
    </label>
    <p class="pickerNote"></p>`;
  const select = container.querySelector('.pickerSelect');
  const earlyRow = container.querySelector('.pickerEarly');
  const time = container.querySelector('.pickerTime');
  const note = container.querySelector('.pickerNote');
  for (const c of scheduleChoices()) {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.name;
    select.appendChild(opt);
  }

  async function render() {
    const now = new Date();
    const info = getSchoolDayInfo(now);
    const [picked, announced] = await Promise.all([getPickedSchedule(), getAnnouncements()]);
    const plan = todaysPlan(now, picked, announced);
    if (!info.schoolDay) {
      select.disabled = true;
      select.value = 'regular';
      earlyRow.hidden = true;
      note.textContent = `No school today (${info.reason}).`;
      return plan;
    }
    select.disabled = false;
    select.value = plan.id;
    earlyRow.hidden = plan.id !== EARLY_ID;
    if (plan.dismissal) time.value = plan.dismissal.padStart(5, '0');
    note.textContent = plan.source === 'picked'
      ? 'You changed today’s schedule. It goes back to normal tomorrow.'
      : plan.source === 'school'
        ? 'Posted by EHHS' + (plan.message ? ': ' + plan.message : '.')
      : plan.source === 'calendar'
        ? 'Set by the school calendar for today.'
        : 'Delay or snow day? Pick it here. It only lasts for today.';
    if (plan.id === EARLY_ID) note.textContent += ' The timer follows the regular bells until dismissal.';
    return plan;
  }

  async function save() {
    const id = select.value;
    const dismissal = id === EARLY_ID ? (time.value || '12:00').replace(/^0/, '') : null;
    // Picking what the school/calendar already says just clears the student's pick.
    const base = todaysPlan(new Date(), null, await getAnnouncements());
    const same = base.id === id && (id !== EARLY_ID || base.dismissal === dismissal);
    await setPickedSchedule(same ? null : id, dismissal);
  }
  select.addEventListener('change', save);
  time.addEventListener('change', save);
  // Re-render when the student picks, or a new announcement arrives.
  chrome.storage.onChanged.addListener(async (changes, area) => {
    if (area !== 'local' || !(changes.todaySchedule || changes.announcements)) return;
    const plan = await render();
    if (onChange) onChange(plan);
  });
  render();
  return { render };
}
