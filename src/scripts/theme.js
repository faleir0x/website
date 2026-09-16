// Theme. Inlined synchronously in <head> so data-theme is set before first paint.
// Follows the device's light/dark preference (live) until the visitor clicks the
// toggle; that choice is saved and wins from then on. The click listener is
// delegated, so it binds before the header button exists. Its CSP hash is
// computed from this file in astro.config.mjs, so edits need no hash update.
(() => {
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

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element) || !event.target.closest('[data-theme-toggle]')) return;
    saved = root.dataset.theme === 'dark' ? 'light' : 'dark';
    apply(saved);
    try {
      localStorage.setItem('theme', saved);
    } catch {}
  });
})();
