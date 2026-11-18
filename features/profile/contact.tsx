"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Icon } from "@/components/icon";
import { TechIcon } from "@/components/tech-icon";
import { profile } from "@/content/profile";
import { ui } from "@/content/ui";
import { useI18n } from "@/lib/i18n/i18n";
import s from "./profile.module.css";

/*
 * Contato no pé da barra (DESIGN.md §6): só ícones, cada um com o nome num balão no hover e no foco.
 *   e-mail    → copia o endereço (o ícone vira um check); se o navegador recusar, mostra o endereço
 *   LinkedIn, GitHub → abrem em nova aba
 *   currículo → o PDF no idioma da página; só aparece quando content/profile.ts tiver os dois caminhos
 */
export function Contact() {
  const { t, lang } = useI18n();
  const newTab = t(ui.newTab);
  return (
    <div className={s.actions} role="group" aria-label={t(ui.contact)}>
      <CopyEmail email={profile.email} label={t(ui.copyEmail)} done={t(ui.copied)} />
      <IconLink href={profile.linkedin} name="LinkedIn" newTab={newTab}>
        <TechIcon slug="linkedin" size={16} />
      </IconLink>
      <IconLink href={profile.github} name="GitHub" newTab={newTab}>
        <TechIcon slug="github" size={16} />
      </IconLink>
      {profile.resume && (
        <IconLink href={profile.resume[lang]} name={t(ui.resume)} newTab={newTab}>
          <Icon name="doc" size={16} />
        </IconLink>
      )}
    </div>
  );
}

function IconLink({ href, name, newTab, children }: { href: string; name: string; newTab: string; children: ReactNode }) {
  return (
    <a className={s.iconBtn} href={href} target="_blank" rel="noreferrer" aria-label={`${name} ${newTab}`}>
      <span aria-hidden="true" className={s.iconArt}>
        {children}
      </span>
      <span className={s.tip} aria-hidden="true">
        {name}
      </span>
    </a>
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
  const copied = state === "copied";
  return (
    <>
      <button type="button" className={s.iconBtn} onClick={copy} aria-label={`${label}: ${email}`}>
        <span aria-hidden="true" className={s.iconArt}>
          <Icon name={copied ? "check" : "mail"} size={16} />
        </span>
        <span className={s.tip} aria-hidden="true" data-on={copied || undefined}>
          {copied ? done : label}
        </span>
      </button>
      {state === "failed" && <span className={s.emailFallback}>{email}</span>}
      <span role="status" className="sr-only">{copied ? `${done}: ${email}` : ""}</span>
    </>
  );
}
