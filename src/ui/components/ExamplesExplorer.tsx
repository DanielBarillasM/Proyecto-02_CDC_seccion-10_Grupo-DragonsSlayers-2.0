import { AlertCircle, AlertOctagon, BrainCircuit, CheckCircle, Edit3, Split } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { exampleCase } from "../../lib/examples";
import type { AnalysisMode } from "../../lib/types";

interface CaseOption {
  id: AnalysisMode;
  label: string;
  icon: ReactNode;
  description: string;
}

const cases: CaseOption[] = [
  {
    id: "valid",
    label: "Entrada válida",
    icon: <CheckCircle size={14} />,
    description: "Programa válido con funciones, clases, arreglos y control de flujo."
  },
  {
    id: "lexical",
    label: "Errores léxicos",
    icon: <AlertCircle size={14} />,
    description: exampleCase.lexicalErrorDescription
  },
  {
    id: "syntax",
    label: "Errores sintácticos",
    icon: <AlertOctagon size={14} />,
    description: exampleCase.syntaxErrorDescription
  },
  {
    id: "tac",
    label: "Generación TAC",
    icon: <Split size={14} />,
    description: "Genera instrucciones de tres direcciones, temporales, etiquetas y marcos de activación para el programa válido."
  },
  {
    id: "semantic-error",
    label: "Errores semánticos",
    icon: <BrainCircuit size={14} />,
    description: exampleCase.semanticErrorDescription
  },
  {
    id: "custom",
    label: "Archivo propio",
    icon: <Edit3 size={14} />,
    description: "Escribe, pega o selecciona tu propio archivo .cps."
  }
];

interface ExamplesExplorerProps {
  value: AnalysisMode;
  onChange: (mode: AnalysisMode) => void;
}

export function ExamplesExplorer({ value, onChange }: ExamplesExplorerProps) {
  const active = cases.find((item) => item.id === value);

  return (
    <div className="flex flex-col gap-1">
      <ul className="flex flex-col gap-0.5">
        {cases.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-accent",
                value === item.id && "bg-primary text-primary-foreground hover:bg-primary"
              )}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
      {active && <p className="px-2 pt-1 text-xs text-muted-foreground">{active.description}</p>}
    </div>
  );
}
