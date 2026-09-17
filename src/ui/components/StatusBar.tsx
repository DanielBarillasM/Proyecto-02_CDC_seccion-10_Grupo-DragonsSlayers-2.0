import { CheckCircle2, CircleDashed, Loader2, XCircle } from "lucide-react";
import type { AnalyzeResult } from "../../lib/types";

interface StatusBarProps {
  isRunning: boolean;
  result: AnalyzeResult | null;
  value: string;
  cursor: { line: number; column: number };
}

export function StatusBar({ isRunning, result, value, cursor }: StatusBarProps) {
  const lineCount = value.split("\n").length;
  const isEmpty = value.trim().length === 0;

  const state = isRunning
    ? { icon: <Loader2 size={12} className="animate-spin" />, label: "Analizando…", color: "text-blue-900 dark:text-blue-300" }
    : !result
      ? { icon: <CircleDashed size={12} />, label: "Esperando ejecución", color: "text-muted-foreground" }
      : result.accepted
        ? { icon: <CheckCircle2 size={12} />, label: "Aceptado", color: "text-green-900 dark:text-green-300" }
        : { icon: <XCircle size={12} />, label: "Con diagnósticos", color: "text-red-900 dark:text-red-300" };

  return (
    <div className="flex h-6 items-center justify-between border-t-2 bg-card px-2 text-xs">
      <div className={`flex items-center gap-1.5 font-head ${state.color}`}>
        {state.icon}
        <span>{state.label}</span>
      </div>
      <div className="flex items-center gap-3 text-muted-foreground">
        <span>{isEmpty ? "Esperando código" : "Entrada lista"}</span>
        <span>
          Ln {cursor.line}, Col {cursor.column}
        </span>
        <span>
          {lineCount} {lineCount === 1 ? "línea" : "líneas"} · {value.length} caracteres
        </span>
      </div>
    </div>
  );
}
