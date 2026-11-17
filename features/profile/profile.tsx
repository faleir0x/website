"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { profile } from "@/content/profile";
import { ui } from "@/content/ui";
import { T, useI18n } from "@/lib/i18n/i18n";
import { prefersReducedMotion, roleEnter, roleLeave, tokenMs } from "@/lib/motion/switch";
import s from "./profile.module.css";

/*
 * Perfil (barra lateral, DESIGN.md §6): foto, nome, papel alternado, bio e contato.
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
        <RoleRotator roles={profile.roles} joiner={t(ui.and)} />
      </div>
      <div className={s.bio}>
        {profile.bio.map((para, i) => (
          <p key={i}>
            <T>{t(para)}</T>
          </p>
        ))}
      </div>
      <div className={s.actions}>
        <CopyEmail email={profile.email} label={t(ui.copyEmail)} done={t(ui.copied)} />
        <a className={s.chip} href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn <Icon name="arrow" />
          <span className="sr-only">{t(ui.newTab)}</span>
        </a>
      </div>
    </>
  );
}

/**
 * Um papel por vez, alternando como o letreiro (DESIGN.md §6). Leitor de tela ouve os dois juntos.
 * Pausa com hover ou foco, para quando a aba some e não alterna sob reduced motion.
 */
function RoleRotator({ roles, joiner }: { roles: string[]; joiner: string }) {
  const [i, setI] = useState(0);
  const [still, setStill] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const paused = useRef(false);
  const entering = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion() || roles.length < 2) {
      setStill(true);
      return;
    }
    const id = setInterval(() => {
      const el = ref.current;
      if (!el || paused.current || document.hidden) return;
      if (el.getAnimations().some((a) => a.playState === "running")) return; // troca anterior ainda em curso
      roleLeave(el)
        .finished.then(() => {
          entering.current = true;
          setI((n) => (n + 1) % roles.length);
        })
        .catch(() => {});
    }, tokenMs("--role-interval"));
    return () => clearInterval(id);
  }, [roles.length]);

  useLayoutEffect(() => {
    if (!entering.current || !ref.current) return;
    entering.current = false;
    roleEnter(ref.current);
  }, [i]);

  const pause = () => {
    paused.current = true;
  };
  const resume = () => {
    paused.current = false;
  };

  return (
    <p className={s.roles} onMouseEnter={pause} onMouseLeave={resume} onFocus={pause} onBlur={resume}>
      <span className="sr-only">{roles.join(` ${joiner} `)}</span>
      <span ref={ref} className={s.role} aria-hidden="true">
        {still ? roles.join(" · ") : roles[i]}
      </span>
    </p>
  );
}

/** Copia o e-mail; se o navegador recusar, mostra o endereço para copiar à mão. */
function CopyEmail({ email, label, done }: { email: string; label: string; done: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
  };
  useEffect(() => {
    if (state !== "copied") return;
    const id = setTimeout(() => setState("idle"), 1400);
    return () => clearTimeout(id);
  }, [state]);
  return (
    <>
      <button type="button" className={`${s.chip} ${s.chipSolid}`} onClick={copy}>
        {/* os dois rótulos ocupam a mesma célula: o botão fica com a largura do maior e não pula ao copiar */}
        <span className={s.swapLabel}>
          <T data-off={state === "copied" || undefined}>{label}</T>
          <T data-off={state !== "copied" || undefined}>{done}</T>
        </span>
        <Icon name="copy" />
      </button>
      {state === "failed" && <span className={s.emailFallback}>{email}</span>}
      <span role="status" className="sr-only">{state === "copied" ? `${done}: ${email}` : ""}</span>
    </>
  );
}
