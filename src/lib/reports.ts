import { readFile } from 'node:fs/promises';
import { getCollection, type CollectionEntry } from 'astro:content';
import { factLabels } from '../i18n/reports';
import { htmlLang, otherLang, type Lang } from '../i18n/ui';

export type Report = CollectionEntry<'reports'>;
type ReportData = Report['data'];

/**
 * Frontmatter keys that legitimately differ between translations. Everything else must match.
 * `draft` is here so a translation can stay in draft after the original is published.
 */
const LOCALIZED_KEYS = new Set(['lang', 'title', 'summary', 'topics', 'draft']);

/** Placeholder written by `npm run new`; a published report may not contain it. */
const PLACEHOLDER = 'FILL_ME';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** "blue/pt" → "blue" */
export const reportSlug = (entry: Report) => entry.id.slice(0, entry.id.indexOf('/'));

const neutralFields = (data: ReportData) =>
  JSON.stringify(
    Object.entries(data)
      .filter(([key]) => !LOCALIZED_KEYS.has(key))
      .sort(([a], [b]) => a.localeCompare(b)),
  );

async function validate(entries: Report[]) {
  const bySlug = new Map<string, Report>();
  for (const entry of entries) {
    const file = entry.id.slice(entry.id.indexOf('/') + 1);
    if (file !== entry.data.lang) {
      throw new Error(`reports/${entry.id}: lang "${entry.data.lang}" does not match file "${file}.mdx"`);
    }
    const slug = reportSlug(entry);
    if (!SLUG.test(slug)) {
      throw new Error(`reports/${slug}/: folder name must be lowercase letters, digits and hyphens`);
    }
    if (!entry.data.draft && entry.filePath) {
      const source = await readFile(entry.filePath, 'utf8');
      if (source.includes(PLACEHOLDER)) {
        throw new Error(`${entry.filePath}: still contains ${PLACEHOLDER} — fill it in or keep draft: true`);
      }
    }
    const pair = bySlug.get(slug);
    if (pair && neutralFields(pair.data) !== neutralFields(entry.data)) {
      throw new Error(
        `reports/${pair.id} and reports/${entry.id}: non-translated frontmatter differs (only ${[...LOCALIZED_KEYS].join(', ')} may)`,
      );
    }
    bySlug.set(slug, entry);
  }
}

let all: Promise<Report[]> | undefined;

const loadAll = () =>
  (all ??= getCollection('reports').then(async (entries) => {
    await validate(entries);
    return entries;
  }));

/** Published reports in `lang`, newest first. Drafts are visible in dev only. */
export async function getReports(lang: Lang) {
  return (await loadAll())
    .filter((e) => e.data.lang === lang && (import.meta.env.DEV || !e.data.draft))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Platform slot of the meta row: where the write-up comes from. */
export function reportSource(data: ReportData) {
  switch (data.kind) {
    case 'room':
    case 'disclosure':
      return data.platform;
    case 'ctf':
      return data.event;
  }
}

/** Level slot of the meta row. */
export function reportLevel(data: ReportData) {
  switch (data.kind) {
    case 'room':
      return data.difficulty;
    case 'ctf':
      return data.category;
    case 'disclosure':
      return data.cvss.severity;
  }
}

export const reportTopic = (data: ReportData) => data.topics.join(' · ');

/** ISO date (YYYY-MM-DD): unambiguous in both languages. Frontmatter dates are UTC midnight. */
export const isoDate = (date: Date) => date.toISOString().slice(0, 10);

/** getStaticPaths entries for /{lang}/reports/[slug]/. */
export async function reportPaths(lang: Lang) {
  const reports = await getReports(lang);
  const others = await getReports(otherLang(lang));
  return reports.map((report) => {
    const slug = reportSlug(report);
    return {
      params: { lang, slug },
      props: { report, hasTranslation: others.some((o) => reportSlug(o) === slug) },
    };
  });
}

export interface Fact {
  label: string;
  value: string;
  /** External link for the value. */
  href?: string;
  /** Long unbroken strings (CVSS vectors) may wrap anywhere. */
  breakAnywhere?: boolean;
}

const displayUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

/** Kind-specific rows for the facts band, in display order. */
export function reportFacts(data: ReportData, lang: Lang): Fact[] {
  const t = factLabels[lang];
  const facts: (Fact | false | "" | undefined)[] = [];

  switch (data.kind) {
    case 'room':
      facts.push(
        { label: t.platform, value: data.platform },
        { label: t.difficulty, value: data.difficulty },
        { label: t.room, value: displayUrl(data.url), href: data.url },
      );
      break;
    case 'ctf':
      facts.push(
        { label: t.event, value: data.event },
        { label: t.category, value: data.category },
        data.points !== undefined && { label: t.points, value: String(data.points) },
        data.url && { label: t.challenge, value: displayUrl(data.url), href: data.url },
      );
      break;
    case 'disclosure': {
      const { cvss, bounty } = data;
      const cwe = data.weakness.slice(4);
      facts.push(
        { label: t.program, value: data.program },
        { label: t.platform, value: data.platform },
        {
          label: t.weakness,
          value: data.weakness,
          href: `https://cwe.mitre.org/data/definitions/${cwe}.html`,
        },
        { label: t.cvss, value: `${cvss.score.toFixed(1)} · ${cvss.severity}` },
        {
          label: t.vector,
          value: cvss.vector,
          href: `https://www.first.org/cvss/calculator/${cvss.version}#${cvss.vector}`,
          breakAnywhere: true,
        },
        bounty && {
          label: t.bounty,
          value: new Intl.NumberFormat(htmlLang[lang], {
            style: 'currency',
            currency: bounty.currency,
            maximumFractionDigits: Number.isInteger(bounty.amount) ? 0 : 2,
          }).format(bounty.amount),
        },
        { label: t.reported, value: isoDate(data.reported) },
        data.resolved && { label: t.resolved, value: isoDate(data.resolved) },
        data.reportUrl && { label: t.report, value: displayUrl(data.reportUrl), href: data.reportUrl },
      );
      break;
    }
  }

  if (data.updated) facts.push({ label: t.updated, value: isoDate(data.updated) });
  return facts.filter((f): f is Fact => Boolean(f));
}
