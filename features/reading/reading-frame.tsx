"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { books } from "@/content/books";
import { ui } from "@/content/ui";
import { T, useI18n } from "@/lib/i18n/i18n";
import { Frame } from "@/features/sheet/frame";
import { Bookshelf, type BookshelfBook } from "./bookshelf/bookshelf";
import s from "./reading.module.css";

/** Um livro da estante. Capas e lombadas: veja content/books.ts. */
export type Book = BookshelfBook & {
  /** O livro sendo lido agora: sobe um pouco no hover do quadro (sem nenhum marcado, vale o primeiro) */
  current?: boolean;
};

/*
 * Lendo (DESIGN.md §6): no quadro, as lombadas reais em miniatura; o quadro inteiro é um botão que
 * abre a estante completa (@akoder/bookshelf, vendorizada em ./bookshelf) num <dialog> nativo, que
 * já cuida de foco, Escape e de devolver o foco ao quadro quando fecha.
 */
export function ReadingFrame() {
  const { t } = useI18n();
  const dialog = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = Math.max(0, books.findIndex((b) => b.current));
  const tallest = Math.max(...books.map((b) => b.spine.height), 1);
  const list = books.map((b) => `${b.title}, ${t(ui.by)} ${b.author}`).join("; ");
  const close = () => dialog.current?.close();

  return (
    <Frame
      label={`${t(ui.reading)}: ${books.length} ${t(books.length === 1 ? ui.book : ui.books)}`}
      title={<T>{t(ui.reading)}</T>}
      action={{ label: `${t(ui.openShelf)}: ${list}`, popup: "dialog", onClick: () => dialog.current?.showModal() }}
    >
      <ul className={s.shelf} aria-hidden="true">
        {books.map((b, i) => (
          <li
            key={b.id}
            className={i === current ? `${s.spine} ${s.spineCurrent}` : s.spine}
            style={{ height: `${(b.spine.height / tallest) * 100}%`, aspectRatio: `${b.spine.width} / ${b.spine.height}` } as CSSProperties}
          >
            <img src={b.spine.src} alt="" width={b.spine.width} height={b.spine.height} />
          </li>
        ))}
      </ul>
      {mounted &&
        createPortal(
          <dialog
            ref={dialog}
            className={s.dialog}
            aria-label={t(ui.reading)}
            // clique no fundo (fora da caixa) fecha
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <button type="button" className={s.dialogClose} onClick={close} aria-label={t(ui.close)}>
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <Bookshelf books={books} label={t(ui.reading)} byLabel={t(ui.by)} className={s.bookshelf} />
          </dialog>,
          document.body,
        )}
    </Frame>
  );
}
