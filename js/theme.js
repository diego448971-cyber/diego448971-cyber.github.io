/* ================================================================
   A.D.N.D — Theme Manager
   ================================================================ */

const ThemeManager = (() => {
  const STORAGE_KEY = 'adnd-theme';
  const DEFAULT_THEME = 'dark';

  function getTheme() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    const icon = btn.querySelector('i');
    if (!icon) return;

    if (theme === 'dark') {
      icon.className = 'fas fa-sun';
      btn.setAttribute('title', 'Ativar tema claro');
      btn.setAttribute('aria-label', 'Ativar tema claro');
    } else {
      icon.className = 'fas fa-moon';
      btn.setAttribute('title', 'Ativar tema escuro');
      btn.setAttribute('aria-label', 'Ativar tema escuro');
    }
  }

  function toggle() {
    const current = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
    apply(current === 'dark' ? 'light' : 'dark');
  }

  function init() {
    apply(getTheme());

    const btn = document.getElementById('theme-toggle');
    btn?.addEventListener('click', toggle);
  }

  return { init, apply, toggle };
})();
