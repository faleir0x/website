// 404 page. Its CSP hash is computed from this file in astro.config.mjs.
(() => {
  // Random kaomoji from the JSON list rendered next to the headline.
  const title = document.getElementById('kaomoji');
  const list = document.getElementById('kaomoji-list');
  if (title && list) {
    const options = JSON.parse(list.textContent);
    title.textContent = options[Math.floor(Math.random() * options.length)];
  }

  // "Go back" links to the home page; when the visitor came from this site,
  // return to that page instead.
  const back = document.getElementById('go-back');
  let fromHere = false;
  try {
    fromHere = new URL(document.referrer).origin === location.origin;
  } catch {}
  if (back && fromHere && history.length > 1) {
    back.addEventListener('click', (event) => {
      event.preventDefault();
      history.back();
    });
  }
})();
