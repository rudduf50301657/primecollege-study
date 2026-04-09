// ── Theme Toggle ──
function toggleTheme() {
  var root = document.documentElement;
  var isLight = root.getAttribute('data-theme') === 'light';
  root.setAttribute('data-theme', isLight ? '' : 'light');
  localStorage.setItem('theme', isLight ? 'dark' : 'light');
  updateToggleLabel();
}

function updateToggleLabel() {
  var el = document.getElementById('themeToggle');
  if (el) el.textContent = document.documentElement.getAttribute('data-theme') === 'light' ? '☀️' : '🌙';
}

// Apply saved theme on load
(function() {
  var saved = localStorage.getItem('theme');
  if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');
  updateToggleLabel();
})();
