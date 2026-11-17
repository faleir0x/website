/*
 * Spotify → NowPlaying. Roda só na Pages Function (functions/api/now-playing.ts), nunca no navegador:
 * usa o client secret e o refresh token.
 *
 * Interface: getNowPlaying(credenciais, fetch?) → NowPlaying
 *   - tocando agora: a faixa atual, com endsAt;
 *   - nada tocando: a última faixa ouvida (state "recent");
 *   - sem histórico: { state: "none" };
 *   - credencial inválida ou Spotify fora: lança erro (quem chama decide o que mostrar).
 * O fetch entra como parâmetro para os testes trocarem o Spotify por respostas prontas.
 */
import type { NowPlaying } from "./now-playing";

export type SpotifyCredentials = {
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_CLIENT_SECRET: string;
  SPOTIFY_REFRESH_TOKEN: string;
};

type Fetch = typeof fetch;

type SpotifyTrack = {
  name: string;
  artists: { name: string }[];
  album: { images: { url: string; width: number }[] };
  external_urls: { spotify: string };
  duration_ms: number;
};

export async function getNowPlaying(creds: SpotifyCredentials, fetchImpl: Fetch = fetch, now = Date.now()): Promise<NowPlaying> {
  const token = await accessToken(creds, fetchImpl);
  const auth = { authorization: `Bearer ${token}` };

  const current = await fetchImpl("https://api.spotify.com/v1/me/player/currently-playing", { headers: auth });
  if (current.status === 200) {
    const data = (await current.json()) as {
      is_playing: boolean;
      progress_ms: number | null;
      currently_playing_type: string;
      item: SpotifyTrack | null;
    };
    if (data.is_playing && data.currently_playing_type === "track" && data.item) {
      return shape(data.item, "playing", now, data.progress_ms ?? undefined);
    }
  } else if (current.status !== 204) {
    throw new Error(`currently-playing ${current.status}`);
  }

  const recent = await fetchImpl("https://api.spotify.com/v1/me/player/recently-played?limit=1", { headers: auth });
  if (!recent.ok) throw new Error(`recently-played ${recent.status}`);
  const data = (await recent.json()) as { items: { track: SpotifyTrack }[] };
  const last = data.items[0]?.track;
  return last ? shape(last, "recent", now) : { state: "none" };
}

async function accessToken(creds: SpotifyCredentials, fetchImpl: Fetch): Promise<string> {
  const res = await fetchImpl("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      authorization: `Basic ${btoa(`${creds.SPOTIFY_CLIENT_ID}:${creds.SPOTIFY_CLIENT_SECRET}`)}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: creds.SPOTIFY_REFRESH_TOKEN }),
  });
  if (!res.ok) throw new Error(`token ${res.status}`);
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

function shape(track: SpotifyTrack, state: "playing" | "recent", now: number, progressMs?: number): NowPlaying {
  // a menor capa com pelo menos 300px: o quadro tem no máximo ~290px de largura
  const images = [...track.album.images].sort((a, b) => a.width - b.width);
  const cover = (images.find((i) => i.width >= 300) ?? images[images.length - 1])?.url;
  return {
    state,
    track: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    cover,
    href: track.external_urls.spotify,
    endsAt: progressMs !== undefined ? now + Math.max(0, track.duration_ms - progressMs) : undefined,
  };
}
