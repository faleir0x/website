"use client";

import { useEffect, useState } from "react";
import { NOTHING, nextFetchDelay, parseNowPlaying, type NowPlaying } from "./now-playing";

/**
 * O que está tocando, sempre atualizado. Busca /api/now-playing ao abrir e de novo no ritmo de
 * nextFetchDelay (now-playing.ts). Aba escondida não busca: ao voltar, busca se já passou da hora.
 *
 * `fallback` aparece até a primeira resposta e quando a função não existe (em `pnpm dev` não há
 * Pages Function). Falha de rede mantém o que já está na tela.
 */
export function useNowPlaying(fallback: NowPlaying = NOTHING): NowPlaying {
  const [np, setNp] = useState<NowPlaying>(fallback);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let nextAt = 0;

    const schedule = (endsAt?: number) => {
      const delay = nextFetchDelay(endsAt, Date.now());
      nextAt = Date.now() + delay;
      clearTimeout(timer);
      timer = setTimeout(load, delay);
    };

    const load = async () => {
      if (document.hidden) return; // retoma no visibilitychange
      nextAt = Infinity; // uma busca por vez
      let endsAt: number | undefined;
      try {
        const res = await fetch("/api/now-playing", { headers: { accept: "application/json" } });
        // 503 = a função respondeu “nada tocando” porque o Spotify falhou: mostra isso
        if (res.ok || res.status === 503) {
          const data = parseNowPlaying(await res.json());
          if (alive) setNp(data);
          if (data.state === "playing") endsAt = data.endsAt;
        }
      } catch {
        /* sem rede ou sem função: mantém o que já está na tela */
      }
      if (alive) schedule(endsAt);
    };

    const onVisible = () => {
      if (!document.hidden && Date.now() >= nextAt) void load();
    };

    void load();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      alive = false;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return np;
}
