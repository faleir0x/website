#!/usr/bin/env node
// Scaffold write-ups in src/content/reports/<slug>/.
//
//   npm run new <slug> <room|ctf|disclosure>   → <slug>/en.mdx (draft)
//   npm run translate <slug>                   → <slug>/pt.mdx from en.mdx (draft)
//
// Fields to complete are marked FILL_ME; the build refuses to publish a report
// that still contains it (src/lib/reports.ts).

import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const REPORTS = new URL('../src/content/reports/', import.meta.url);
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const today = new Date().toISOString().slice(0, 10);

const common = (kind) => `kind: ${kind}
lang: en
title: FILL_ME
summary: FILL_ME               # 1–2 sentences: the featured card and search results
topics: [FILL_ME]              # e.g. [SMB, EternalBlue]
date: ${today}               # publication date
draft: true                    # delete this line to publish`;

const templates = {
  room: (slug) => `---
${common('room')}
platform: TryHackMe            # TryHackMe | HackTheBox (HTB: retired machines only)
difficulty: Easy               # Easy | Medium | Hard | Insane
url: https://tryhackme.com/room/${slug}
---

{/* Redact flags and passwords. */}

## Recon

## Initial foothold

## Exploitation

## Privilege escalation

## Fix
`,

  ctf: () => `---
${common('ctf')}
event: FILL_ME                 # e.g. Foo CTF 2026 (publish after the event ends)
category: web                  # web | pwn | rev | crypto | forensics | osint | misc
# points: 100
# url: https://
---

## Challenge

## Analysis

## Exploitation

## Fix
`,

  disclosure: () => `---
${common('disclosure')}
platform: HackerOne
program: FILL_ME
weakness: CWE-0                # FILL_ME, e.g. CWE-639 (IDOR)
cvss:
  vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:N"  # FILL_ME (3.0, 3.1 or 4.0)
  score: 0                     # FILL_ME
# bounty: { amount: 500, currency: USD }   # omit if unpaid
reported: ${today}           # FILL_ME
# resolved: ${today}
# reportUrl: https://hackerone.com/reports/   # only once publicly disclosed
---

{/*
  Publish only after the program has publicly disclosed the report or given
  written permission. Redact tokens, internal hostnames and other users' data.
*/}

## Summary

## Steps to reproduce

## Impact

## Fix

## Timeline
`,
};

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

const usage = `Usage:
  npm run new <slug> <${Object.keys(templates).join('|')}>
  npm run translate <slug>`;

async function create(slug, kind) {
  if (!slug || !kind) fail(usage);
  if (!SLUG.test(slug)) fail(`"${slug}" is not a valid slug: lowercase letters, digits and hyphens (e.g. pickle-rick)`);
  if (!templates[kind]) fail(`unknown kind "${kind}"\n${usage}`);

  const dir = new URL(`${slug}/`, REPORTS);
  const file = new URL('en.mdx', dir);
  if (existsSync(dir)) fail(`src/content/reports/${slug}/ already exists`);

  await mkdir(dir, { recursive: true });
  await writeFile(file, templates[kind](slug));
  console.log(`✓ src/content/reports/${slug}/en.mdx
  Fill in every FILL_ME, add images next to it (![alt](./image.png)),
  then delete the draft line to publish.`);
}

async function translate(slug) {
  if (!slug) fail(usage);
  const dir = new URL(`${slug}/`, REPORTS);
  const source = new URL('en.mdx', dir);
  const target = new URL('pt.mdx', dir);
  if (!existsSync(source)) fail(`src/content/reports/${slug}/en.mdx not found`);
  if (existsSync(target)) fail(`src/content/reports/${slug}/pt.mdx already exists`);

  const en = await readFile(source, 'utf8');
  const end = en.indexOf('\n---', 3);
  if (!en.startsWith('---') || end === -1) fail('en.mdx has no frontmatter');

  let frontmatter = en.slice(0, end).replace(/^lang: en\b/m, 'lang: pt');
  // Drafts are per-language; everything else must stay identical to en.mdx.
  frontmatter = /^draft:/m.test(frontmatter)
    ? frontmatter.replace(/^draft:.*$/m, 'draft: true')
    : `${frontmatter}\ndraft: true`;
  frontmatter +=
    '\n# Translate title, summary, topics and the body. Keep every other field identical to en.mdx.';

  await writeFile(target, frontmatter + en.slice(end));
  console.log(`✓ src/content/reports/${slug}/pt.mdx
  Translate title, summary, topics and the body, then delete the draft line.`);
}

const [command, ...args] = process.argv.slice(2);
if (command === 'new') await create(...args);
else if (command === 'translate') await translate(...args);
else fail(usage);
