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
