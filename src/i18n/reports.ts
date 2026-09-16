import type { Lang } from './ui';

export const reportsCopy = {
  pt: {
    title: 'Relatórios',
    intro: 'Relatórios de máquinas do TryHackMe, desafios de CTF e vulnerabilidades reportadas via HackerOne. Cada um cobre reconhecimento, vetor de entrada, exploração e escalada de privilégios, com a correção que fecharia a falha.',
    featuredKicker: 'Último relatório',
    readLabel: 'Ler →',
  },
  en: {
    title: 'Reports',
    intro: 'Reports from TryHackMe machines, CTF challenges and vulnerabilities disclosed through HackerOne. Each one covers recon, initial foothold, exploitation and privilege escalation, with the fix that would close the flaw.',
    featuredKicker: 'Latest report',
    readLabel: 'Read →',
  },
} as const satisfies Record<Lang, Record<string, string>>;

/** Labels for the write-up facts band. Platform terms (Easy, High…) stay as the platforms print them. */
export const factLabels = {
  pt: {
    details: 'Detalhes',
    platform: 'Plataforma',
    difficulty: 'Dificuldade',
    room: 'Sala',
    event: 'Evento',
    category: 'Categoria',
    points: 'Pontos',
    challenge: 'Desafio',
    program: 'Programa',
    weakness: 'Fraqueza',
    cvss: 'CVSS',
    vector: 'Vetor',
    bounty: 'Recompensa',
    reported: 'Reportado',
    resolved: 'Resolvido',
    report: 'Relatório',
    published: 'Publicado',
    updated: 'Atualizado',
  },
  en: {
    details: 'Details',
    platform: 'Platform',
    difficulty: 'Difficulty',
    room: 'Room',
    event: 'Event',
    category: 'Category',
    points: 'Points',
    challenge: 'Challenge',
    program: 'Program',
    weakness: 'Weakness',
    cvss: 'CVSS',
    vector: 'Vector',
    bounty: 'Bounty',
    reported: 'Reported',
    resolved: 'Resolved',
    report: 'Report',
    published: 'Published',
    updated: 'Updated',
  },
} as const satisfies Record<Lang, Record<string, string>>;
