"use client";

import { TechIcon } from "@/components/tech-icon";
import { T, useI18n } from "@/lib/i18n/i18n";
import { ui } from "@/content/ui";
import { Frame, Placeholder } from "@/features/sheet/frame";
import { NOTHING, type NowPlaying } from "./now-playing";
import { useNowPlaying } from "./use-now-playing";
import s from "./listening.module.css";

/** Em `pnpm dev` não há Pages Function: o quadro mostra este exemplo para dar para desenhar. */
const DEV_SAMPLE: NowPlaying = { state: "playing", track: "Nome da faixa", artist: "Artista" };

/*
 * Ouvindo (DESIGN.md §6): a capa preenche o quadro e um cartão de uma linha mostra “faixa · artista”
 * e o ícone do Spotify (atribuição). Tocando agora e última tocada são iguais na tela; a diferença
 * fica no nome acessível do quadro.
 */
export function ListeningFrame() {
  const { t } = useI18n();
  const np = useNowPlaying(process.env.NODE_ENV === "development" ? DEV_SAMPLE : NOTHING);

  const status = np.state === "none" ? t(ui.nothingPlaying) : np.state === "playing" ? "Spotify" : t(ui.lastPlayed);
  const label = np.state === "none" ? `${t(ui.listening)}: ${status}` : `${t(ui.listening)} (${status}): ${np.track}, ${np.artist}`;

  const cover = np.state !== "none" ? np.cover : undefined;
  return (
    <Frame
      href={np.state === "none" ? undefined : np.href}
      newTab={t(ui.newTab)}
      label={label}
      title={<T>{t(ui.listening)}</T>}
      section={t(ui.sectionNow)}
      mobile="auto"
    >
      {/* computador: a capa preenche o quadro e o cartão da faixa fica por cima */}
      {cover ? <img className={s.big} src={cover} alt="" loading="lazy" /> : <Placeholder className={s.big} label={t(ui.imgCover)} />}
      {np.state !== "none" && (
        <div className={s.np}>
          <b>
            {np.track} · {np.artist}
          </b>
          <TechIcon slug="spotify" size={14} />
        </div>
      )}
      {/* celular: uma linha com a capa pequena, a faixa e o artista legíveis */}
      <div className={s.row} aria-hidden="true">
        {cover ? <img className={s.thumb} src={cover} alt="" loading="lazy" /> : <span className={s.thumb} />}
        <span className={s.rowText}>
          <small>
            <T>{t(ui.listening)}</T>
          </small>
          {np.state === "none" ? (
            <b>
              <T>{t(ui.nothingPlaying)}</T>
            </b>
          ) : (
            <>
              <b>{np.track}</b>
              <span>{np.artist}</span>
            </>
          )}
        </span>
        {np.state !== "none" && <TechIcon slug="spotify" size={18} />}
      </div>
    </Frame>
  );
}
