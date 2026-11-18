import type { Localized } from "@/lib/i18n/i18n";

/* Quem você é: barra lateral e margem da folha. */
export const profile = {
  name: "Cauê Faleiros",
  /** Embaixo do nome; se decodifica uma vez ao abrir a página */
  title: "Software & AI Engineer",
  /** Onde você está, na margem da folha ao lado da hora local */
  place: { pt: "Brasil", en: "Brazil" } satisfies Localized,
  /** Fuso da hora local na margem da folha */
  timeZone: "America/Sao_Paulo",
  email: "contact@faleir0x.com",
  linkedin: "https://www.linkedin.com/in/cauefaleiros/",
  github: "https://github.com/faleir0x",
  /**
   * Currículo em PDF por idioma, em /public. O ícone só aparece quando os dois caminhos existirem.
   * Ex.: { pt: "/curriculo/cauefaleiros-pt.pdf", en: "/curriculo/cauefaleiros-en.pdf" }
   */
  resume: undefined as Localized | undefined,
  /** Foto em /public, quadrada (aparece com 64px) */
  avatar: "/profile/avatar.webp",
  // dois parágrafos: o que faz hoje; o que está construindo e, no fim, do que gosta. Cada item vira um <p>.
  bio: [
    {
      pt: "Desenvolvo aplicações web completas, da interface à API, com as integrações, o deploy e o monitoramento que as mantêm funcionando em produção.",
      en: "I build complete web applications, from the interface to the API, along with the integrations, deploys and monitoring that keep them running in production.",
    },
    {
      pt: "Hoje estou construindo agentes de IA com RAG e embeddings, e desenvolvendo formas de medir se eles respondem bem. Nas horas livres, leio fantasia, clássicos e mangá, quase sempre ouvindo música.",
      en: "Right now I'm building AI agents with RAG and embeddings, and developing ways to measure whether they answer well. In my free time I read fantasy, classics and manga, usually with music on.",
    },
  ] satisfies Localized[],
};
