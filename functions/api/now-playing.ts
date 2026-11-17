/*
 * GET /api/now-playing · Cloudflare Pages Function (adaptador)
 *
 * O que está tocando no Spotify agora; se nada estiver tocando, a última faixa ouvida.
 * A lógica (Spotify → NowPlaying) está em features/listening/spotify.ts; aqui ficam só o cache da
 * borda, os segredos e os cabeçalhos.
 *
 * Segredos: Cloudflare Pages → Settings → Variables and Secrets (local: .dev.vars)
 *   SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN
 * O refresh token sai uma vez só, com `pnpm spotify:token` (escopos de leitura apenas).
 *
 * Cache: até 30 s na borda, nunca além do fim da faixa (endsAt), então várias visitas ao mesmo tempo
 * viram uma chamada só ao Spotify e a página nunca recebe uma faixa que já acabou.
 */
import type { NowPlaying } from "../../features/listening/now-playing";
import { getNowPlaying, type SpotifyCredentials } from "../../features/listening/spotify";

type Ctx = { request: Request; env: SpotifyCredentials; waitUntil(promise: Promise<unknown>): void };

const CACHE_SECONDS = 30;

// o public/_headers não vale para respostas de Functions: os cabeçalhos de segurança vêm daqui
const SECURITY_HEADERS = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "cross-origin-resource-policy": "same-origin",
};

export const onRequestGet = async (ctx: Ctx): Promise<Response> => {
  const cache = (caches as unknown as { default: Cache }).default;
  const cacheKey = new Request(new URL("/api/now-playing", ctx.request.url).toString());
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  let payload: NowPlaying;
  let status = 200;
  try {
    payload = await getNowPlaying(ctx.env);
  } catch {
    // sem credenciais ou Spotify fora: o site mostra o estado desenhado “nada tocando”
    payload = { state: "none" };
    status = 503;
  }

  const endsAt = payload.state === "playing" ? payload.endsAt : undefined;
  const maxAge = endsAt ? Math.min(CACHE_SECONDS, Math.max(1, Math.ceil((endsAt - Date.now()) / 1000))) : CACHE_SECONDS;
  const res = new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": `public, max-age=${maxAge}`,
      ...SECURITY_HEADERS,
    },
  });
  if (status === 200) ctx.waitUntil(cache.put(cacheKey, res.clone()));
  return res;
};
