/**
 * A folha nunca tem buraco (DESIGN.md §7): completa a lista até fechar a última linha de `cols`.
 * Cada vaga extra vira null, que a página desenha como “Próximo projeto · em breve”.
 */
export function fillRows<T>(items: readonly T[], cols = 3): (T | null)[] {
  const missing = (cols - (items.length % cols)) % cols;
  return [...items, ...Array.from({ length: missing }, () => null)];
}
