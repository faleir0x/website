export const langs = ['pt', 'en'] as const;
export type Lang = (typeof langs)[number];

export const otherLang = (lang: Lang): Lang => (lang === 'pt' ? 'en' : 'pt');

/** BCP 47 tags for <html lang> and hreflang. */
export const htmlLang: Record<Lang, string> = { pt: 'pt-BR', en: 'en' };

/** Shell copy (header + footer). Page copy lives with its page. */
export const ui = {
  pt: {
    languageName: 'Português',
    themeLabel: 'Tema',
    cv: 'Currículo',
    portfolio: 'Portfolio',
    reports: 'Relatórios',
  },
  en: {
    languageName: 'English',
    themeLabel: 'Theme',
    cv: 'Resume',
    portfolio: 'Portfolio',
    reports: 'Reports',
  },
} as const satisfies Record<Lang, Record<string, string>>;
