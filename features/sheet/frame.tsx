import type { ReactNode } from "react";
import s from "./frame.module.css";

/*
 * A folha e seus quadros (DESIGN.md §5–7). Todo conteúdo da home mora num Frame dentro da Sheet;
 * o Frame cuida do que é igual em todos: proporção 4:3 (ou 4:1 na linha inteira), hover/foco que
 * levanta o quadro e escurece os vizinhos, entrada em onda, e o que acontece no clique.
 *
 * O clique tem três formas, e só uma por quadro:
 *   href    → o quadro é um link (externo abre em nova aba)
 *   action  → o quadro inteiro é um botão (ex.: Lendo abre a estante)
 *   nenhum  → o quadro é só um grupo com rótulo
 *
 * O quadro recorta o conteúdo nas bordas arredondadas. Um filho direto com data-overflow="visible"
 * desliga o recorte (ex.: Ferramentas, cujo nome no hover sai do quadro).
 */

export function Sheet({ children }: { children: ReactNode }) {
  return <ul className={s.sheet}>{children}</ul>;
}

type FrameProps = {
  /** Nome acessível do quadro inteiro (o que o leitor de tela anuncia) */
  label: string;
  /** Título só para leitor de tela: vira um h2 para navegar por títulos. Sem legenda visível (DESIGN.md §6) */
  title: ReactNode;
  href?: string;
  /** Sufixo do rótulo em links externos, ex.: “(abre em nova aba)” */
  newTab?: string;
  action?: { label: string; onClick: () => void; popup?: "dialog" };
  /** cell: um quadro 4:3. row: a linha inteira da folha, 4:1 (Experiência) */
  size?: "cell" | "row";
  children: ReactNode;
};

export function Frame({ label, title, href, newTab = "", action, size = "cell", children }: FrameProps) {
  const body = (
    <>
      <div className={s.img}>
        <div className={s.clip}>{children}</div>
        {action && (
          <button
            type="button"
            className={s.frameButton}
            aria-haspopup={action.popup}
            aria-label={action.label}
            onClick={action.onClick}
          />
        )}
      </div>
      <h2 className="sr-only">{title}</h2>
    </>
  );
  const cls = size === "row" ? `${s.frame} ${s.row}` : s.frame;
  const external = !!href && /^https?:\/\//.test(href);
  return (
    <li className={s.item}>
      {href ? (
        <a
          className={cls}
          href={href}
          aria-label={external ? `${label} ${newTab}` : label}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {body}
        </a>
      ) : (
        <div className={cls} aria-label={label} role="group">
          {body}
        </div>
      )}
    </li>
  );
}

/** Quadro sem imagem ainda: grão na cor de placeholder, com uma legenda opcional no canto. */
export function Placeholder({ label }: { label?: string }) {
  return <span className={label ? `${s.ph} ${s.phLabel}` : s.ph} data-label={label} aria-hidden="true" />;
}
