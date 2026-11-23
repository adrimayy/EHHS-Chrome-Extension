# Prints ESTIMATED school years for data/calendar.js, from the rules that held in
# both official calendars (2025-26 and 2026-27). See the comment above the
# estimated years in data/calendar.js for the rules.
#   pip install convertdate python-dateutil
#   python3 tools/estimate-years.py 2032 2034     -> 2032-33 and 2033-34
# Paste the output into SCHOOL_YEARS. Real Board calendars always replace these.
import sys
from datetime import date, timedelta
from convertdate import hebrew
from dateutil.easter import easter
WD = lambda d: d.weekday() < 5
def nth_weekday(y, m, wd, n):  # n-th weekday (0=Mon) of month
    d = date(y, m, 1); d += timedelta((wd - d.weekday()) % 7); return d + timedelta(7 * (n - 1))
def last_weekday(y, m, wd):
    d = date(y, m + 1, 1) - timedelta(1) if m < 12 else date(y, 12, 31)
    return d - timedelta((d.weekday() - wd) % 7)
def year(y):
    labor = nth_weekday(y, 9, 0, 1)
    first, last = labor + timedelta(1), nth_weekday(y + 1, 6, 4, 4)  # 4th Friday of June (= last Friday in both official years; the earlier when they differ)
    c = []
    add = lambda a, b, name: c.append((a, b, name))
    rh = date(*hebrew.to_gregorian(y + 3761, 7, 1)); yk = date(*hebrew.to_gregorian(y + 3761, 7, 10))
    if WD(rh): add(rh, rh, 'Rosh Hashanah')
    if WD(yk): add(yk, yk, 'Yom Kippur')
    col = nth_weekday(y, 10, 0, 2); add(col, col, 'Columbus Day')
    elec = nth_weekday(y, 11, 0, 1) + timedelta(1); add(elec, elec, 'Superintendent’s Conference Day / Election Day')
    vet = date(y, 11, 11)
    if WD(vet): add(vet, vet, 'Veterans’ Day')
    tg = nth_weekday(y, 11, 3, 4); add(tg - timedelta(1), tg + timedelta(1), 'Thanksgiving Recess')
    add(date(y, 12, 24), date(y + 1, 1, 1), 'Winter Recess')
    mlk = nth_weekday(y + 1, 1, 0, 3); add(mlk, mlk, 'Martin Luther King, Jr. Day')
    pres = nth_weekday(y + 1, 2, 0, 3); add(pres, pres + timedelta(4), 'Mid-Winter Recess')
    gf = easter(y + 1) - timedelta(2); add(gf, gf, 'Good Friday')
    mem = last_weekday(y + 1, 5, 0); add(mem, mem, 'Memorial Day')
    j = date(y + 1, 6, 19)
    if WD(j): add(j, j, 'Juneteenth')
    elif j.weekday() == 5: add(j - timedelta(1), j - timedelta(1), 'Juneteenth (observed)')
    c = [x for x in c if first <= x[0] <= last]
    c.sort()
    merged = []
    for a, b, n in c:  # same day, two reasons (e.g. Columbus Day + Yom Kippur)
        if merged and merged[-1][0] == a and merged[-1][1] == b: merged[-1] = (a, b, merged[-1][2] + ' / ' + n)
        else: merged.append((a, b, n))
    c = merged
    return first, last, c
# Sanity check: the rules must reproduce the official calendars' dates.
for y, f0, l0 in ((2025, date(2025, 9, 2), date(2026, 6, 26)), (2026, date(2026, 9, 8), date(2027, 6, 25))):
    f, l, _ = year(y)
    assert (f, l) == (f0, l0), f'rules no longer match the {y} calendar'
start = int(sys.argv[1]) if len(sys.argv) > 1 else 2027
stop = int(sys.argv[2]) if len(sys.argv) > 2 else start + 5
out = []
for y in range(start, stop):
    f, l, c = year(y)
    rows = ',\n'.join(f"      ['{a}', '{b}', '{n}']" for a, b, n in c)
    out.append(f"""  {{
    name: '{y}–{str(y + 1)[2:]}',
    estimated: true,
    firstDay: '{f}',
    lastDay: '{l}',
    closed: [
{rows}
    ],
    special: []
  }}""")
print(',\n'.join(out))
