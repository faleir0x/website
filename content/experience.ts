import type { Job } from "@/features/experience/experience-frame";

/*
 * Experiência, em ordem cronológica (do LinkedIn, 2026-11-16). Stacks do Sesi ainda a confirmar.
 * Cada emprego vira uma tira; sem `end` é o atual. Stacks são slugs de components/tech-icon.tsx.
 * No cargo, \n marca onde a linha quebra na tira (ex.: "Estagiário de\nSuporte de TI").
 */
export const experience: Job[] = [
  {
    company: "Sesi São Paulo",
    role: { pt: "Estagiário de\nSuporte de TI", en: "IT Support\nIntern" },
    start: "2023-09",
    end: "2024-06",
    summary: {
      pt: "Suporte de TI no Laboratório de Tecnologia, mantendo os equipamentos funcionando durante aulas e provas, com manutenção preventiva e corretiva.",
      en: "IT support for the Technology Lab, keeping equipment running during classes and exams through preventive and corrective maintenance.",
    },
    stacks: [],
  },
  {
    company: "FMRP · USP",
    role: { pt: "Estagiário de\nInfraestrutura de TI", en: "IT Infrastructure\nIntern" },
    start: "2024-07",
    end: "2025-07",
    summary: {
      pt: "Infraestrutura de serviços no Google Cloud e em Docker, monitoramento com Zabbix e Grafana e suporte à rede do campus.",
      en: "Service infrastructure on Google Cloud and Docker, monitoring with Zabbix and Grafana, and support for the campus network.",
    },
    stacks: ["googlecloud", "docker", "zabbix", "grafana"],
  },
  {
    company: "Agência Compor",
    role: { pt: "Estagiário de\nDesenvolvimento", en: "Development\nIntern" },
    start: "2025-08",
    end: "2026-07",
    summary: {
      pt: "Desenvolvimento e manutenção de aplicações web e sistemas internos: interfaces, APIs, integrações e modelagem de banco de dados.",
      en: "Built and maintained web applications and internal systems: interfaces, APIs, integrations and database modeling.",
    },
    stacks: ["javascript", "react"],
  },
  {
    company: "Agência Compor",
    role: { pt: "Desenvolvedor\nFull Stack", en: "Full Stack\nDeveloper" },
    start: "2026-08",
    summary: {
      pt: "Aplicações full stack para operações internas, integrações com Olist e n8n via webhooks, deploys e ambientes de produção, autenticação e monitoramento.",
      en: "Full stack applications for internal operations, Olist and n8n integrations through webhooks, deploys and production environments, auth and monitoring.",
    },
    stacks: ["javascript", "react", "n8n"],
  },
];
