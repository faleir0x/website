import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { langs } from './i18n/ui';

/*
 * One folder per write-up, one MDX file per language, images alongside:
 *   src/content/reports/blue/en.mdx      → id "blue/en"
 *   src/content/reports/blue/pt.mdx      → id "blue/pt"  (optional translation)
 *   src/content/reports/blue/nmap.png    → ![Nmap scan](./nmap.png)
 * The folder name is the URL slug. `lang` is repeated in frontmatter so it is
 * validated here and filterable without parsing ids.
 * Scaffold with `npm run new <slug> <room|ctf|disclosure>` (scripts/report.mjs).
 */

// Strict: a key from another kind (e.g. `cvss` on a room) is an error, not silently dropped.
const base = z.strictObject({
  lang: z.enum(langs),
  title: z.string().min(1),
  // Featured-card summary and <meta name="description">.
  summary: z.string().min(1),
  // Rendered joined with " · " (e.g. ["SMB", "EternalBlue"]).
  topics: z.array(z.string().min(1)).min(1),
  // Publication date of the write-up; orders the index and picks "Latest report".
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  draft: z.boolean().default(false),
});

const room = base.extend({
  kind: z.literal('room'),
  platform: z.enum(['TryHackMe', 'HackTheBox']),
  difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Insane']),
  url: z.url(),
});

const ctf = base.extend({
  kind: z.literal('ctf'),
  event: z.string().min(1),
  category: z.enum(['web', 'pwn', 'rev', 'crypto', 'forensics', 'osint', 'misc']),
  points: z.number().int().nonnegative().optional(),
  url: z.url().optional(),
});

const CVSS_3 =
  /^CVSS:3\.[01]\/AV:[NALP]\/AC:[LH]\/PR:[NLH]\/UI:[NR]\/S:[UC]\/C:[NLH]\/I:[NLH]\/A:[NLH]$/;
const CVSS_4 =
  /^CVSS:4\.0\/AV:[NALP]\/AC:[LH]\/AT:[NP]\/PR:[NLH]\/UI:[NPA]\/VC:[HLN]\/VI:[HLN]\/VA:[HLN]\/SC:[HLN]\/SI:[HLN]\/SA:[HLN](\/[A-Z]+:[A-Z])*$/;

const severityOf = (score: number) =>
  score === 0 ? 'None'
  : score < 4 ? 'Low'
  : score < 7 ? 'Medium'
  : score < 9 ? 'High'
  : 'Critical';

const cvss = z
  .object({
    vector: z.string().refine((v) => CVSS_3.test(v) || CVSS_4.test(v), {
      message: 'Expected a CVSS 3.0/3.1 or 4.0 base vector',
    }),
    score: z.number().min(0).max(10),
  })
  // Severity is derived, never authored, so it cannot disagree with the score.
  .transform((c) => ({
    ...c,
    version: c.vector.slice(5, 8) as '3.0' | '3.1' | '4.0',
    severity: severityOf(c.score),
  }));

const disclosure = base.extend({
  kind: z.literal('disclosure'),
  platform: z.literal('HackerOne'),
  program: z.string().min(1),
  weakness: z.string().regex(/^CWE-\d+$/),
  cvss,
  // Omit for VDPs / unpaid reports.
  bounty: z
    .object({
      amount: z.number().positive(),
      currency: z.string().regex(/^[A-Z]{3}$/),
    })
    .optional(),
  reported: z.coerce.date(),
  resolved: z.coerce.date().optional(),
  // Only set once the report is publicly disclosed on HackerOne.
  reportUrl: z.url().optional(),
});

const reports = defineCollection({
  loader: glob({ pattern: '*/{en,pt}.mdx', base: './src/content/reports' }),
  schema: z.discriminatedUnion('kind', [room, ctf, disclosure]),
});

export const collections = { reports };
