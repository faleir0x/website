import { Margin } from "@/features/margin/margin";
import { ExperienceFrame } from "@/features/experience/experience-frame";
import { ListeningFrame } from "@/features/listening/listening-frame";
import { Profile } from "@/features/profile/profile";
import { ProjectFrames } from "@/features/projects/project-frames";
import { ReadingFrame } from "@/features/reading/reading-frame";
import { Sheet } from "@/features/sheet/frame";
import { ToolsFrame } from "@/features/tools/tools-frame";
import s from "./home.module.css";

/*
 * A home inteira (DESIGN.md §5): margem no topo, perfil à esquerda, a folha de quadros à direita
 * e o mato de ponta a ponta embaixo. Este arquivo só posiciona; cada área é um módulo em features/.
 *
 * Ordem da folha (DESIGN.md §7): projetos fecham linhas de 3, depois a linha pessoal
 * (ouvindo, lendo, ferramentas) e a experiência ocupa a última linha inteira.
 */
export function Home() {
  return (
    <div className={s.shell}>
      <div className={s.page}>
        <header className={s.margin}>
          <Margin />
        </header>
        <aside className={s.side}>
          <Profile />
        </aside>
        <main className={s.main}>
          <Sheet>
            <ProjectFrames />
            <ListeningFrame />
            <ReadingFrame />
            <ToolsFrame />
            <ExperienceFrame />
          </Sheet>
        </main>
      </div>
      {/* mato: a foto repetida na horizontal, dia no claro e noite no escuro (--grass-image) */}
      <div className={s.grass} aria-hidden="true" />
    </div>
  );
}
