import { BrainCircuit, Download, FileCode2, FileJson, FileText, Table as TableIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  downloadText,
  parseTreeToText,
  resultToJson,
  semanticReportToText,
  symbolsToCsv,
  tokensToCsv
} from "../../lib/downloads";
import { grammarSource } from "../../lib/examples";
import type { AnalyzeResult } from "../../lib/types";
import { EmptyPanel } from "./EmptyPanel";

interface ExportsPanelProps {
  result: AnalyzeResult | null;
  inputText: string;
}

export function ExportsPanel({ result, inputText }: ExportsPanelProps) {
  if (!result) {
    return <EmptyPanel icon={<Download size={22} />} text="Ejecuta el análisis para generar exportaciones." />;
  }

  const downloads = [
    { label: "Gramática .g4", icon: <FileCode2 size={14} />, action: () => downloadText("Compiscript.g4", grammarSource) },
    { label: "Entrada .cps", icon: <FileText size={14} />, action: () => downloadText("entrada_compiscript.cps", inputText) },
    {
      label: "Tokens CSV",
      icon: <TableIcon size={14} />,
      action: () => downloadText("tokens_compiscript.csv", tokensToCsv(result.tokens), "text/csv;charset=utf-8")
    },
    {
      label: "Tokens JSON",
      icon: <FileJson size={14} />,
      action: () => downloadText("tokens_compiscript.json", JSON.stringify(result.tokens, null, 2), "application/json")
    },
    ...(result.mode !== "lexer"
      ? [
          {
            label: "Árbol sintáctico .txt",
            icon: <FileText size={14} />,
            action: () => downloadText("arbol_sintactico_compiscript.txt", parseTreeToText(result))
          }
        ]
      : []),
    ...(result.mode === "semantic" && result.semantic.status === "completed"
      ? [
          {
            label: "Reporte semántico",
            icon: <BrainCircuit size={14} />,
            action: () => downloadText("reporte_semantico_compiscript.txt", semanticReportToText(result))
          },
          {
            label: "Símbolos CSV",
            icon: <TableIcon size={14} />,
            action: () => downloadText("tabla_simbolos_compiscript.csv", symbolsToCsv(result), "text/csv;charset=utf-8")
          },
          {
            label: "Semántica JSON",
            icon: <FileJson size={14} />,
            action: () => downloadText("semantica_compiscript.json", JSON.stringify(result.semantic, null, 2), "application/json")
          }
        ]
      : []),
    {
      label: "Resultado JSON",
      icon: <FileJson size={14} />,
      action: () => downloadText("resultado_compiscript.json", resultToJson(result), "application/json")
    }
  ];

  return (
    <div className="flex flex-col gap-2 p-3">
      <p className="flex items-center gap-1.5 text-xs font-head uppercase tracking-wide text-muted-foreground">
        <Download size={14} /> Evidencia y exportaciones
      </p>
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {downloads.map((dl) => (
          <Button key={dl.label} variant="outline" size="sm" className="justify-start" onClick={dl.action}>
            {dl.icon}
            {dl.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
