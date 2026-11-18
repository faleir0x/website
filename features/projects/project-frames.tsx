"use client";

import { Icon } from "@/components/icon";
import { projects } from "@/content/projects";
import { ui } from "@/content/ui";
import { useI18n, type Localized } from "@/lib/i18n/i18n";
import { Frame, Placeholder } from "@/features/sheet/frame";
import { fillRows } from "./fill-rows";
import { ProjectReel, type Reel } from "./project-reel";
import s from "./project-frames.module.css";

/** Um projeto da folha. Veja content/projects.ts para adicionar. */
export type Project = {
  title: string;
  /** O que é, em poucas palavras (“agente de IA”): vai no nome acessível do quadro */
  kind: Localized;
  /** soon: o quadro aparece como “em breve”, sem link e sem imagem */
  status: "live" | "soon";
  /** Thumbnail em /public (ex.: "/projects/meu-projeto.webp"). Sem imagem, o quadro mostra o placeholder */
  image?: string;
  /** Filme curto que toca no hover, um por tema (ganha da imagem). Veja project-reel.tsx */
  reel?: Reel;
  /** Destino do clique. Sem href o quadro não é link (DESIGN.md §6) */
  href?: string;
};

/* As linhas de projetos da folha: um quadro por projeto, completando a última linha com “em breve”. */
export function ProjectFrames() {
  const { t } = useI18n();
  const slots = fillRows(projects);
  const soon = slots.filter((p) => !p || p.status === "soon").length;
  const frames = slots.map((p, i) => {
    // no celular, só o primeiro quadro leva o rótulo da seção
    const section = i === 0 ? t(ui.sectionProjects) : undefined;
    if (!p || p.status === "soon") {
      const title = p?.title ?? t(ui.nextProject);
      return (
        // no celular, os quadros vazios somem e viram a faixa abaixo
        <Frame key={`p${i}`} label={`${title}, ${t(ui.soon)}`} title={title} section={section} mobile="hidden">
          <Placeholder label={t(ui.soon)} />
        </Frame>
      );
    }
    return (
      <Frame key={`p${i}`} href={p.href} newTab={t(ui.newTab)} label={`${p.title}, ${t(p.kind)}`} title={p.title} section={section}>
        {p.reel ? (
          <ProjectReel reel={p.reel} />
        ) : p.image ? (
          <img src={p.image} alt="" loading="lazy" />
        ) : (
          <Placeholder label={t(ui.imgProject)} />
        )}
        {/* o quadro inteiro é o link; a seta só avisa que leva para fora (o nome acessível já diz “nova aba”) */}
        {p.href && (
          <span className={s.link} aria-hidden="true">
            <Icon name="arrow" />
          </span>
        )}
      </Frame>
    );
  });
  // só no celular: uma faixa fina no lugar dos quadros “em breve”
  if (soon > 0) {
    frames.push(
      <li key="soon" className={s.soonStrip}>
        {soon} {t(soon === 1 ? ui.soonOne : ui.soonMany)}
      </li>,
    );
  }
  return frames;
}
