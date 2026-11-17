import type { Tool } from "@/features/tools/tools-frame";

/*
 * Ferramentas (quadro de ícones), na ordem em que aparecem: 4 por linha. Para uma tecnologia nova,
 * cadastre o ícone em components/tech-icon.tsx (Simple Icons) ou components/custom-icons.tsx.
 */
export const tools: Tool[] = [
  { slug: "python", name: "Python" },
  { slug: "javascript", name: "JavaScript" },
  { slug: "react", name: "React" },
  { slug: "n8n", name: "n8n" },
  { slug: "rag", name: "RAG" },
  { slug: "embeddings", name: "Embeddings" },
  { slug: "pgvector", name: "pgvector" },
  { slug: "langfuse", name: "Langfuse" },
  { slug: "promptfoo", name: "Promptfoo" },
  { slug: "docker", name: "Docker" },
  { slug: "grafana", name: "Grafana" },
  { slug: "nodedotjs", name: "Node.js" },
];
