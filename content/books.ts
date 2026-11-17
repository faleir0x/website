import type { Book } from "@/features/reading/reading-frame";

/*
 * A estante (quadro Lendo). Para adicionar um livro:
 *   1. capa em assets/books/<id>.jpg, <id> na lista BOOKS de scripts/build-books.py → `pnpm covers`
 *      gera public/books/<id>.webp (480px de altura) e imprime a largura×altura da capa
 *   2. lombada desenhada em vetor em scripts/build-spines.mjs (imitando a edição) → `pnpm spines`
 *   3. adicione o livro aqui: medidas da capa do passo 1, medidas da lombada do viewBox do passo 2
 * Marque `current: true` no livro que está lendo agora (sem nenhum, vale o primeiro).
 */
export const books: Book[] = [
  {
    id: "first-love",
    title: "First Love",
    author: "Ivan Turguêniev",
    cover: { src: "/books/first-love.webp", width: 259, height: 400, alt: "Capa de First Love, de Ivan Turguêniev" },
    spine: { src: "/books/first-love-spine.svg", width: 20, height: 250 },
  },
  {
    id: "dungeon-crawler-carl",
    title: "Dungeon Crawler Carl",
    author: "Matt Dinniman",
    cover: { src: "/books/dungeon-crawler-carl.webp", width: 318, height: 480, alt: "Capa de Dungeon Crawler Carl, de Matt Dinniman" },
    spine: { src: "/books/dungeon-crawler-carl-spine.svg", width: 30, height: 262 },
  },
  {
    id: "shadow-of-the-gods",
    title: "The Shadow of the Gods",
    author: "John Gwynne",
    cover: { src: "/books/shadow-of-the-gods.webp", width: 254, height: 400, alt: "Capa de The Shadow of the Gods, de John Gwynne" },
    spine: { src: "/books/shadow-of-the-gods-spine.svg", width: 31, height: 256 },
  },
  {
    id: "the-stand",
    title: "The Stand",
    author: "Stephen King",
    cover: { src: "/books/the-stand.webp", width: 322, height: 480, alt: "Capa de The Stand, de Stephen King" },
    spine: { src: "/books/the-stand-spine.svg", width: 52, height: 270 },
  },
];
