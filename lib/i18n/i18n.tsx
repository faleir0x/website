"use client";

/*
 * Idioma do site (PT/EN): um módulo só para escolher, lembrar e trocar o idioma.
 *
 * Interface:
 *   <I18nProvider>  envolve a página (app/page.tsx)
 *   useI18n()       → { lang, t, setLang }; t(texto) devolve a versão no idioma atual
 *   <T>             marca um texto traduzido: é o que o letreiro anima na troca (DESIGN.md §4)
 *
 * Por dentro: guarda a escolha em localStorage, atualiza <html lang> e roda o letreiro
 * (lib/motion/switch.ts) entre sair o texto antigo e entrar o novo. O script inline do
 * app/layout.tsx aplica o idioma salvo antes da primeira pintura.
 */
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { createLetreiro } from "@/lib/motion/switch";

export type Lang = "pt" | "en";
/** Um texto nas duas línguas. Todo texto visível do site é Localized (ou um nome próprio). */
export type Localized = Record<Lang, string>;

type I18n = {
  lang: Lang;
  t: (text: Localized) => string;
  setLang: (lang: Lang) => void;
};

const I18nContext = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");
  const current = useRef<Lang>("pt");
  const letreiro = useRef<ReturnType<typeof createLetreiro> | null>(null);

  useEffect(() => {
    letreiro.current = createLetreiro();
    if (document.documentElement.lang === "en") {
      current.current = "en";
      setLangState("en");
    }
  }, []);

  // o DOM novo já existe: o texto novo entra em onda
  useLayoutEffect(() => {
    letreiro.current?.enter();
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    if (next === current.current) return;
    current.current = next;
    const commit = () => {
      setLangState(next);
      document.documentElement.lang = next === "en" ? "en" : "pt-BR";
      try {
        localStorage.setItem("lang", next);
      } catch {}
    };
    if (letreiro.current) void letreiro.current.leave(commit);
    else commit();
  }, []);

  const value = useMemo<I18n>(() => ({ lang, setLang, t: (text) => text[lang] }), [lang, setLang]);
  return <I18nContext value={value}>{children}</I18nContext>;
}

export function useI18n(): I18n {
  const ctx = use(I18nContext);
  if (!ctx) throw new Error("useI18n precisa de <I18nProvider> acima");
  return ctx;
}

/** Texto traduzido: entra no letreiro da troca de idioma ([data-i18n] em app/globals.css). */
export function T(props: ComponentProps<"span">) {
  return <span data-i18n="" {...props} />;
}
