import rss from '@astrojs/rss';
import type { APIContext, GetStaticPaths } from 'astro';
import { reportsCopy } from '../../../i18n/reports';
import { reportPath, routes } from '../../../i18n/routes';
import { htmlLang, langs, type Lang } from '../../../i18n/ui';
import { getReports, reportSlug } from '../../../lib/reports';

export const getStaticPaths = (() => langs.map((lang) => ({ params: { lang } }))) satisfies GetStaticPaths;

export async function GET({ params, site }: APIContext) {
  const lang = params.lang as Lang;
  const t = reportsCopy[lang];
  const reports = await getReports(lang);

  return rss({
    title: t.pageTitle,
    description: t.intro,
    // Channel <link>; item links resolve against its origin.
    site: new URL(routes.reports[lang], site).href,
    customData: `<language>${htmlLang[lang]}</language>`,
    items: reports.map((report) => ({
      title: report.data.title,
      description: report.data.summary,
      pubDate: report.data.date,
      link: reportPath(lang, reportSlug(report)),
      categories: report.data.topics,
    })),
  });
}
