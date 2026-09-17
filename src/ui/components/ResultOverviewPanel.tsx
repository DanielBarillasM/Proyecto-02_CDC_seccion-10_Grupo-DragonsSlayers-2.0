import {
  AlertCircle,
  AlertOctagon,
  BrainCircuit,
  CheckCircle2,
  CircleAlert,
  Database,
  FolderTree,
  Hash,
  TriangleAlert,
  XCircle
} from "lucide-react";
import type { ReactNode } from "react";
import { Play } from "lucide-react";
import type { AnalyzeResult } from "../../lib/types";
import { EmptyPanel } from "./EmptyPanel";

export function ResultOverviewPanel({ result }: { result: AnalyzeResult | null }) {
  if (!result) {
    return (
      <EmptyPanel
        icon={<Play size={22} />}
        title="Sin ejecución"
        text="Ejecuta el análisis para ver el resumen del resultado."
      />
    );
  }

  const { accepted, summary, semantic } = result;

  return (
    <div className="flex flex-col gap-3 p-3">
      <div
        className={`flex items-start gap-2 rounded border-2 p-3 ${
          accepted ? "border-green-900 bg-green-200 text-green-900" : "border-red-900 bg-red-200 text-red-900"
        }`}
      >
        {accepted ? <CheckCircle2 size={26} className="shrink-0" /> : <XCircle size={26} className="shrink-0" />}
        <div>
          <h3 className="font-head text-sm">
            {accepted ? "PROGRAMA SEMÁNTICAMENTE VÁLIDO" : "PROGRAMA CON DIAGNÓSTICOS SEMÁNTICOS"}
          </h3>
          <p className="text-sm">{result.explanation}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <SummaryCard label="Tokens" value={summary.tokenCount} icon={<Hash size={15} />} />
        <SummaryCard
          label="Errores léxicos"
          value={summary.lexicalErrorCount}
          icon={<AlertCircle size={15} />}
          alert={summary.lexicalErrorCount > 0}
        />
        <SummaryCard
          label="Errores sintácticos"
          value={summary.syntaxErrorCount}
          icon={<AlertOctagon size={15} />}
          alert={summary.syntaxErrorCount > 0}
        />
        <SummaryCard
          label="Errores semánticos"
          value={summary.semanticErrorCount}
          icon={<BrainCircuit size={15} />}
          alert={summary.semanticErrorCount > 0}
        />
        <SummaryCard
          label="Advertencias"
          value={summary.semanticWarningCount}
          icon={<TriangleAlert size={15} />}
          alert={summary.semanticWarningCount > 0}
        />
        <SummaryCard label="Símbolos" value={summary.symbolCount} icon={<Database size={15} />} />
        <SummaryCard label="Ámbitos" value={summary.scopeCount} icon={<FolderTree size={15} />} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <OverviewMetric label="Símbolos" value={semantic.metrics.symbolCount} detail="entradas registradas" />
        <OverviewMetric label="Ámbitos" value={semantic.metrics.scopeCount} detail="entornos enlazados" />
        <OverviewMetric label="Referencias" value={semantic.metrics.referenceCount} detail="usos resueltos" />
        <OverviewMetric label="Closures" value={semantic.metrics.capturedVariableCount} detail="variables capturadas" />
      </div>

      <div className="flex flex-col gap-2 rounded border-2 bg-card p-3">
        <div className="flex items-start gap-2">
          <CircleAlert size={16} className="mt-0.5 shrink-0" />
          <div>
            <h4 className="font-head text-xs uppercase tracking-wide">Lectura recomendada</h4>
            <p className="text-sm text-muted-foreground">
              {semantic.errors.length > 0
                ? "Comienza por los errores. Corrige primero nombres y tipos para reducir diagnósticos derivados."
                : semantic.warnings.length > 0
                  ? "El programa no tiene errores, pero conviene revisar las advertencias de flujo e inicialización."
                  : "El programa superó las tres fases. Revisa símbolos y ámbitos para explicar cómo se resolvió."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded border-2 bg-secondary p-3 text-secondary-foreground">
        <div className="flex items-start gap-2">
          <TriangleAlert size={16} className="mt-0.5 shrink-0" />
          <div className="w-full">
            <h4 className="font-head text-xs uppercase tracking-wide">Diagnósticos destacados</h4>
            {semantic.diagnostics.length === 0 ? (
              <p className="text-sm text-secondary-foreground/70">No se produjeron diagnósticos semánticos.</p>
            ) : (
              <ul className="flex flex-col gap-1 text-sm">
                {semantic.diagnostics.slice(0, 3).map((diagnostic) => (
                  <li key={diagnostic.id} className="flex flex-wrap items-baseline gap-1.5">
                    <code className="rounded border-2 bg-card px-1 text-xs text-card-foreground">{diagnostic.code}</code>
                    <span className="text-xs text-secondary-foreground/70">
                      L{diagnostic.line}:C{diagnostic.column}
                    </span>
                    <span>{diagnostic.message}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  alert
}: {
  label: string;
  value: number;
  icon: ReactNode;
  alert?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-1 rounded border-2 p-2 text-center ${
        alert === undefined ? "bg-card" : alert ? "border-red-900 bg-red-200 text-red-900" : "border-green-900 bg-green-200 text-green-900"
      }`}
    >
      {icon}
      <strong className="font-head text-lg leading-none">{value}</strong>
      <span className="text-xs">{label}</span>
    </div>
  );
}

function OverviewMetric({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <div className="flex flex-col rounded border-2 bg-card p-2">
      <strong className="font-head text-lg leading-none">{value}</strong>
      <span className="text-xs">{label}</span>
      <small className="text-xs text-muted-foreground">{detail}</small>
    </div>
  );
}
