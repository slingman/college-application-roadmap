// Persist checklist state locally.
const boxes = [...document.querySelectorAll('input[type="checkbox"]')];
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
