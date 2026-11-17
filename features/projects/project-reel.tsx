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
 *   hover / foco  → toca do começo, uma vez, e o quadro cresce 1,6× por cima dos vizinhos enquanto o
 *                   cursor está nele (só com mouse de verdade; foco só pelo teclado)
 *   sai no meio   → o pôster volta num fade e o vídeo para no fim; se já acabou, nada muda
 *   toque         → toca uma vez quando o quadro entra na tela (60%), depois da onda de entrada, e o
 *                   quadro cresce só enquanto toca
 *   reduced motion→ só o pôster
 *   troca de tema → troca o arquivo e repousa no fim (nunca no frame 0)
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
    // data-playing: o filme foi mandado tocar e ainda não acabou (também liga o crescimento no toque)
    const playing = (on: boolean) => root.current?.toggleAttribute("data-playing", on);
    const isPlaying = () => !!root.current?.hasAttribute("data-playing");
    playing(false); // arquivo novo (ex.: troca de tema no meio do filme) sempre começa em repouso

    const rest = () => {
      clearTimeout(fade);
      playing(false);
      v.pause();
      if (Number.isFinite(v.duration)) v.currentTime = Math.max(0, v.duration - 0.05);
      cover.current?.removeAttribute("data-on");
    };
    const play = () => {
      if (prefersReducedMotion()) return;
      clearTimeout(fade);
      placeGrowth();
      cover.current?.removeAttribute("data-on");
      playing(true);
      v.currentTime = 0;
      v.play().catch(() => {});
    };
    const stop = () => {
      if (!isPlaying()) return; // já acabou (ou nem começou): fica como está
      if (v.paused) return rest(); // mandou tocar, mas o arquivo ainda carregava: volta direto ao repouso
      playing(false);
      // o pôster cobre o vídeo em fade e, por baixo, o vídeo já vai para o fim (que é igual ao pôster)
      cover.current?.setAttribute("data-on", "");
      fade = setTimeout(rest, tokenMs("--dur-hover"));
    };

    // arquivo novo (primeira carga ou troca de tema): repousa no fim, a não ser que o filme já tenha sido
    // mandado tocar antes de os metadados chegarem (no toque, o quadro costuma já estar na tela ao abrir)
    const onMeta = () => !isPlaying() && rest();
    v.addEventListener("loadedmetadata", onMeta);
    if (v.readyState >= 1) rest();
    const onEnded = () => playing(false);
    v.addEventListener("ended", onEnded);

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const onEnter = () => {
      placeGrowth(); // o crescimento do hover (CSS) usa a mesma origem
      if (fine.matches) play();
    };
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
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("ended", onEnded);
      frame.removeEventListener("pointerenter", onEnter);
      frame.removeEventListener("pointerleave", stop);
      frame.removeEventListener("focus", onFocus);
      frame.removeEventListener("blur", stop);
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
