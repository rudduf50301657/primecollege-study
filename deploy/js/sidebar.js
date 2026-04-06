// Sidebar active state + auto-open accordion
const sections = document.querySelectorAll('.lecture-section');
const navLinks = document.querySelectorAll('.sidebar a');
const navGroups = document.querySelectorAll('.nav-group');

// Map section IDs to lecture numbers
function getLectureNum(id) {
  if (!id) return -1;
  const m = id.match(/^(\d+)-/);
  return m ? parseInt(m[1]) : -1;
}

window.addEventListener('scroll', () => {
  // Only track scroll in lecture views
  const activeLecture = document.querySelector('[class*="view-lecture-"].active');
  if (!activeLecture) return;

  let current = '';
  const visibleSections = activeLecture.querySelectorAll('.lecture-section');
  visibleSections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) {
      current = s.id;
    }
  });

  if (current) {
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }
});
