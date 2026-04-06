// ── View Toggle (study ↔ quiz ↔ calc) ──
const viewStudy = document.querySelector('.view-study');
const viewQuiz1 = document.querySelector('.view-quiz-1');
const viewQuiz2 = document.querySelector('.view-quiz-2');
const viewQuiz3 = document.querySelector('.view-quiz-3');
const viewQuiz4 = document.querySelector('.view-quiz-4');
const viewQuiz5 = document.querySelector('.view-quiz-5');
const viewQuiz6 = document.querySelector('.view-quiz-6');
const viewQuiz7 = document.querySelector('.view-quiz-7');
const viewCalc = document.querySelector('.view-calc');
const viewZtable = document.querySelector('.view-ztable');
const viewTtable = document.querySelector('.view-ttable');
const quizViews = { '1': viewQuiz1, '2': viewQuiz2, '3': viewQuiz3, '4': viewQuiz4, '5': viewQuiz5, '6': viewQuiz6, '7': viewQuiz7 };
const allViews = [viewStudy, viewQuiz1, viewQuiz2, viewQuiz3, viewQuiz4, viewQuiz5, viewQuiz6, viewQuiz7, viewCalc, viewZtable, viewTtable];

function hideAllViews() {
  allViews.forEach(v => v.classList.remove('active'));
  navGroups.forEach(g => g.classList.remove('open'));
  navLinks.forEach(l => l.classList.remove('active'));
}

function showStudy(targetId) {
  hideAllViews();
  viewStudy.classList.add('active');
  if (targetId) {
    const el = document.getElementById(targetId);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    const num = getLectureNum(targetId);
    if (num > 0 && navGroups[num - 1]) navGroups[num - 1].classList.add('open');
  }
}

function showView(view, groupIdx) {
  hideAllViews();
  view.classList.add('active');
  if (groupIdx >= 0 && navGroups[groupIdx]) navGroups[groupIdx].classList.add('open');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

document.querySelectorAll('[data-quiz]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const num = link.getAttribute('data-quiz');
    showView(quizViews[num], navGroups.length - 2);
    link.classList.add('active');
  });
});

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

document.querySelectorAll('.sidebar a:not([data-quiz]):not([data-calc]):not([data-ztable]):not([data-ttable])').forEach(link => {
  link.addEventListener('click', e => {
    if (!viewStudy.classList.contains('active')) {
      e.preventDefault();
      const id = link.getAttribute('href').substring(1);
      showStudy(id);
      link.classList.add('active');
    }
  });
});
