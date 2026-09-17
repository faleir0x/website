// "/" only: send first-time visitors to /pt/ if their browser's first preferred
// language is Portuguese, otherwise /en/. A language picked with the header link
// (saved by preferences.js) wins. Deep links are never redirected. Its CSP hash is
// computed from this file in astro.config.mjs.
(() => {
  let lang = null;
  try {
    lang = localStorage.getItem('lang');
  } catch {}
  if (lang !== 'pt' && lang !== 'en') {
    const first = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    lang = first.toLowerCase().startsWith('pt') ? 'pt' : 'en';
  }
  location.replace(`/${lang}/`);
})();
