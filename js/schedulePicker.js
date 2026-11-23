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
    const picked = await getPickedSchedule();
    const plan = todaysPlan(now, picked);
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
      : plan.source === 'calendar'
        ? 'Set by the school calendar for today.'
        : 'Delay or snow day? Pick it here. It only lasts for today.';
    if (plan.id === EARLY_ID) note.textContent += ' The timer follows the regular bells until dismissal.';
    return plan;
  }

  async function save() {
    const id = select.value;
    const dismissal = id === EARLY_ID ? (time.value || '12:00').replace(/^0/, '') : null;
    await setPickedSchedule(id, dismissal);
    const plan = await render();
    if (onChange) onChange(plan);
  }
  select.addEventListener('change', save);
  time.addEventListener('change', save);
  render();
  return { render };
}
