import type { Lang } from './ui';

export const routes = {
  portfolio: { en: '/en/', pt: '/pt/' },
  reports: { en: '/en/reports/', pt: '/pt/reports/' },
} as const satisfies Record<string, Record<Lang, string>>;

export type View = keyof typeof routes;

export const reportPath = (lang: Lang, slug: string) => `${routes.reports[lang]}${slug}/`;

export const rssPath = (lang: Lang) => `${routes.reports[lang]}rss.xml`;
