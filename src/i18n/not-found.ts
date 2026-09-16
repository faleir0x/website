import type { Lang } from './ui';

/** One is picked at random per visit (src/scripts/not-found.js); the first is the no-JS fallback. */
export const kaomoji = [
  "(｡ᵕ ◞ _◟)",
  "｡°(°¯᷄◠¯᷅°)°｡",
  "(⇀‸↼‶)",
  "૮◞ ‸ ◟ ა",
  "( ꩜ ᯅ ꩜;) ∘ ∘ ∘",
  "( °ヮ° ) ?",
  "(╥ ᴗ ╥)",
  "(˶˃⤙˂˶)",
  ".·°՞(っ-ᯅ-ς)՞°·.",
  "(,,•᷄ࡇ•᷅ ,,)?",
  "( ˶°ㅁ°) !!",
];

export const notFoundCopy = {
  en: { description: 'Page not found.', message: 'This page is out of scope.', back: '← Go back' },
  pt: { description: 'Página não encontrada.', message: 'Essa página está fora do escopo.', back: '← Voltar' },
} as const satisfies Record<Lang, Record<string, string>>;
