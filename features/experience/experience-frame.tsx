"use client";

import { useState } from "react";
import { TechIcon, techName } from "@/components/tech-icon";
import { experience } from "@/content/experience";
import { ui } from "@/content/ui";
import { T, useI18n, type Localized } from "@/lib/i18n/i18n";
import { Frame } from "@/features/sheet/frame";
import { period } from "./period";
import s from "./experience.module.css";

/** Um emprego. Datas em "AAAA-MM"; sem `end` é o emprego atual (ganha o ponto verde). */
export type Job = {
  company: string;
  role: Localized;
  start: string;
  end?: string;
  /** Uma ou duas frases: aparece no verso da tira (todas do mesmo tamanho) */
  summary: Localized;
  /** slugs do Simple Icons (components/tech-icon.tsx) */
  stacks: string[];
};

/*
 * Experiência em tiras (DESIGN.md §6, escolhida em design-explorations/timeline-e-icones.html):
 * cada emprego é uma tira do mesmo tamanho. Hover, foco ou toque viram a tira e mostram o resumo
 * e as stacks no mesmo lugar, então nada flutua e nada muda de tamanho.
 */
export function ExperienceFrame() {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <Frame size="row" label={t(ui.experience)} title={<T>{t(ui.experience)}</T>} section={t(ui.experience)}>
      <ol className={s.tiles}>
        {experience.map((j, i) => {
          const when = period(j.start, j.end, lang, t(ui.today));
          const role = t(j.role); // com \n onde a linha quebra na tira
          const stacks = j.stacks.map(techName).join(", ");
          return (
            <li key={j.company + j.start}>
              <button
                type="button"
                className={s.tile}
                data-open={open === i || undefined}
                aria-expanded={open === i}
                aria-label={`${role.replace(/\n/g, " ")}, ${j.company}, ${when}. ${t(j.summary)}${stacks ? ` ${stacks}.` : ""}`}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className={s.tileFace} aria-hidden="true">
                  <time>
                    {!j.end && <span className={s.nowDot} />}
                    <T>{when}</T>
                  </time>
                  <span>
                    <span className={s.tileRole}><T>{role}</T></span>
                    <span className={s.tileCo}>{j.company}</span>
                  </span>
                </span>
                <span className={s.tileBack} aria-hidden="true">
                  <span className={s.tileSum}><T>{t(j.summary)}</T></span>
                  <span className={s.tileStacks}>
                    {j.stacks.map((slug) => <TechIcon key={slug} slug={slug} />)}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </Frame>
  );
}
