import s from "./icon.module.css";

/* Ícones de interface (14px, traço em currentColor). Ícones de marca ficam em tech-icon.tsx. */

type IconName = "arrow" | "copy" | "mail" | "doc" | "check";

export function Icon({ name, size }: { name: IconName; size?: number }) {
  const dim = size ? { width: size, height: size } : undefined;
  if (name === "mail")
    return (
      <svg className={s.ico} style={dim} viewBox="0 0 16 16" aria-hidden="true">
        <rect x="2" y="3.5" width="12" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M2.8 4.6 8 8.6l5.2-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (name === "doc")
    return (
      <svg className={s.ico} style={dim} viewBox="0 0 16 16" aria-hidden="true">
        <path d="M4 1.8h5.2L12.5 5v9.2H4z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M9 2v3.3h3.3M6.2 8.3h4M6.2 10.8h4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (name === "check")
    return (
      <svg className={s.ico} style={dim} viewBox="0 0 16 16" aria-hidden="true">
        <path d="m3.5 8.4 2.8 2.8 6.2-6.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (name === "arrow")
    return (
      <svg className={s.ico} style={dim} viewBox="0 0 16 16" aria-hidden="true">
        <path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  return (
    <svg className={s.ico} style={dim} viewBox="0 0 16 16" aria-hidden="true">
      <rect x="5" y="5" width="8" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 10.5V4a1 1 0 0 1 1-1h6.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** Meio disco: a metade cheia troca de lado com o tema. data-theme-icon: gira na revelação (app/globals.css). */
export function ThemeIcon({ dark }: { dark: boolean }) {
  return (
    <svg className={s.ico} data-theme-icon="" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d={dark ? "M8 1.8a6.2 6.2 0 0 0 0 12.4z" : "M8 1.8a6.2 6.2 0 0 1 0 12.4z"} fill="currentColor" />
    </svg>
  );
}
