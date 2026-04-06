// Sidebar active state + auto-open accordion
const sections = document.querySelectorAll('.lecture-section');
const navLinks = document.querySelectorAll('.sidebar a');
const navGroups = document.querySelectorAll('.nav-group');

// Map section IDs to lecture numbers
function getLectureNum(id) {
  if (!id) return -1;
  const m = id.match(/^(\d+)-/);
  return m ? parseInt(m[1]) : (id === 'cheatsheet' ? 8 : (id.startsWith('quiz') ? 9 : -1));
}

let lastLecture = -1;

window.addEventListener('scroll', () => {
  const viewStudy = document.querySelector('.view-study');
  if (!viewStudy?.classList.contains('active')) return;
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) {
      current = s.id;
    }
  });

  // Highlight active link
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });

  // Auto-open the corresponding accordion group
  const lectureNum = getLectureNum(current);
  if (lectureNum !== lastLecture && lectureNum > 0) {
    lastLecture = lectureNum;
    navGroups.forEach((group, i) => {
      if (i === lectureNum - 1) {
        group.classList.add('open');
      } else {
        group.classList.remove('open');
      }
    });
  }
});
