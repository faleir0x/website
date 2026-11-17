import type { Project } from "@/features/projects/project-frames";

/*
 * Projetos: as primeiras linhas da folha, na ordem desta lista. Para adicionar um:
 *   1. thumbnail em public/projects/<slug>.webp, 4:3 (o quadro tem até ~290×218; exporte 2x: 640×480)
 *   2. um item aqui com title, kind (pt/en), status "live", image e href
 * A folha completa a última linha com “em breve” sozinha (features/projects/fill-rows.ts).
 * Um projeto que ainda não pode aparecer fica com status "soon".
 */
export const projects: Project[] = [
  { title: "Projeto Um", kind: { pt: "agente de IA", en: "AI agent" }, status: "live" },
  { title: "Projeto Dois", kind: { pt: "web app", en: "web app" }, status: "live" },
  { title: "Projeto Três", kind: { pt: "ferramenta", en: "tool" }, status: "live" },
];
