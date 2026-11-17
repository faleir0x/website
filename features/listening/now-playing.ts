/*
 * Contrato do Ouvindo: o que a Pages Function (functions/api/now-playing.ts) responde e o que a
 * página lê. Os dois lados importam daqui, então mudar um campo quebra o build dos dois.
 * Sem React e sem DOM: roda no navegador e no Worker.
 */

export type NowPlaying =
  | {
      state: "playing" | "recent";
      track: string;
      artist: string;
      cover?: string;
      /** Link da faixa no Spotify */
      href?: string;
      /** Só tocando agora: quando a faixa acaba (ms desde 1970), para buscar a próxima na hora */
      endsAt?: number;
    }
  | { state: "none" };

export const NOTHING: NowPlaying = { state: "none" };

/** Lê a resposta da função sem confiar nela: qualquer coisa fora do formato vira “nada tocando”. */
export function parseNowPlaying(data: unknown): NowPlaying {
  if (!data || typeof data !== "object") return NOTHING;
  const d = data as Record<string, unknown>;
  if ((d.state !== "playing" && d.state !== "recent") || typeof d.track !== "string" || typeof d.artist !== "string") {
    return NOTHING;
  }
  const str = (v: unknown) => (typeof v === "string" ? v : undefined);
  return {
    state: d.state,
    track: d.track,
    artist: d.artist,
    cover: str(d.cover),
    href: str(d.href),
    endsAt: typeof d.endsAt === "number" ? d.endsAt : undefined,
  };
}

/**
 * Quanto esperar até a próxima busca (DESIGN.md §8 R5):
 *   - a cada minuto, para pegar faixa pulada ou pausa;
 *   - se a faixa acaba em até 75 s, espera direto o fim + 2 s (não cai uma busca logo antes dele);
 *   - nunca menos de 15 s entre buscas.
 */
export function nextFetchDelay(endsAt: number | undefined, now: number): number {
  const toEnd = endsAt ? endsAt - now + 2_000 : Infinity;
  if (toEnd < 15_000) return 15_000;
  if (toEnd <= 75_000) return toEnd;
  return 60_000;
}
