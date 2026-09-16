import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/*
 * One collection, one MDX file per (write-up, language):
 *   src/content/reports/pt/blue.mdx  → id "pt/blue"
 *   src/content/reports/en/blue.mdx  → id "en/blue"
 * Flat per language: the filename is the URL slug, and translations pair by it.
 * `lang` is repeated in frontmatter so it is validated here and filterable
 * without parsing ids.
 */

// Strict: a key from another kind (e.g. `cvss` on a room) is an error, not silently dropped.
const base = z.strictObject({
  lang: z.enum(['pt', 'en']),
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
  loader: glob({ pattern: '{pt,en}/*.mdx', base: './src/content/reports' }),
  schema: z.discriminatedUnion('kind', [room, ctf, disclosure]),
});

export const collections = { reports };
