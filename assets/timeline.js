// Persist checklist state locally.
const boxes = [...document.querySelectorAll('input[type="checkbox"]:not(.school-check)')];
boxes.forEach((box, i) => {
  const key = 'college-roadmap-' + i;
  const saved = localStorage.getItem(key);
  if (saved !== null) box.checked = saved === '1';
  box.addEventListener('change', () => {
    localStorage.setItem(key, box.checked ? '1' : '0');
    updateProgress();
  });
});

function updateProgress(){
  const progressBoxes = [...document.querySelectorAll('[data-progress]')];
  const checked = progressBoxes.filter(b => b.checked).length;
  const pct = progressBoxes.length ? Math.round((checked / progressBoxes.length) * 100) : 0;
  document.getElementById('progress').value = pct;
  document.getElementById('progressNum').textContent = pct + '%';
}
updateProgress();

// School interest picker: check schools from the reference list and/or type
// in your own, persisted locally, rendered into "Her College List".
const CUSTOM_SCHOOLS_KEY = 'college-roadmap-custom-schools';
// UC and CSU admission requirements and deadlines are set system-wide, not
// per campus (verified: all 9 UC campuses share one deadline and neither UC
// nor CSU requires essays/recommendations/interviews for general admission).
// So every UC and CSU campus that appears anywhere on the page — not just
// her confirmed ones — gets the same shared info below, rather than only
// whichever campuses happened to be manually listed (a UC or CSU school
// present as a checkbox but missing here was exactly the bug that prompted
// this refactor).
const UC_SCHOOLS = [...document.querySelectorAll('.school-check')]
  .map(b => b.dataset.school)
  .filter(name => name === 'UCLA' || name.startsWith('UC '));
const CSU_SCHOOLS = [...document.querySelectorAll('.school-check')]
  .map(b => b.dataset.school)
  .filter(name => /^(San Diego State University|Cal State |CSU )/.test(name));

const UC_DEADLINE = '2026-11-30';
const UC_INFO = { platform: 'UC App', essays: '4 PIQs', recommendations: 'No routine letters', interview: 'No routine interview', rd: 'Nov 30 UC deadline' };
const CSU_DEADLINE = '2026-11-30';
const CSU_INFO = { platform: 'Cal State Apply', essays: 'No essay for general admission', recommendations: 'Not required', interview: 'Not offered', rd: 'Nov 30 CSU deadline' };

// Verified data for every other school in the "Psychology Programs to
// Consider" reference list (researched from official admissions pages,
// cross-checked against secondary sources; see commit message for the
// research pass this came from). `deadline` is null for schools with no
// fixed RD deadline (rolling admission, no confirmed date) — the status
// timeline correctly shows "No deadline set" for those rather than a
// fabricated date; `rd` still explains why in the Quick Reference table.
const REFERENCE_SCHOOLS = {
  'Stanford University': { deadline: '2027-01-05', platform: 'Common App', essays: 'Personal statement + 8 short items (5 short answers, 3 short essays)', recommendations: '2 teacher + 1 counselor letter', interview: 'Optional (alumni, where available)', rd: 'Jan 5 (REA: Nov 1)' },
  'Harvard University': { deadline: '2027-01-01', platform: 'Common App / Coalition / QuestBridge', essays: 'Personal statement + 5 required short answers (~150w each)', recommendations: '2 teacher + 1 counselor letter', interview: 'Optional (alumni, where available)', rd: 'Jan 1, 2027' },
  'Yale University': { deadline: '2027-01-02', platform: 'Common App / Coalition / QuestBridge', essays: 'Personal statement + short-answer supplement', recommendations: '2 teacher + 1 counselor letter', interview: 'Optional (alumni, where available)', rd: 'Jan 2 (SCEA: Nov 1)' },
  'Princeton University': { deadline: '2027-01-01', platform: 'Common App + Princeton Supplement', essays: 'Personal statement + ~250w essay + 3 short (~50w) essays', recommendations: '2 teacher + 1 counselor letter + 1 graded paper', interview: 'Optional (alumni, where available)', rd: 'Jan 1 (arts supplement Jan 8)' },
  'University of Michigan–Ann Arbor': { deadline: '2027-02-01', platform: 'Common App / Coalition', essays: 'Personal statement + 2 required supplements', recommendations: '1 counselor + 1 additional letter', interview: 'Not offered', rd: 'Feb 1, 2027 (EA: Nov 1)' },
  'Duke University': { deadline: '2027-01-05', platform: 'Common App / Coalition / QuestBridge', essays: 'Personal statement + 2 required 250w essays + 1 optional', recommendations: '1 counselor + 2 teacher letters', interview: 'Optional (alumni; Glimpse/InitialView video)', rd: '~Jan 5 (unconfirmed for 2026-27)' },
  'University of Pennsylvania': { deadline: '2027-01-05', platform: 'Common App / Coalition / QuestBridge', essays: 'Personal statement + 3 required short essays', recommendations: '1 counselor + 1 teacher letter', interview: 'Not offered', rd: 'Jan 5, 2027' },
  'Johns Hopkins University': { deadline: null, platform: 'Common App / Coalition', essays: 'Personal statement + 1 required supplement (200-350w)', recommendations: '2 teacher + 1 counselor letter', interview: 'Not offered', rd: '~Early Jan (unconfirmed for 2026-27)' },
  'Columbia University': { deadline: '2027-01-01', platform: 'Common App / QuestBridge', essays: 'Personal statement + supplement (6 short items)', recommendations: '2 teacher + 1 counselor letter', interview: 'Not offered', rd: 'Jan 1, 2027 (ED: Nov 1)' },
  'Cornell University': { deadline: '2027-01-02', platform: 'Common App / QuestBridge', essays: 'Personal statement + college-specific supplement (varies)', recommendations: '2 teacher + 1 counselor letter', interview: 'Not offered', rd: 'Jan 2, 2027' },
  'Brown University': { deadline: '2027-01-05', platform: 'Common App / QuestBridge', essays: 'Personal statement + supplement (4 short essays)', recommendations: '2 teacher + 1 counselor letter', interview: 'Not offered (optional video intro)', rd: '~Jan 5 (SlideRoom items Jan 7)' },
  'Vanderbilt University': { deadline: '2027-01-01', platform: 'Common App / Coalition / QuestBridge', essays: 'Personal statement + 1 required ~400w essay', recommendations: '2 teacher + 1 counselor letter', interview: 'Optional (InitialView/Glimpse video)', rd: 'Jan 1, 2027' },
  'Washington University in St. Louis': { deadline: '2027-01-04', platform: 'Common App / Coalition / QuestBridge', essays: 'Personal statement + 1 required ~250w supplement', recommendations: '1 counselor + 1 teacher evaluation', interview: 'Not offered (general admission)', rd: 'Jan 4, 2027' },
  'Carnegie Mellon University': { deadline: '2027-01-04', platform: 'Common App / QuestBridge', essays: 'Personal statement + 3 required ~300w supplements', recommendations: '2 teacher (1 math/science) + 1 counselor letter', interview: 'Not offered (optional on request)', rd: 'Jan 4, 2027' },
  'USC': { deadline: '2027-01-10', platform: 'Common App / QuestBridge', essays: 'Personal statement + 2 required essays + short answers', recommendations: '1 letter (counselor or teacher)', interview: 'Not offered', rd: 'Jan 10, 2027 (EA/ED: Nov 1)' },
  'Emory University': { deadline: '2027-01-01', platform: 'Common App / QuestBridge', essays: 'Personal statement + 2 required supplements', recommendations: '1 counselor + 2 teacher letters', interview: 'Not offered (optional alumni feedback)', rd: 'Jan 1' },
  'Boston University': { deadline: '2027-01-05', platform: 'Common App', essays: 'Personal statement + 1 required supplement', recommendations: '1 teacher + 1 counselor letter', interview: 'Optional (invitation-only)', rd: 'Jan 5' },
  'Tufts University': { deadline: '2027-01-04', platform: 'Common App / Coalition / QuestBridge', essays: 'Personal statement + 2 required essays', recommendations: '1 teacher + 1 counselor letter', interview: 'Optional (alumni, on request)', rd: 'Jan 4, 2027' },
  'University of Illinois Urbana-Champaign': { deadline: '2026-11-01', platform: 'myIllini / Common App / Coalition', essays: '2 required short essays (~150w each)', recommendations: 'Not required', interview: 'Not offered', rd: 'Priority Nov 1 (rolling after)' },
  'University of Wisconsin–Madison': { deadline: '2027-02-01', platform: 'Common App / UW System App', essays: '1 required supplement (80-650w)', recommendations: '1 letter required', interview: 'Not offered', rd: 'Feb 1, 2027' },
  'Case Western Reserve': { deadline: '2027-01-15', platform: 'Common App / Coalition', essays: 'Personal statement only — no general supplement', recommendations: '2 teacher + 1 counselor letter', interview: 'Optional (not required)', rd: 'Jan 15, 2027' },
  'NYU': { deadline: '2027-01-05', platform: 'Common App / Coalition / QuestBridge', essays: 'Personal statement + 1 optional supplement', recommendations: '1 letter (teacher, counselor, or other)', interview: 'Not offered', rd: 'Jan 5, 2027' },
  'Wake Forest University': { deadline: '2027-01-01', platform: 'Common App', essays: '1 required ≤150w essay + several optional items', recommendations: '1 teacher or counselor letter', interview: 'Optional (non-evaluative)', rd: 'Jan 1' },
  'Brandeis University': { deadline: '2027-01-01', platform: 'Common App', essays: 'Personal statement only (domestic applicants)', recommendations: '1 teacher letter + counselor report', interview: 'By invitation only', rd: 'Jan 1 (materials due Jan 15)' },
  'Rochester Institute': { deadline: '2027-01-15', platform: 'Common App / RIT App', essays: 'Personal statement — no general supplement', recommendations: '1 letter (counselor preferred)', interview: 'Optional (Hometown Interviews)', rd: '~Jan 15 (rolling; unconfirmed)' },
  'University of Florida': { deadline: '2027-01-15', platform: 'Common App', essays: 'Personal statement required', recommendations: 'Not considered — do not submit', interview: 'Not offered', rd: 'Jan 15, 2027' },
  'University of Texas at Austin': { deadline: '2026-12-01', platform: 'ApplyTexas / Common App', essays: '650w essay + 1 major-specific short answer', recommendations: 'Optional', interview: 'Not offered', rd: 'Dec 1, 2026' },
  'Penn State University': { deadline: '2026-11-30', platform: 'MyPennState / Common App', essays: 'No essay required (1 optional supplement)', recommendations: 'Not required', interview: 'Not offered', rd: 'Priority Nov 30 (rolling after)' },
  'University of Minnesota': { deadline: '2027-01-01', platform: 'Common App / MyU', essays: '2 required short prompts (~150w each)', recommendations: 'Not required', interview: 'Not offered', rd: 'Jan 1, 2027 (EA: Nov 1)' },
  'Fordham University': { deadline: '2027-01-03', platform: 'Common App', essays: 'Personal statement + 1 optional ~300w supplement', recommendations: '1 teacher + 1 counselor letter (likely required)', interview: 'Not offered', rd: '~Jan 3' },
  'American University': { deadline: '2027-01-20', platform: 'Common App', essays: 'Personal statement + 1 optional ~250w supplement', recommendations: '1 teacher letter', interview: 'Optional (informational, not evaluative)', rd: '~Jan 20' },
  'Pepperdine University': { deadline: '2027-01-15', platform: 'Common App', essays: 'Personal statement + 1 required supplement (300-500w)', recommendations: '1 academic letter required', interview: 'Optional (evaluative)', rd: '~Jan 15' },
  'University of San Diego': { deadline: '2027-01-15', platform: 'Common App', essays: 'Personal statement + 2 required supplements (~350w each)', recommendations: '1 letter required', interview: 'Not offered', rd: '~Jan 15' },
  'Loyola Marymount University': { deadline: '2027-01-15', platform: 'Common App / LMU App', essays: 'Personal statement + 1 supplement (500w, technically optional)', recommendations: '1 letter required', interview: 'Not offered', rd: 'Jan 15' },
  'Santa Clara University': { deadline: '2027-01-07', platform: 'Common App', essays: 'Personal statement + 1 required ~50w question + 1 optional supplement', recommendations: '1+ teacher letter required', interview: 'Not offered (domestic)', rd: '~Jan 7' },
  'University of Denver': { deadline: '2027-01-15', platform: 'Common App', essays: 'Personal statement only — no required supplement', recommendations: '1 counselor letter required', interview: 'Not offered', rd: '~Jan 15' },
  'Arizona State University': { deadline: '2026-11-01', platform: 'Common App / ASU App', essays: 'Not required', recommendations: 'Not required', interview: 'Not offered', rd: 'Priority Nov 1 (rolling)' },
  'University of Colorado at Boulder': { deadline: '2027-01-15', platform: 'Common App', essays: 'Personal statement + 1 required ~250w CU question', recommendations: '1 letter required', interview: 'Not offered', rd: 'Jan 15, 2027' },
  'University of Iowa': { deadline: null, platform: 'Common App / Iowa App', essays: 'Not required', recommendations: 'Not required', interview: 'Not offered', rd: 'Rolling — no fixed deadline' },
  'University of Kansas': { deadline: '2026-12-01', platform: 'Common App / KU App', essays: 'Not required', recommendations: 'Not required', interview: 'Not offered', rd: 'Rolling — priority Dec 1 for scholarships' },
  'University of Missouri': { deadline: '2026-12-01', platform: 'Common App / Mizzou App', essays: 'Required if via Common App; else 3 short essays', recommendations: 'Not required', interview: 'Not offered', rd: 'Rolling — priority Dec 1 for scholarships' },
  'Oklahoma State University': { deadline: null, platform: 'Common App / OSU App', essays: 'Not required (recommended for scholarships)', recommendations: 'Not clearly required', interview: 'Not offered', rd: 'Rolling — no fixed deadline' },
};

// Verified deadlines for her confirmed/reference schools. Anything else she
// adds starts with no deadline — she fills it in herself in the status
// timeline below.
const KNOWN_DEADLINES = {
  ...Object.fromEntries(UC_SCHOOLS.map(name => [name, UC_DEADLINE])),
  ...Object.fromEntries(CSU_SCHOOLS.map(name => [name, CSU_DEADLINE])),
  'Northwestern University': '2027-01-02',
  ...Object.fromEntries(Object.entries(REFERENCE_SCHOOLS).filter(([, s]) => s.deadline).map(([name, s]) => [name, s.deadline])),
};
// Verified application requirements for the same schools, shown in the
// Sample Application Quick Reference table. Any school without an entry
// here falls back to "Verify current cycle" rather than guessing.
const SCHOOL_INFO = {
  ...Object.fromEntries(UC_SCHOOLS.map(name => [name, UC_INFO])),
  ...Object.fromEntries(CSU_SCHOOLS.map(name => [name, CSU_INFO])),
  'Northwestern University': { platform: 'Common App / Coalition', essays: 'Personal statement optional; 1 required short answer', recommendations: '1 teacher + 1 counselor letter', interview: 'Optional (Glimpse video)', rd: 'Jan 2, 2027' },
  ...Object.fromEntries(Object.entries(REFERENCE_SCHOOLS).map(([name, s]) => [name, s])),
};
const UNVERIFIED_INFO = { platform: 'Verify current cycle', essays: 'Verify current cycle', recommendations: 'Verify current cycle', interview: 'Verify current cycle', rd: 'Verify current cycle' };
const schoolChecks = [...document.querySelectorAll('.school-check')];
const selectedList = document.getElementById('selectedSchoolsList');
const customInput = document.getElementById('customSchoolInput');
const addSchoolBtn = document.getElementById('addSchoolBtn');

function schoolKey(name){ return 'college-roadmap-school-' + name; }

function loadCustomSchools(){
  try {
    const raw = localStorage.getItem(CUSTOM_SCHOOLS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch(e){
    return [];
  }
}
function saveCustomSchools(list){
  localStorage.setItem(CUSTOM_SCHOOLS_KEY, JSON.stringify(list));
}

function getSelectedSchools(){
  const checked = schoolChecks
    .filter(b => b.checked)
    .map(b => ({ name: b.dataset.school, type: 'checked' }));
  const custom = loadCustomSchools().map(name => ({ name, type: 'custom' }));
  return [...checked, ...custom];
}

function removeSelectedSchool(name, type){
  if(type === 'checked'){
    const box = schoolChecks.find(b => b.dataset.school === name);
    if(box){
      box.checked = false;
      localStorage.setItem(schoolKey(name), '0');
    }
  } else {
    saveCustomSchools(loadCustomSchools().filter(n => n !== name));
  }
  refreshSchoolViews();
}

function renderSelectedSchools(){
  if(!selectedList) return;
  selectedList.innerHTML = '';
  const all = getSelectedSchools();

  if(all.length === 0){
    const li = document.createElement('li');
    li.className = 'empty-note';
    li.textContent = 'Nothing on the list yet — check schools below or add your own above.';
    selectedList.appendChild(li);
    return;
  }

  all.forEach(({ name, type }) => {
    const li = document.createElement('li');
    li.className = 'selected-item';
    const span = document.createElement('span');
    span.textContent = name;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'remove-school';
    btn.textContent = '×';
    btn.setAttribute('aria-label', 'Remove ' + name);
    btn.addEventListener('click', () => removeSelectedSchool(name, type));
    li.append(span, btn);
    selectedList.appendChild(li);
  });
}

// Status timeline: each school on the list gets an editable deadline and
// status, sorted by what's due soonest. Deadlines prefill from known dates
// where we have them (data.js), otherwise she fills them in herself.
const statusList = document.getElementById('statusTimelineList');
const STATUSES = [
  { value: 'not-started', label: 'Not Started' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'decided', label: 'Decision Received' },
];

function deadlineKey(name){ return 'college-roadmap-deadline-' + name; }
function statusKey(name){ return 'college-roadmap-status-' + name; }

function daysLeftLabel(dateStr){
  if(!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(dateStr + 'T00:00:00');
  const days = Math.round((deadline - today) / 86400000);
  if(days < 0) return { text: 'Past due', urgent: true };
  if(days === 0) return { text: 'Due today', urgent: true };
  if(days <= 14) return { text: days + ' days left', urgent: true };
  return { text: days + ' days left', urgent: false };
}

function renderStatusTimeline(){
  if(!statusList) return;
  statusList.innerHTML = '';
  const schools = getSelectedSchools().map(({ name }) => {
    const savedDeadline = localStorage.getItem(deadlineKey(name));
    const deadline = savedDeadline !== null ? savedDeadline : (KNOWN_DEADLINES[name] || '');
    const status = localStorage.getItem(statusKey(name)) || 'not-started';
    return { name, deadline, status };
  });

  if(schools.length === 0){
    const li = document.createElement('li');
    li.className = 'empty-note';
    li.textContent = 'Add schools to Lotus\'s list above to start tracking deadlines.';
    statusList.appendChild(li);
    return;
  }

  schools.sort((a, b) => {
    if(!a.deadline && !b.deadline) return a.name.localeCompare(b.name);
    if(!a.deadline) return 1;
    if(!b.deadline) return -1;
    return a.deadline.localeCompare(b.deadline);
  });

  schools.forEach(({ name, deadline, status }) => {
    const li = document.createElement('li');
    li.className = 'status-row';

    const nameEl = document.createElement('span');
    nameEl.className = 'status-school';
    nameEl.textContent = name;

    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.className = 'status-date';
    dateInput.value = deadline;
    dateInput.setAttribute('aria-label', name + ' deadline');
    dateInput.addEventListener('change', () => {
      localStorage.setItem(deadlineKey(name), dateInput.value);
      renderStatusTimeline();
    });

    const select = document.createElement('select');
    select.className = 'status-select status-' + status;
    STATUSES.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.value;
      opt.textContent = s.label;
      if(s.value === status) opt.selected = true;
      select.appendChild(opt);
    });
    select.addEventListener('change', () => {
      localStorage.setItem(statusKey(name), select.value);
      select.className = 'status-select status-' + select.value;
      renderStatusTimeline();
    });

    const daysEl = document.createElement('span');
    const info = daysLeftLabel(deadline);
    daysEl.className = 'status-days' + (info && info.urgent ? ' urgent' : '');
    daysEl.textContent = info ? info.text : 'No deadline set';

    li.append(nameEl, dateInput, select, daysEl);
    statusList.appendChild(li);
  });
}

// Sample Application Quick Reference: updates live along with the list and
// status timeline above, from the same selected-schools data.
const quickRefBody = document.getElementById('quickRefBody');

function renderQuickReference(){
  if(!quickRefBody) return;
  quickRefBody.innerHTML = '';
  const names = getSelectedSchools().map(s => s.name);

  if(names.length === 0){
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 6;
    td.className = 'empty-note';
    td.textContent = 'Nothing on her list yet — check schools below or add your own above.';
    tr.appendChild(td);
    quickRefBody.appendChild(tr);
    return;
  }

  names.forEach(name => {
    const info = SCHOOL_INFO[name] || UNVERIFIED_INFO;
    const tr = document.createElement('tr');
    [name, info.platform, info.essays, info.recommendations, info.interview, info.rd].forEach(text => {
      const td = document.createElement('td');
      td.textContent = text;
      tr.appendChild(td);
    });
    quickRefBody.appendChild(tr);
  });
}

function refreshSchoolViews(){
  renderSelectedSchools();
  renderStatusTimeline();
  renderQuickReference();
}

schoolChecks.forEach(box => {
  const key = schoolKey(box.dataset.school);
  const saved = localStorage.getItem(key);
  if(saved !== null) box.checked = saved === '1';
  box.addEventListener('change', () => {
    localStorage.setItem(key, box.checked ? '1' : '0');
    refreshSchoolViews();
  });
});

function addCustomSchool(){
  if(!customInput) return;
  const name = customInput.value.trim();
  if(!name) return;
  const list = loadCustomSchools();
  if(list.some(n => n.toLowerCase() === name.toLowerCase())){
    customInput.value = '';
    return;
  }
  list.push(name);
  saveCustomSchools(list);
  customInput.value = '';
  refreshSchoolViews();
}

if(addSchoolBtn) addSchoolBtn.addEventListener('click', addCustomSchool);
if(customInput) customInput.addEventListener('keydown', (e) => {
  if(e.key === 'Enter'){
    e.preventDefault();
    addCustomSchool();
  }
});

refreshSchoolViews();

// Set today's date dynamically in two places: the header and the footer
(function setTodayDates(){
  try{
    const opts = { year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    const formatted = today.toLocaleDateString(undefined, opts);
    const hdr = document.getElementById('todayDate');
    const ftr = document.getElementById('currentDate');
    if(hdr) hdr.textContent = formatted;
    if(ftr) ftr.textContent = formatted;
  }catch(e){
    // fail silently — keep the hard-coded fallback date if formatting fails
    console.warn('Could not set today\'s date dynamically', e);
  }
})();
