import type { Lang } from './ui';

type Localized = Record<Lang, string>;

export const portfolioCopy = {
  pt: {
    role: 'Segurança Ofensiva',
    lead: 'Atuo em segurança ofensiva, com foco em testes de intrusão em aplicações web e APIs. Meu trabalho consiste em identificar vulnerabilidades, desde o OWASP Top 10 até abusos complexos de lógica de negócio, explorar a falha até uma prova de conceito (PoC) funcional e escrever a correção a nível de código.',
    support: 'Minha abordagem é guiada pela minha experiência como desenvolvedor full-stack. Por ter atuado diretamente na construção, manutenção e deploy dos sistemas que hoje testo, lidando com autenticação, proxies reversos e logs centralizados, compreendo como esses ambientes funcionam em produção. Essa visão de quem constrói me permite enxergar falhas arquiteturais que ferramentas automatizadas ignoram e entregar correções precisas para as equipes de engenharia.',
    experienceLabel: 'Experiência',
    stackLabel: 'Stack',
    nowLabel: 'Atual',
  },
  en: {
    role: 'Offensive Security',
    lead: 'I focus on offensive security, specifically web application and API penetration testing. My work involves uncovering vulnerabilities, from OWASP Top 10 to business-logic abuse, developing functional proofs of concept, and writing the code to fix them.',
    support: "My approach is rooted in my background as a full-stack developer. Because I have hands-on experience building, deploying, and maintaining the systems I now test, including authentication controls, reverse proxies, and centralized logging, I know how these environments are structured in production. This builder's perspective allows me to spot architectural blind spots that automated tools miss and provide practical, dev-ready remediations.",
    experienceLabel: 'Experience',
    stackLabel: 'Stack',
    nowLabel: 'Present',
  },
} as const satisfies Record<Lang, Record<string, string>>;

export interface Role {
  title: Localized;
  /** MM/YYYY */
  from: string;
  /** MM/YYYY, or null for a current role. */
  to: string | null;
  description: Localized;
}

export interface Employer {
  name: string;
  roles: Role[];
}

export const experience: Employer[] = [
  {
    name: 'Agência Compor',
    roles: [
      {
        title: { pt: 'Desenvolvedor Full Stack', en: 'Full Stack Developer' },
        from: '08/2026',
        to: null,
        description: {
          pt: 'Desenvolvo e sustento aplicações web utilizando Node.js, TypeScript e React, implementando autenticação segura e controles de acesso baseados nas diretrizes do OWASP. Administro a infraestrutura de produção com Docker e pipelines CI/CD, centralizando a auditoria de logs com Loki e Grafana para a investigação rápida de incidentes.',
          en: 'I develop and maintain web applications using Node.js, TypeScript, and React, implementing secure authentication and strict access controls guided by OWASP. I manage the production infrastructure with Docker and CI/CD pipelines, centralizing log auditing with Loki and Grafana for rapid incident investigation.',
        },
      },
      {
        title: { pt: 'Estagiário de Desenvolvimento', en: 'Software Development Intern' },
        from: '08/2025',
        to: '07/2026',
        description: {
          pt: 'Construí APIs e integrações backend utilizando Node.js e Express, atuando diretamente na modelagem de banco de dados com PostgreSQL. Colaborei na correção de bugs, revisão de código e análise de falhas operacionais para garantir a estabilidade e segurança dos serviços internos.',
          en: 'I built APIs and backend integrations using Node.js and Express, working directly on database modeling with PostgreSQL. I collaborated on bug fixing, code review, and analyzing operational failures to ensure the stability and security of internal services.',
        },
      },
    ],
  },
  {
    name: 'FMRP · USP',
    roles: [
      {
        title: { pt: 'Estagiário de Infraestrutura', en: 'IT Infrastructure Intern' },
        from: '07/2024',
        to: '07/2025',
        description: {
          pt: 'Apoiei a operação de serviços de infraestrutura na Google Cloud Platform (GCP) e auxiliei no suporte a ambientes containerizados com Docker. Utilizei Zabbix e Grafana para acompanhar a disponibilidade da rede corporativa e monitorar a estabilidade dos sistemas em tempo real.',
          en: 'I supported the operation of infrastructure services on Google Cloud Platform (GCP) and assisted with containerized environments using Docker. I utilized Zabbix and Grafana to track corporate network availability and monitor the stability of systems in real time.',
        },
      },
    ],
  },
];

export interface StackRow {
  label: string;
  items: string[] | Record<Lang, string[]>;
  /** Rendered at opacity .7, e.g. for a certifications row. */
  muted?: boolean;
}

export const stack: StackRow[] = [
  {
    label: 'Pentest',
    items: ['Burp Suite', 'Caido', 'OWASP ZAP', 'Nmap', 'ffuf', 'Gobuster', 'SQLmap', 'Nuclei', 'Nessus'],
  },
  { label: 'Scripting', items: ['Python', 'Go', 'Bash', 'PowerShell', 'SQL'] },
  { label: 'Infra', items: ['Docker', 'Grafana', 'Prometheus', 'Loki', 'CI/CD', 'GCP'] },
];
