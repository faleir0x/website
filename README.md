# faleir0x.com

Personal site and security write-up blog. A quiet, static, bilingual (English /
Portuguese) portfolio built with Astro and plain CSS, deployed to Cloudflare
Pages.

**Live:** https://faleir0x.com

## Stack

- **[Astro](https://astro.build)** — static site generator (no SSR, static output only)
- **MDX** — write-ups are Markdown with a typed content schema
- **Plain CSS** — design tokens in one global stylesheet, everything else in
  component-scoped `<style>` blocks (no Tailwind, no CSS-in-JS)
- **Self-hosted fonts** (Barlow, Newsreader) via Astro's fonts integration
- **Cloudflare Pages** — auto-deploys on every push to `main`

Requires **Node 22.12+**.

## Getting started

```bash
npm install
npm run dev        # local dev server (http://localhost:4321)
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Type-check and build the static site into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run new <slug> <kind>` | Scaffold a new write-up (see below) |
| `npm run translate <slug>` | Create the Portuguese version of a write-up |

## Project structure

```
public/            Static files served as-is (_headers, _redirects, favicons,
                   robots.txt, and the resume PDFs)
scripts/           The write-up scaffolding CLI (report.mjs)
src/
  components/      Astro components (header, footer, report views, etc.)
  content/
    reports/       One folder per write-up (see below)
  i18n/            Copy decks and route maps for EN / PT
  layouts/         The base page layout (head, theme script, shell)
  pages/           Routes (/[lang]/, /[lang]/reports/, 404, sitemap, rss)
  scripts/         The tiny client-side scripts (theme, language, 404)
  styles/          global.css — design tokens (colors, fonts)
  content.config.ts  The write-up schema (Zod)
```

## Writing a report

Write-ups live in `src/content/reports/<slug>/`, one MDX file per language:

```
src/content/reports/blue/
  en.mdx          English version
  pt.mdx          Portuguese version (optional)
  nmap-scan.png   images live next to the write-up
```

The folder name is the URL slug: `blue/` becomes `/en/reports/blue/` and
`/pt/reports/blue/`.

### 1. Scaffold it

```bash
npm run new blue room
```

`<kind>` is one of:

- **`room`** — a TryHackMe / Hack The Box machine (platform, difficulty, URL)
- **`ctf`** — a CTF challenge (event, category, points)
- **`disclosure`** — a HackerOne disclosure (program, CWE, CVSS, bounty)

This creates `blue/en.mdx` as a **draft** with the right frontmatter fields for
that kind. Fields you need to fill in are marked `FILL_ME`.

### 2. Fill it in

- Complete every `FILL_ME` in the frontmatter.
- Add images to the folder and reference them with `![alt text](./image.png)` —
  they're optimized to WebP at build time.
- Write the body in Markdown.

### 3. Translate it (optional)

```bash
npm run translate blue
```

This copies `en.mdx` to `pt.mdx`. Translate the title, summary, topics and body;
keep every other field identical (the build enforces this).

### 4. Publish

Delete the `draft: true` line, then commit and push. Cloudflare Pages rebuilds
and the write-up goes live in about a minute.

**Guardrails the build enforces:**
- A published (non-draft) write-up cannot still contain `FILL_ME`.
- A translation must match its original on every field except title, summary,
  topics and draft status.
- Drafts are visible in `npm run dev` but never in the production build.

## Resume

The resume links point to `public/en/resume.pdf` and `public/pt/resume.pdf`.
Drop your PDFs there (create the `public/en` and `public/pt` folders if needed).
Until a file exists, the resume link shows the localized 404 page.

## Deployment

Cloudflare Pages is connected to this repo and builds on every push to `main`:

- **Build command:** `npm run build`
- **Output directory:** `dist`
- Node version is pinned by `.node-version`.

A failing build leaves the current live site untouched. Response headers, the
`/` → `/en/` language redirect, and the resume redirects live in
`public/_headers` and `public/_redirects`.

## Routing & i18n

- English is the default. Routes are prefixed per language: `/en/…` and `/pt/…`.
- `/` redirects to the visitor's language (Portuguese browsers to `/pt/`,
  everyone else to `/en/`).
- Each write-up is its own static, indexable page with `hreflang` alternates,
  and appears in the sitemap and the per-language RSS feed.
