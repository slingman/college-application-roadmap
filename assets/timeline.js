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
// Verified deadlines for her confirmed schools (see the Sample Application
// Quick Reference table). Anything else she adds starts with no deadline —
// she fills it in herself in the status timeline below.
const KNOWN_DEADLINES = {
  'UC Berkeley': '2026-11-30',
  'UCLA': '2026-11-30',
  'UC San Diego': '2026-11-30',
  'UC Irvine': '2026-11-30',
  'San Diego State University': '2026-11-30',
  'Cal State Long Beach': '2026-11-30',
  'Northwestern University': '2027-01-02',
};
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

function refreshSchoolViews(){
  renderSelectedSchools();
  renderStatusTimeline();
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
