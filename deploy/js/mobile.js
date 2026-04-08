// ── Mobile Navigation ──
(function() {
  var menuBtn = document.getElementById('menuBtn');
  var sidebar = document.querySelector('.sidebar');
  var overlay = document.getElementById('sidebarOverlay');

  if (!menuBtn || !sidebar || !overlay) return;

  menuBtn.addEventListener('click', function() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
  });

  overlay.addEventListener('click', function() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  });

  // Close sidebar when a nav link is clicked (mobile)
  sidebar.querySelectorAll('a[data-lecture], a[data-quiz]').forEach(function(link) {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 900) {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
      }
    });
  });
})();
