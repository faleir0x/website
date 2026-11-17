import type { Tool } from "@/features/tools/tools-frame";

/*
 * Ferramentas (quadro de ícones). Confirmadas nas capturas do LinkedIn; a lista completa (+16 skills)
 * ainda falta. Para uma marca nova, adicione o ícone em components/tech-icon.tsx.
 */
export const tools: Tool[] = [
  { slug: "javascript", name: "JavaScript" },
  { slug: "react", name: "React" },
  { slug: "n8n", name: "n8n" },
  { slug: "docker", name: "Docker" },
  { slug: "googlecloud", name: "Google Cloud" },
  { slug: "grafana", name: "Grafana" },
  { slug: "zabbix", name: "Zabbix" },
];
