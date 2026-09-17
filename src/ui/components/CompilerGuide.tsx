import { Braces, CheckCircle2, Database, GitBranch, ScanSearch } from "lucide-react";
import type { ReactNode } from "react";

interface Phase {
  number: string;
  title: string;
  description: string;
  icon: ReactNode;
}

const phases: Phase[] = [
  {
    number: "01",
    title: "Análisis léxico",
    description: "Convierte caracteres en tokens y localiza símbolos no reconocidos.",
    icon: <ScanSearch size={16} />
  },
  {
    number: "02",
    title: "Análisis sintáctico",
    description: "Valida la estructura con ANTLR y construye el árbol de parseo.",
    icon: <Braces size={16} />
  },
  {
    number: "03",
    title: "Análisis semántico",
    description: "Resuelve nombres, tipos, ámbitos, flujo, funciones y clases.",
    icon: <GitBranch size={16} />
  }
];

export function CompilerGuide() {
  return (
    <div className="flex flex-col gap-3 text-xs">
      <div>
        <h3 className="font-head text-sm">Del código al significado</h3>
        <p className="text-muted-foreground">
          Ejecuta las fases en orden. Si lexer o parser fallan, la fase semántica se detiene para evitar
          errores derivados.
        </p>
      </div>

      <ol className="flex flex-col gap-2">
        {phases.map((phase) => (
          <li key={phase.number} className="flex items-start gap-2 rounded border-2 bg-card p-2 shadow-sm">
            <span className="font-head text-muted-foreground">{phase.number}</span>
            <span className="mt-0.5">{phase.icon}</span>
            <span>
              <strong className="block font-head">{phase.title}</strong>
              <span className="text-muted-foreground">{phase.description}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="flex flex-col gap-1 rounded border-2 bg-accent p-2">
        <div className="flex items-center gap-2 font-head">
          <Database size={14} /> Resultado verificable
        </div>
        <p className="text-muted-foreground">
          Diagnósticos con ubicación, tabla de símbolos actualizada, árbol de ámbitos y árboles visuales.
        </p>
        <span className="flex items-center gap-1 text-muted-foreground">
          <CheckCircle2 size={12} /> Ctrl + Enter ejecuta el análisis
        </span>
      </div>
    </div>
  );
}
