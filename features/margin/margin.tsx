"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ThemeIcon } from "@/components/icon";
import { profile } from "@/content/profile";
import { ui } from "@/content/ui";
import { T, useI18n, type Lang } from "@/lib/i18n/i18n";
import { useTheme } from "@/lib/theme/theme";
import s from "./margin.module.css";

/*
 * Margem da folha (DESIGN.md §5–6): cidade e hora local à esquerda; idioma e tema à direita.
 * Devolve as duas pontas; quem desenha a faixa é a home (features/home).
 */
export function Margin() {
  const { t, lang, setLang } = useI18n();
  const [dark, toggleTheme] = useTheme();
  return (
    <>
      <p className={s.where}>
        <span>{profile.city}</span>
        <span aria-hidden="true">·</span>
        <Clock timeZone={profile.timeZone} />
        <span className="sr-only">
          <T>{t(ui.localTime)}</T>
        </span>
      </p>
      <div className={s.pill}>
        <div role="group" aria-label={t(ui.language)} className={s.pillGroup}>
          <LangIndicator lang={lang} />
          <button type="button" aria-pressed={lang === "pt"} onClick={() => setLang("pt")} lang="pt-BR" data-lang="pt">
            PT
          </button>
          <button type="button" aria-pressed={lang === "en"} onClick={() => setLang("en")} lang="en" data-lang="en">
            EN
          </button>
        </div>
        <span className={s.pillSep} aria-hidden="true" />
        <button type="button" aria-label={t(ui.darkTheme)} aria-pressed={dark} onClick={toggleTheme}>
          <ThemeIcon dark={dark} />
        </button>
      </div>
    </>
  );
}

/** Hora local em HH:MM, atualizada a cada 15 s (nunca segundos: R5). */
function Clock({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("pt-BR", { timeZone, hour: "2-digit", minute: "2-digit", hour12: false });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, [timeZone]);
  return (
    <time className={s.clock} suppressHydrationWarning>
      {time}
    </time>
  );
}

/** Fundo que desliza até o idioma escolhido (só transform). */
function LangIndicator({ lang }: { lang: Lang }) {
  const ref = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);
  useLayoutEffect(() => {
    const ind = ref.current;
    const btn = ind?.parentElement?.querySelector<HTMLElement>(`[data-lang="${lang}"]`);
    if (!ind || !btn) return;
    ind.style.width = `${btn.offsetWidth}px`;
    ind.style.transform = `translateX(${btn.offsetLeft}px)`;
    // a primeira posição entra sem animar
    if (!placed.current) {
      placed.current = true;
      requestAnimationFrame(() => ind.classList.add(s.indReady));
    }
  }, [lang]);
  return <span ref={ref} className={s.ind} aria-hidden="true" />;
}
