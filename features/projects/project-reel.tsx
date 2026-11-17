"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion, tokenMs } from "@/lib/motion/switch";
import { useIsDark } from "@/lib/theme/theme";
import s from "./project-reel.module.css";

/**
 * Um filme curto do projeto, um par por tema: `src` é o vídeo e `poster` é a capa de repouso, uma
 * imagem própria feita para ser lida no tamanho do quadro (não é o último frame do vídeo).
 */
export type Reel = Record<"light" | "dark", { src: string; poster: string }>;

/*
 * Reel do projeto (DESIGN.md §6 · Projetos).
 *   repouso       → a capa, por cima do vídeo (que fica parado no começo)
 *   hover / foco  → a capa some (fade) e o vídeo toca do começo, uma vez; o quadro cresce 1,6× por cima
 *                   dos vizinhos enquanto o cursor está nele (só com mouse de verdade; foco só pelo teclado)
 *   fim do vídeo  → a capa volta em fade e o vídeo volta ao começo, por baixo
 *   sai no meio   → igual ao fim: a capa volta em fade
 *   toque         → toca uma vez quando o quadro entra na tela (60%), depois da onda de entrada, e o
 *                   quadro cresce só enquanto toca
 *   reduced motion→ só a capa, nunca toca
 *   troca de tema → troca os arquivos e volta ao repouso
 * O vídeo é decorativo (aria-hidden): o nome do quadro vem do Frame, que é o link do projeto.
 */
export function ProjectReel({ reel }: { reel: Reel }) {
  const dark = useIsDark();
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const cover = useRef<HTMLImageElement>(null);
  const media = dark === null ? null : reel[dark ? "dark" : "light"];

  useEffect(() => {
    const v = video.current;
    const frame = v?.closest<HTMLElement>("a, [role='group']");
    if (!v || !frame) return;
    v.muted = true; // o atributo muted do React não chega ao DOM; sem isso o navegador recusa o play()

    let fade: ReturnType<typeof setTimeout> | undefined;
    let touchDelay: ReturnType<typeof setTimeout> | undefined;

    // cresce para dentro da folha: quem está na coluna da direita cresce para a esquerda, e assim por diante
    const placeGrowth = () => {
      const sheet = frame.closest("ul")?.getBoundingClientRect();
      if (!sheet) return;
      const r = frame.getBoundingClientRect();
      const x = (r.left + r.width / 2 - sheet.left) / sheet.width;
      const y = (r.top + r.height / 2 - sheet.top) / sheet.height;
      frame.style.setProperty("--grow-origin", `${x < 0.34 ? "left" : x > 0.66 ? "right" : "center"} ${y > 0.5 ? "bottom" : "top"}`);
    };
    // data-playing: o filme foi mandado tocar e ainda não voltou à capa (também liga o crescimento no toque)
    const playing = (on: boolean) => root.current?.toggleAttribute("data-playing", on);
    const isPlaying = () => !!root.current?.hasAttribute("data-playing");
    // a capa fica visível por padrão; data-hidden a esconde em fade (só opacity)
    const showCover = (on: boolean) => cover.current?.toggleAttribute("data-hidden", !on);

    /** Repouso imediato: capa por cima, vídeo parado no começo. */
    const rest = () => {
      clearTimeout(fade);
      playing(false);
      showCover(true);
      v.pause();
      v.currentTime = 0;
    };
    rest(); // arquivo novo (primeira carga ou troca de tema no meio do filme) sempre começa em repouso

    const play = () => {
      if (prefersReducedMotion()) return;
      clearTimeout(fade);
      placeGrowth();
      playing(true);
      v.currentTime = 0;
      v.play().catch(() => {});
    };
    // a capa só some quando o vídeo de fato começa: sem isso, um arquivo ainda carregando mostraria o vazio
    const onPlaying = () => isPlaying() && showCover(false);

    /** Volta à capa em fade; depois do fade, o vídeo para e volta ao começo, por baixo dela. */
    const back = () => {
      if (!isPlaying()) return; // já está na capa
      playing(false);
      showCover(true);
      clearTimeout(fade);
      fade = setTimeout(() => {
        v.pause();
        v.currentTime = 0;
      }, tokenMs("--dur-hover"));
    };

    v.addEventListener("playing", onPlaying);
    v.addEventListener("ended", back);

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const onEnter = () => {
      placeGrowth(); // o crescimento do hover (CSS) usa a mesma origem
      if (fine.matches) play();
    };
    const onFocus = () => frame.matches(":focus-visible") && play();
    frame.addEventListener("pointerenter", onEnter);
    frame.addEventListener("pointerleave", back);
    frame.addEventListener("focus", onFocus);
    frame.addEventListener("blur", back);

    // toque: sem hover, toca uma vez ao entrar na tela, depois da onda de entrada
    let seen: IntersectionObserver | undefined;
    if (!fine.matches && !prefersReducedMotion()) {
      seen = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          seen?.disconnect();
          touchDelay = setTimeout(play, tokenMs("--delay-reel"));
        },
        { threshold: 0.6 },
      );
      seen.observe(frame);
    }

    return () => {
      clearTimeout(fade);
      clearTimeout(touchDelay);
      seen?.disconnect();
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("ended", back);
      frame.removeEventListener("pointerenter", onEnter);
      frame.removeEventListener("pointerleave", back);
      frame.removeEventListener("focus", onFocus);
      frame.removeEventListener("blur", back);
    };
  }, [media?.src]);

  return (
    <div ref={root} className={s.reel} aria-hidden="true" data-grow="">
      {media && (
        <>
          <video ref={video} className={s.video} src={media.src} poster={media.poster} muted playsInline preload="metadata" />
          <img ref={cover} className={s.cover} src={media.poster} alt="" />
        </>
      )}
    </div>
  );
}
