"use client";

/*
 * Tema claro/escuro. Interface: useTheme() → [escuro?, alternar].
 * Por dentro: lê data-theme (ou a preferência do sistema), salva a escolha em localStorage e troca
 * com a revelação (View Transition, lib/motion/switch.ts). O script inline do app/layout.tsx
 * aplica o tema salvo antes da primeira pintura.
 */
import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { revealTheme } from "@/lib/motion/switch";

function isDarkNow() {
  const current = document.documentElement.getAttribute("data-theme");
  return current ? current === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function useTheme(): [dark: boolean, toggle: () => void] {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(isDarkNow()), []);
  const toggle = useCallback(() => {
    const next = isDarkNow() ? "light" : "dark";
    revealTheme(() => {
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch {}
      // a View Transition fotografa o DOM no fim deste callback: o ícone já precisa estar trocado
      flushSync(() => setDark(next === "dark"));
    });
  }, []);
  return [dark, toggle];
}

/**
 * Só leitura: o tema que está valendo agora, para quem precisa trocar mídia junto (ex.: o reel de um
 * projeto). Acompanha a troca pelo botão (data-theme) e a do sistema. null até montar: no HTML
 * estático o tema ainda não é conhecido.
 */
export function useIsDark(): boolean | null {
  const [dark, setDark] = useState<boolean | null>(null);
  useEffect(() => {
    const sync = () => setDark(isDarkNow());
    sync();
    const attr = new MutationObserver(sync);
    attr.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const system = window.matchMedia("(prefers-color-scheme: dark)");
    system.addEventListener("change", sync);
    return () => {
      attr.disconnect();
      system.removeEventListener("change", sync);
    };
  }, []);
  return dark;
}
