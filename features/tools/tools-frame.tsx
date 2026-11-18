"use client";

import { TechIcon } from "@/components/tech-icon";
import { tools } from "@/content/tools";
import { ui } from "@/content/ui";
import { T, useI18n } from "@/lib/i18n/i18n";
import { Frame } from "@/features/sheet/frame";
import s from "./tools.module.css";

/** Uma tecnologia. `slug` é o do Simple Icons (components/tech-icon.tsx); sem ícone lá, vira monograma. */
export type Tool = { slug: string; name: string };

/* Ferramentas (DESIGN.md §6): grade de ícones monocromáticos; o nome aparece no hover e no foco. */
export function ToolsFrame() {
  const { t } = useI18n();
  // 4 por linha; com poucas ferramentas, as linhas continuam 3 para os ícones não esticarem
  const rows = Math.max(3, Math.ceil(tools.length / 4));
  return (
    <Frame label={t(ui.tools)} title={<T>{t(ui.tools)}</T>} section={t(ui.tools)} mobile="auto">
      <ul className={s.tools} data-overflow="visible" style={{ gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}>
        {tools.map((tool) => (
          // focável: o rótulo com o nome aparece no hover e no foco (R1)
          <li key={tool.slug} className={s.tool} tabIndex={0}>
            <TechIcon slug={tool.slug} size={22} />
            <span className={s.tip} aria-hidden="true">{tool.name}</span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}
