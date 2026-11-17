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
  {
    id: "warbreaker",
    title: "Warbreaker",
    author: "Brandon Sanderson",
    cover: { src: "/books/warbreaker.webp", width: 317, height: 480, alt: "Capa de Warbreaker, de Brandon Sanderson" },
    spine: { src: "/books/warbreaker-spine.svg", width: 42, height: 266 },
  },
  {
    id: "passions-of-the-soul",
    title: "The Passions of the Soul",
    author: "René Descartes",
    cover: { src: "/books/passions-of-the-soul.webp", width: 302, height: 480, alt: "Capa de The Passions of the Soul, de René Descartes" },
    spine: { src: "/books/passions-of-the-soul-spine.svg", width: 14, height: 238 },
  },
  {
    id: "giovannis-room",
    title: "Giovanni's Room",
    author: "James Baldwin",
    cover: { src: "/books/giovannis-room.webp", width: 323, height: 480, alt: "Capa de Giovanni's Room, de James Baldwin" },
    spine: { src: "/books/giovannis-room-spine.svg", width: 17, height: 250 },
  },
  {
    id: "notes-from-underground",
    title: "Notes from Underground",
    author: "Fyodor Dostoevsky",
    cover: { src: "/books/notes-from-underground.webp", width: 308, height: 480, alt: "Capa de Notes from Underground, de Fiódor Dostoiévski" },
    spine: { src: "/books/notes-from-underground-spine.svg", width: 15, height: 250 },
  },
  {
    id: "death-of-ivan-ilyich",
    title: "The Death of Ivan Ilyich",
    author: "Leo Tolstoy",
    cover: { src: "/books/death-of-ivan-ilyich.webp", width: 312, height: 480, alt: "Capa de The Death of Ivan Ilyich, de Liev Tolstói" },
    spine: { src: "/books/death-of-ivan-ilyich-spine.svg", width: 11, height: 244 },
  },
  {
    // mangás: o primeiro volume de cada série
    id: "skip-and-loafer-1",
    title: "Skip and Loafer, Vol. 1",
    author: "Misaki Takamatsu",
    cover: { src: "/books/skip-and-loafer-1.webp", width: 316, height: 450, alt: "Capa de Skip and Loafer, Vol. 1, de Misaki Takamatsu" },
    spine: { src: "/books/skip-and-loafer-1-spine.svg", width: 15, height: 214 },
  },
  {
    id: "blue-box-1",
    title: "Blue Box, Vol. 1",
    author: "Kouji Miura",
    cover: { src: "/books/blue-box-1.webp", width: 320, height: 480, alt: "Capa de Blue Box, Vol. 1, de Kouji Miura" },
    spine: { src: "/books/blue-box-1-spine.svg", width: 15, height: 214 },
  },
  {
    id: "your-lie-in-april-1",
    title: "Your Lie in April, Vol. 1",
    author: "Naoshi Arakawa",
    cover: { src: "/books/your-lie-in-april-1.webp", width: 311, height: 480, alt: "Capa de Your Lie in April, Vol. 1, de Naoshi Arakawa" },
    spine: { src: "/books/your-lie-in-april-1-spine.svg", width: 17, height: 216 },
  },
];
