// 404 page: swap the headline for a random kaomoji from the JSON list rendered
// next to it. Its CSP hash is computed from this file in astro.config.mjs.
(() => {
  const title = document.getElementById('kaomoji');
  const list = document.getElementById('kaomoji-list');
  if (!title || !list) return;
  const options = JSON.parse(list.textContent);
  title.textContent = options[Math.floor(Math.random() * options.length)];
})();
