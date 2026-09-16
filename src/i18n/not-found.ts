import type { Lang } from './ui';

/** One is picked at random per visit (src/scripts/kaomoji.js); the first is the no-JS fallback. */
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
  en: { description: 'Page not found.', message: 'This page is out of scope.' },
  pt: { description: 'Página não encontrada.', message: 'Essa página está fora do escopo.' },
} as const satisfies Record<Lang, Record<string, string>>;
