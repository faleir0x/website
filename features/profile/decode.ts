/** Letras que passam pela tela enquanto o título se decodifica. */
const POOL = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ&01";

export type DecodeChar = { ch: string; done: boolean };

/**
 * Como o texto aparece no instante `t` (ms) de uma decodificação de `total` ms: cada letra se
 * resolve no seu momento, da esquerda para a direita; antes disso, mostra uma letra qualquer.
 * Espaços nunca embaralham. Em `t >= total` o texto está inteiro.
 */
export function decodeFrame(text: string, t: number, total: number, random: () => number = Math.random): DecodeChar[] {
  const chars = [...text];
  return chars.map((ch, i) => {
    if (ch === " ") return { ch, done: true };
    const at = total * (0.13 + (i / chars.length) * 0.75);
    return t >= at ? { ch, done: true } : { ch: POOL[Math.floor(random() * POOL.length)], done: false };
  });
}
