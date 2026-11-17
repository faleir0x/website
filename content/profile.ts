import type { Localized } from "@/lib/i18n/i18n";

/* Quem você é: barra lateral e margem da folha. */
export const profile = {
  name: "Cauê Faleiros",
  /** Alternam um por vez embaixo do nome */
  roles: ["Software Engineer", "AI Engineer"],
  city: "Ribeirão Preto",
  /** Fuso da hora local na margem da folha */
  timeZone: "America/Sao_Paulo",
  email: "contact@faleir0x.com",
  linkedin: "https://www.linkedin.com/in/cauefaleiros/",
  /** Foto em /public, quadrada (aparece com 64px) */
  avatar: "/profile/avatar.webp",
  // RASCUNHO: texto de exemplo escrito a partir do que está no site; troque pelo seu.
  // dois parágrafos curtos; cada item vira um <p>
  bio: [
    {
      pt: "Construo aplicações web de ponta a ponta: interfaces, APIs, integrações e o que mantém tudo isso de pé em produção. Hoje faço isso como desenvolvedor full stack na Agência Compor, em Ribeirão Preto.",
      en: "I build web applications end to end: interfaces, APIs, integrations and whatever keeps them standing in production. Today I do it as a full stack developer at Agência Compor, in Ribeirão Preto.",
    },
    {
      pt: "Estou indo cada vez mais fundo em engenharia de IA: agentes, LLMs e o software em volta deles. Fora do código, leio fantasia e clássicos e não fico sem música.",
      en: "I'm going deeper into AI engineering: agents, LLMs and the software around them. Away from code, I read fantasy and classics and always have music on.",
    },
  ] satisfies Localized[],
};
