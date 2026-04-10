// ── View Toggle ──
const viewHero = document.querySelector('.view-hero');
const lectureViews = {};
for (let i = 1; i <= 8; i++) {
  lectureViews[i] = document.querySelector('.view-lecture-' + i);
}
lectureViews['exam'] = document.querySelector('.view-exam');

const quizViews = {};
for (let i = 1; i <= 8; i++) {
  quizViews[i] = document.querySelector('.view-quiz-' + i);
}

const viewCalc = document.querySelector('.view-calc');
const viewZtable = document.querySelector('.view-ztable');
const viewTtable = document.querySelector('.view-ttable');
const viewVocab = document.querySelector('.view-vocab');

const allViews = [viewHero, ...Object.values(lectureViews), ...Object.values(quizViews), viewCalc, viewZtable, viewTtable, viewVocab];

function hideAllViews() {
  allViews.forEach(v => { if (v) v.classList.remove('active'); });
  navGroups.forEach(g => g.classList.remove('open'));
  navLinks.forEach(l => l.classList.remove('active'));
}

function showLecture(lectureKey, scrollToId) {
  hideAllViews();
  const view = lectureViews[lectureKey];
  if (view) view.classList.add('active');

  // Open corresponding nav group
  const groupIdx = lectureKey === 'exam'
    ? [...navGroups].findIndex(g => g.querySelector('[data-lecture="exam"]'))
    : (parseInt(lectureKey) - 1);
  if (navGroups[groupIdx]) navGroups[groupIdx].classList.add('open');

  if (scrollToId) {
    setTimeout(() => {
      const el = document.getElementById(scrollToId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  } else {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

function showView(view, groupIdx) {
  hideAllViews();
  if (view) view.classList.add('active');
  if (groupIdx >= 0 && navGroups[groupIdx]) navGroups[groupIdx].classList.add('open');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// Lecture link clicks
document.querySelectorAll('[data-lecture]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const key = el.getAttribute('data-lecture');
    const href = el.getAttribute('href');
    const scrollTo = href && href.startsWith('#') ? href.substring(1) : null;
    showLecture(key, scrollTo);
    navLinks.forEach(l => l.classList.remove('active'));
    if (el.tagName === 'A') el.classList.add('active');
  });
});

// Quiz link clicks
document.querySelectorAll('[data-quiz]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const num = link.getAttribute('data-quiz');
    const parentGroup = link.closest('.nav-group');
    hideAllViews();
    if (quizViews[num]) quizViews[num].classList.add('active');
    if (parentGroup) parentGroup.classList.add('open');
    link.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
});

// Calc/table link clicks
document.querySelectorAll('[data-calc]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showView(viewCalc, navGroups.length - 1);
    link.classList.add('active');
  });
});

document.querySelectorAll('[data-ztable]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showView(viewZtable, navGroups.length - 1);
    link.classList.add('active');
  });
});

document.querySelectorAll('[data-ttable]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showView(viewTtable, navGroups.length - 1);
    link.classList.add('active');
  });
});

document.querySelectorAll('[data-vocab]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showView(viewVocab, navGroups.length - 1);
    link.classList.add('active');
  });
});

// Show hero by default
viewHero.classList.add('active');
