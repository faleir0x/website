"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion, tokenMs } from "@/lib/motion/switch";
import { useIsDark } from "@/lib/theme/theme";
import s from "./project-reel.module.css";

/** Um filme curto do projeto, um arquivo por tema. O pôster é o último frame. */
export type Reel = Record<"light" | "dark", { src: string; poster: string }>;

/*
 * Reel do projeto (DESIGN.md §6 · Projetos; escolhido em design-explorations/ecopulse-reel.html, variante B).
 *   repouso       → o último frame (o pôster)
 *   hover / foco  → toca do começo, uma vez (só com mouse de verdade; foco só pelo teclado)
 *   sai no meio   → o pôster volta num fade e o vídeo para no fim; se já acabou, nada muda
 *   toque         → toca uma vez quando o quadro entra na tela (60%), depois da onda de entrada
 *   reduced motion→ só o pôster
 *   troca de tema → troca o arquivo e repousa no fim (nunca no frame 0)
 * O vídeo é decorativo (aria-hidden): o nome do quadro vem do Frame, que é o link do projeto.
 */
export function ProjectReel({ reel }: { reel: Reel }) {
  const dark = useIsDark();
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

    const rest = () => {
      clearTimeout(fade);
      v.pause();
      if (Number.isFinite(v.duration)) v.currentTime = Math.max(0, v.duration - 0.05);
      cover.current?.removeAttribute("data-on");
    };
    const play = () => {
      if (prefersReducedMotion()) return;
      clearTimeout(fade);
      cover.current?.removeAttribute("data-on");
      v.currentTime = 0;
      v.play().catch(() => {});
    };
    const stop = () => {
      if (v.paused || v.ended) return;
      // o pôster cobre o vídeo em fade e, por baixo, o vídeo já vai para o fim (que é igual ao pôster)
      cover.current?.setAttribute("data-on", "");
      fade = setTimeout(rest, tokenMs("--dur-hover"));
    };

    // arquivo novo (primeira carga ou troca de tema): repousa no fim
    v.addEventListener("loadedmetadata", rest);
    if (v.readyState >= 1) rest();

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const onEnter = () => fine.matches && play();
    const onFocus = () => frame.matches(":focus-visible") && play();
    frame.addEventListener("pointerenter", onEnter);
    frame.addEventListener("pointerleave", stop);
    frame.addEventListener("focus", onFocus);
    frame.addEventListener("blur", stop);

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
      v.removeEventListener("loadedmetadata", rest);
      frame.removeEventListener("pointerenter", onEnter);
      frame.removeEventListener("pointerleave", stop);
      frame.removeEventListener("focus", onFocus);
      frame.removeEventListener("blur", stop);
    };
  }, [media?.src]);

  return (
    <div className={s.reel} aria-hidden="true">
      {media && (
        <>
          <video ref={video} className={s.video} src={media.src} poster={media.poster} muted playsInline preload="metadata" />
          <img ref={cover} className={s.cover} src={media.poster} alt="" />
        </>
      )}
    </div>
  );
}
