// Theme toggle. Inlined synchronously in <head> so
// data-theme is set before first paint. The click listener is delegated, so it
// binds before the header button exists. Its CSP hash is computed from this
// file in astro.config.mjs, so edits here need no manual hash update.
(() => {
  const root = document.documentElement;
  try {
    if (localStorage.getItem('theme') === 'dark') root.dataset.theme = 'dark';
  } catch {}
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element) || !event.target.closest('[data-theme-toggle]')) return;
    const dark = root.dataset.theme !== 'dark';
    if (dark) root.dataset.theme = 'dark';
    else delete root.dataset.theme;
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {}
  });
})();
