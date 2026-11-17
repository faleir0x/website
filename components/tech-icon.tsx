import type { ReactNode } from "react";
import {
  siDocker,
  siGooglecloud,
  siGrafana,
  siJavascript,
  siN8n,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siSpotify,
} from "simple-icons";
import { CUSTOM_ICONS } from "./custom-icons";
import s from "./tech-icon.module.css";

/*
 * Ícones de tecnologia (DESIGN.md §6): monocromáticos em currentColor, num grid de 24×24.
 *   - marcas do Simple Icons (CC0): importe o `si…` e coloque em SIMPLE;
 *   - o que não existe lá: desenhado ou adaptado em custom-icons.tsx;
 *   - sem ícone nenhum: nome em NAMES, vira monograma do mesmo tamanho (ex.: Zabbix).
 */
const SIMPLE: Record<string, { title: string; path: string }> = {
  python: siPython,
  javascript: siJavascript,
  react: siReact,
  nodedotjs: siNodedotjs,
  n8n: siN8n,
  docker: siDocker,
  googlecloud: siGooglecloud,
  grafana: siGrafana,
  // o pgvector não tem logo: usa o elefante do PostgreSQL, de quem é extensão
  pgvector: { title: "pgvector", path: siPostgresql.path },
  spotify: siSpotify, // atribuição no quadro Ouvindo
};

/** Tecnologias sem ícone: viram monograma com este nome */
const NAMES: Record<string, string> = { zabbix: "Zabbix" };

/** O slug tem ícone ou nome cadastrado aqui (sem isso, o site mostraria o slug cru) */
export function isKnownTech(slug: string) {
  return slug in SIMPLE || slug in CUSTOM_ICONS || slug in NAMES;
}

export function techName(slug: string) {
  return SIMPLE[slug]?.title ?? CUSTOM_ICONS[slug]?.title ?? NAMES[slug] ?? slug;
}

export function TechIcon({ slug, size = 18 }: { slug: string; size?: number }) {
  const name = techName(slug);
  const art: ReactNode = SIMPLE[slug] ? <path d={SIMPLE[slug].path} /> : CUSTOM_ICONS[slug]?.svg;
  if (!art) {
    return (
      <span className={s.techMono} style={{ width: size, height: size, fontSize: Math.round(size * 0.45) }} role="img" aria-label={name}>
        <span aria-hidden="true">{name.slice(0, 2)}</span>
      </span>
    );
  }
  return (
    <svg className={s.techIcon} width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={name}>
      {art}
    </svg>
  );
}
