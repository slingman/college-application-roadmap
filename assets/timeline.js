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
// in your own, persisted locally, rendered into the "Additional Interests" list.
const CUSTOM_SCHOOLS_KEY = 'college-roadmap-custom-schools';
// Already shown in their own group above — don't duplicate them in Additional Interests.
const ALREADY_LISTED = ['UC Berkeley', 'UCLA', 'UC San Diego', 'UC Davis'];
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

function renderSelectedSchools(){
  if(!selectedList) return;
  selectedList.innerHTML = '';
  const checked = schoolChecks
    .filter(b => b.checked && !ALREADY_LISTED.includes(b.dataset.school))
    .map(b => ({ name: b.dataset.school, type: 'checked' }));
  const custom = loadCustomSchools().map(name => ({ name, type: 'custom' }));
  const all = [...checked, ...custom];

  if(all.length === 0){
    const li = document.createElement('li');
    li.className = 'empty-note';
    li.textContent = 'Nothing selected yet — check schools above or add your own.';
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
    btn.addEventListener('click', () => {
      if(type === 'checked'){
        const box = schoolChecks.find(b => b.dataset.school === name);
        if(box){
          box.checked = false;
          localStorage.setItem(schoolKey(name), '0');
        }
      } else {
        saveCustomSchools(loadCustomSchools().filter(n => n !== name));
      }
      renderSelectedSchools();
    });
    li.append(span, btn);
    selectedList.appendChild(li);
  });
}

schoolChecks.forEach(box => {
  const key = schoolKey(box.dataset.school);
  const saved = localStorage.getItem(key);
  if(saved !== null) box.checked = saved === '1';
  box.addEventListener('change', () => {
    localStorage.setItem(key, box.checked ? '1' : '0');
    renderSelectedSchools();
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
  renderSelectedSchools();
}

if(addSchoolBtn) addSchoolBtn.addEventListener('click', addCustomSchool);
if(customInput) customInput.addEventListener('keydown', (e) => {
  if(e.key === 'Enter'){
    e.preventDefault();
    addCustomSchool();
  }
});

renderSelectedSchools();

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
