"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { T, useI18n } from "@/lib/i18n/i18n";
import { prefersReducedMotion, tokenMs } from "@/lib/motion/switch";
import { decodeFrame, type DecodeChar } from "./decode";
import { Contact } from "./contact";
import s from "./profile.module.css";

/*
 * Perfil (barra lateral, DESIGN.md §6): foto, nome, papel, bio e contato.
 * Devolve as peças soltas; quem posiciona a barra é a home (features/home).
 */
export function Profile() {
  const { t } = useI18n();
  return (
    <>
      <figure className={s.avatar}>
        <img src={profile.avatar} alt={profile.name} width={64} height={64} />
      </figure>
      <div>
        <h1 className={s.name}>{profile.name}</h1>
        <RoleTitle text={profile.title} />
      </div>
      <div className={s.bio}>
        {profile.bio.map((para, i) => (
          <p key={i}>
            <T>{t(para)}</T>
          </p>
        ))}
      </div>
      <Contact />
    </>
  );
}

/**
 * O papel embaixo do nome, que se decodifica uma vez ao abrir a página (DESIGN.md §6, opção A de
 * design-explorations/titulo-papel/). O mouse no nome decodifica de novo. Reduced motion: só o texto.
 * O leitor de tela lê o texto inteiro, nunca as letras embaralhadas.
 */
function RoleTitle({ text }: { text: string }) {
  const [frame, setFrame] = useState<DecodeChar[] | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const decode = useCallback(() => {
    if (timer.current !== undefined || prefersReducedMotion()) return; // uma de cada vez
    const total = tokenMs("--dur-decode");
    const start = performance.now();
    const tick = () => {
      const next = decodeFrame(text, performance.now() - start, total);
      if (next.every((c) => c.done)) {
        setFrame(null);
        timer.current = undefined;
        return;
      }
      setFrame(next);
      timer.current = setTimeout(tick, tokenMs("--decode-tick"));
    };
    tick();
  }, [text]);

  useEffect(() => {
    decode();
    return () => {
      clearTimeout(timer.current);
      timer.current = undefined;
    };
  }, [decode]);

  const replay = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) decode();
  };

  return (
    <p className={s.roles} onPointerEnter={replay}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {frame
          ? frame.map((c, i) => (
              <span key={i} className={c.done ? undefined : s.pending}>
                {c.ch}
              </span>
            ))
          : text}
      </span>
    </p>
  );
}
