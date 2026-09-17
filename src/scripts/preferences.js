// Theme and language preferences. Inlined synchronously in <head> so data-theme is
// set before first paint. Its CSP hash is computed from this file in
// astro.config.mjs, so edits need no hash update.
(() => {
  // Theme follows the device's light/dark preference (live) until the visitor clicks
  // the toggle; that choice is saved and wins from then on.
  const root = document.documentElement;
  const system = matchMedia('(prefers-color-scheme: dark)');

  let saved = null;
  try {
    saved = localStorage.getItem('theme');
  } catch {}

  const apply = (theme) => {
    root.dataset.theme = theme;
  };
  apply(saved === 'dark' || saved === 'light' ? saved : system.matches ? 'dark' : 'light');

  system.addEventListener('change', (event) => {
    if (saved) return;
    apply(event.matches ? 'dark' : 'light');
  });

  // Delegated, so they bind before the header exists.
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;

    if (event.target.closest('[data-theme-toggle]')) {
      saved = root.dataset.theme === 'dark' ? 'light' : 'dark';
      apply(saved);
      try {
        localStorage.setItem('theme', saved);
      } catch {}
      return;
    }

    // Remember an explicit language switch for the "/" redirect (src/scripts/language.js).
    const langLink = event.target.closest('[data-lang-switch]');
    if (langLink instanceof HTMLElement) {
      try {
        localStorage.setItem('lang', langLink.dataset.langSwitch ?? '');
      } catch {}
    }
  });
})();
