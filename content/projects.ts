import type { Project } from "@/features/projects/project-frames";

/*
 * Projetos: as primeiras linhas da folha, na ordem desta lista. Para adicionar um:
 *   1. thumbnail em public/projects/<slug>.webp, 4:3 (o quadro tem até ~290×218; exporte 2x: 640×480),
 *      ou um reel: um .mp4 4:3 de até 5 s por tema + o último frame como pôster, em public/projects/<slug>/
 *   2. um item aqui com title, kind (pt/en), status "live", image (ou reel) e href
 * A folha completa a última linha com “em breve” sozinha (features/projects/fill-rows.ts).
 * Um projeto que ainda não pode aparecer fica com status "soon".
 */
export const projects: Project[] = [
  {
    title: "Ecopulse",
    kind: { pt: "app de monitoramento ambiental", en: "environmental monitoring app" },
    status: "live",
    href: "https://github.com/faleir0x/ecopulse",
    // gravação real do app em cortes rápidos (assets/projects/ecopulse/reel/render_reel.py)
    reel: {
      light: { src: "/projects/ecopulse/reel-light.mp4", poster: "/projects/ecopulse/reel-light-poster.webp" },
      dark: { src: "/projects/ecopulse/reel-dark.mp4", poster: "/projects/ecopulse/reel-dark-poster.webp" },
    },
  },
  { title: "Projeto Dois", kind: { pt: "web app", en: "web app" }, status: "live" },
  { title: "Projeto Três", kind: { pt: "ferramenta", en: "tool" }, status: "live" },
];
