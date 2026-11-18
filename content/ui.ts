import type { Localized } from "@/lib/i18n/i18n";

/* Textos da interface (rótulos, nomes acessíveis), nas duas línguas. */
export const ui = {
  localTime: { pt: "Hora local", en: "Local time" },
  copyEmail: { pt: "Copiar e-mail", en: "Copy e-mail" },
  copied: { pt: "copiado", en: "copied" },
  resume: { pt: "Currículo", en: "Résumé" },
  contact: { pt: "Contato", en: "Contact" },
  listening: { pt: "Ouvindo", en: "Listening" },
  lastPlayed: { pt: "última tocada", en: "last played" },
  nothingPlaying: { pt: "nada tocando", en: "nothing playing" },
  reading: { pt: "Lendo", en: "Reading" },
  openShelf: { pt: "Abrir a estante", en: "Open the bookshelf" },
  close: { pt: "Fechar", en: "Close" },
  by: { pt: "por", en: "by" },
  books: { pt: "livros", en: "books" },
  book: { pt: "livro", en: "book" },
  soon: { pt: "em breve", en: "soon" },
  nextProject: { pt: "Próximo projeto", en: "Next project" },
  experience: { pt: "Experiência", en: "Experience" },
  today: { pt: "hoje", en: "now" },
  tools: { pt: "Ferramentas", en: "Tools" },
  darkTheme: { pt: "Tema escuro", en: "Dark theme" },
  newTab: { pt: "(abre em nova aba)", en: "(opens in a new tab)" },
  language: { pt: "Idioma", en: "Language" },
  imgProject: { pt: "thumbnail animada", en: "animated thumbnail" },
  imgCover: { pt: "capa do álbum", en: "album cover" },
} satisfies Record<string, Localized>;
