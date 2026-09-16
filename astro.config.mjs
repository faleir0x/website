// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

// Astro hashes the scripts it bundles, not is:inline ones. BaseLayout inlines this
// file verbatim, so hashing the same bytes here keeps the CSP in sync.
const themeScript = readFileSync(new URL('./src/scripts/theme.js', import.meta.url), 'utf8');
const themeScriptHash = /** @type {`sha256-${string}`} */ (`sha256-${createHash('sha256').update(themeScript).digest('base64')}`);

export default defineConfig({
  site: 'https://faleir0x.com',
  output: 'static',
  // Cloudflare Pages redirects /x → /x/ for directory builds; emit matching links.
  trailingSlash: 'always',
  integrations: [
    mdx(),
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', pt: 'pt-BR' } },
      // "/" only redirects to /en/.
      filter: (page) => new URL(page).pathname !== '/',
    }),
  ],
  // Monochrome code blocks: no Shiki/Prism colors on a site with no accent color.
  markdown: { syntaxHighlight: false },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt'],
    // Both locales prefixed. "/" → /en/ is a 301 in public/_redirects;
    // src/pages/index.astro is the fallback for `astro preview`.
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  security: {
    // Hashes the scripts and styles Astro emits into a per-page <meta> CSP. frame-ancestors can't be set from <meta>, so it and
    // the other response headers live in public/_headers.
    csp: {
      directives: [
        "default-src 'none'",
        "img-src 'self' data:",
        "font-src 'self'",
        "base-uri 'none'",
        "form-action 'none'",
        'upgrade-insecure-requests',
      ],
      scriptDirective: { hashes: [themeScriptHash] },
    },
  },
  // Downloaded at build time and served from /_astro/fonts — no Google request at runtime.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Barlow',
      cssVariable: '--font-barlow',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Newsreader',
      cssVariable: '--font-newsreader',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
  ],
});
