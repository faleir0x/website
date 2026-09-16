import type { Lang } from './ui';

export const routes = {
  portfolio: { pt: '/', en: '/en/' },
  reports: { pt: '/relatorios/', en: '/en/reports/' },
} as const satisfies Record<string, Record<Lang, string>>;

export type View = keyof typeof routes;

export const reportPath = (lang: Lang, slug: string) => `${routes.reports[lang]}${slug}/`;
