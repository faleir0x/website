import type { Lang } from "@/lib/i18n/i18n";

const MONTHS: Record<Lang, string[]> = {
  pt: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

/**
 * Período de um emprego: “set 2023 – jun 2024”, ou “ago 2026 – hoje” sem fim.
 * start/end no formato "AAAA-MM"; `now` é a palavra para emprego atual no idioma.
 */
export function period(start: string, end: string | undefined, lang: Lang, now: string) {
  const f = (ym: string) => `${MONTHS[lang][Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`;
  return `${f(start)} – ${end ? f(end) : now}`;
}
