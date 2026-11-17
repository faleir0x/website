import { siDocker, siGooglecloud, siGrafana, siJavascript, siN8n, siReact, siSpotify, type SimpleIcon } from "simple-icons";
import s from "./tech-icon.module.css";

/*
 * Ícones de tecnologia (DESIGN.md §6): Simple Icons (CC0), monocromáticos em currentColor.
 * Só as marcas usadas são importadas. Uma tecnologia que não existe no Simple Icons (ex.: Zabbix)
 * vira monograma do mesmo tamanho. Para adicionar uma, importe o `si…` e coloque no mapa.
 */
const ICONS: Record<string, SimpleIcon> = {
  javascript: siJavascript,
  react: siReact,
  n8n: siN8n,
  docker: siDocker,
  googlecloud: siGooglecloud,
  grafana: siGrafana,
  spotify: siSpotify, // atribuição no quadro Ouvindo
};

/** Tecnologias sem ícone no Simple Icons: viram monograma com este nome */
const NAMES: Record<string, string> = { zabbix: "Zabbix" };

/** O slug tem ícone ou nome cadastrado aqui (sem isso, o site mostraria o slug cru) */
export function isKnownTech(slug: string) {
  return slug in ICONS || slug in NAMES;
}

export function techName(slug: string) {
  return ICONS[slug]?.title ?? NAMES[slug] ?? slug;
}

export function TechIcon({ slug, size = 18 }: { slug: string; size?: number }) {
  const icon = ICONS[slug];
  const name = techName(slug);
  if (!icon) {
    return (
      <span className={s.techMono} style={{ width: size, height: size, fontSize: Math.round(size * 0.45) }} role="img" aria-label={name}>
        <span aria-hidden="true">{name.slice(0, 2)}</span>
      </span>
    );
  }
  return (
    <svg className={s.techIcon} width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={name}>
      <path d={icon.path} />
    </svg>
  );
}
