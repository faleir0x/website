"use client";

/*
 * Animações de troca (DESIGN.md §4 · Trocas de tema e idioma).
 * Tema: View Transition “revelação” (a página nova desce de cima). Idioma: “letreiro” via WAAPI.
 * Todas as durações e distâncias vêm dos tokens em app/globals.css.
 * Quem usa: lib/theme (revelação), lib/i18n (letreiro) e o papel alternado do perfil.
 */

export function token(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function tokenMs(name: string) {
  const v = token(name);
  return v.endsWith("ms") ? parseFloat(v) : parseFloat(v) * 1000;
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

let themeRun = 0;

/** Troca o tema com a revelação. Sem suporte a View Transitions, a troca é instantânea. */
export function revealTheme(apply: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> } };
  if (typeof doc.startViewTransition !== "function") {
    apply();
    return;
  }
  const root = document.documentElement;
  const cls = prefersReducedMotion() ? "vt-fade" : "vt-reveal";
  const run = ++themeRun;
  root.classList.remove("vt-fade", "vt-reveal");
  root.classList.add(cls);
  const t = doc.startViewTransition(apply);
  t.ready.catch(() => {}); // pulada (troca rápida ou aba oculta): a troca acontece mesmo assim
  t.finished.finally(() => {
    if (run === themeRun) root.classList.remove(cls);
  });
}

type Pending = { outs: Animation[]; reduced: boolean } | null;

/**
 * Letreiro: todo texto marcado com [data-i18n] sai para cima ao mesmo tempo,
 * o idioma troca, e o texto novo entra por baixo numa onda pela ordem de leitura.
 * `commit` faz a troca de estado; `enter` roda depois que o DOM novo existe.
 */
export function createLetreiro() {
  let running: Animation[] = [];
  let pending: Pending = null;

  const nodes = () => Array.from(document.querySelectorAll<HTMLElement>("[data-i18n]"));
  const cancelAll = () => {
    running.forEach((a) => a.cancel());
    running = [];
  };

  async function leave(commit: () => void) {
    cancelAll();
    pending?.outs.forEach((a) => a.cancel());
    const reduced = prefersReducedMotion();
    const easing = token("--ease-out");
    const shift = token("--lang-shift");
    const frames: Keyframe[] = reduced
      ? [{ opacity: 1 }, { opacity: 0 }]
      : [{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: `translateY(calc(${shift} * -1))` }];
    const duration = tokenMs(reduced ? "--dur-lang-out-reduced" : "--dur-lang-out");
    const outs = nodes().map((el) => el.animate(frames, { duration, easing, fill: "forwards" }));
    running = outs;
    pending = { outs, reduced };
    await Promise.allSettled(outs.map((a) => a.finished));
    if (pending?.outs !== outs) return; // outra troca começou no meio do caminho
    commit();
  }

  function enter() {
    if (!pending) return;
    const { outs, reduced } = pending;
    pending = null;
    const easing = token("--ease-out");
    const shift = token("--lang-shift");
    const duration = tokenMs(reduced ? "--dur-lang-in-reduced" : "--dur-lang-in");
    const waveMax = reduced ? 0 : tokenMs("--lang-wave-max");
    const frames: Keyframe[] = reduced
      ? [{ opacity: 0 }, { opacity: 1 }]
      : [{ opacity: 0, transform: `translateY(${shift})` }, { opacity: 1, transform: "translateY(0)" }];
    let acc = 0;
    running = nodes().map((el, i) => {
      const delay = Math.min(waveMax, acc);
      acc += Math.max(8, 34 - i * 3); // intervalos que encurtam: lê como onda, não como fila
      return el.animate(frames, { duration, delay, easing, fill: "backwards" });
    });
    outs.forEach((a) => a.cancel());
  }

  return { leave, enter };
}

/** Papel alternado: mesma gramática do letreiro (sobe e some, entra por baixo). */
export function roleLeave(el: HTMLElement) {
  const shift = token("--lang-shift");
  return el.animate(
    [{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: `translateY(calc(${shift} * -1))` }],
    { duration: tokenMs("--dur-lang-out"), easing: token("--ease-out"), fill: "forwards" },
  );
}

export function roleEnter(el: HTMLElement) {
  el.getAnimations().forEach((a) => a.cancel());
  const shift = token("--lang-shift");
  return el.animate(
    [{ opacity: 0, transform: `translateY(${shift})` }, { opacity: 1, transform: "translateY(0)" }],
    { duration: tokenMs("--dur-lang-in"), easing: token("--ease-out"), fill: "backwards" },
  );
}
