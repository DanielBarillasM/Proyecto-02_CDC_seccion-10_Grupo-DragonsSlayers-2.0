import { useMemo, useState } from "react";
import { Braces, Database, Download, FlaskConical, FolderTree, ListChecks, Network, Split } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { downloadText, tacReportToText, tacToCsv } from "../../lib/downloads";
import type { AnalyzeResult } from "../../lib/types";
import type { ScopeInfo } from "../../semantic/scopes";
import { DocumentationPanel } from "./DocumentationPanel";
import { EmptyPanel } from "./EmptyPanel";
import { ExportsPanel } from "./ExportsPanel";
import { ParseTreePanel } from "./ParseTreePanel";
import { ResultOverviewPanel } from "./ResultOverviewPanel";
import { ScopeTreePanel } from "./ScopeTreePanel";
import { SemanticTreePanel } from "./SemanticTreePanel";
import { SymbolTablePanel } from "./SymbolTablePanel";
import { TestsPanel } from "./TestsPanel";

export type DockTabId = "resultado" | "simbolos" | "ambitos" | "arboles" | "tac" | "documentacion" | "exportar" | "pruebas";

interface RightDockProps {
  result: AnalyzeResult | null;
  inputText: string;
  activeTab: DockTabId;
  onTabChange: (tab: DockTabId) => void;
  onSelectScope: (chain: ScopeInfo[]) => void;
  onLoadTestSource?: (source: string) => void;
}

function TacInspector({ result }: { result: AnalyzeResult }) {
  const [query, setQuery] = useState("");
  const [opcode, setOpcode] = useState("all");
  const instructions = result.tac.instructions;
  const opcodes = useMemo(() => [...new Set(instructions.map((item) => item.op))].sort(), [instructions]);
  const filtered = useMemo(() => instructions.filter((item) => {
    const matchesOpcode = opcode === "all" || item.op === opcode;
    const haystack = `${item.op} ${item.arg1?.value ?? ""} ${item.arg2?.value ?? ""} ${item.result?.value ?? ""}`.toLowerCase();
    return matchesOpcode && haystack.includes(query.toLowerCase());
  }), [instructions, opcode, query]);

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-head uppercase tracking-wide text-muted-foreground">Inspector TAC</p>
        <div className="flex gap-1">
          <button className="rounded border px-2 py-1 text-[11px]" onClick={() => downloadText("compiscript.tac", result.tac.formattedCode)}>TAC</button>
          <button className="rounded border px-2 py-1 text-[11px]" onClick={() => downloadText("compiscript_tac.csv", tacToCsv(instructions), "text/csv;charset=utf-8")}>CSV</button>
          <button className="rounded border px-2 py-1 text-[11px]" onClick={() => downloadText("reporte_tac.txt", tacReportToText(result))}>Reporte</button>
        </div>
      </div>
      {result.tac.status === "skipped" ? <p className="text-sm text-muted-foreground">{result.tac.skipReason}</p> : (
        <>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {[['Instr.', result.tac.metrics.instructionCount], ['Temps.', result.tac.metrics.temporaryCount], ['Labels', result.tac.metrics.labelCount], ['Frames', result.tac.metrics.activationRecordCount]].map(([label, value]) => (
              <div key={String(label)} className="rounded border bg-muted/20 p-2"><p className="text-[10px] text-muted-foreground">{label}</p><p className="font-mono text-sm">{value}</p></div>
            ))}
          </div>
          <div className="flex gap-1.5">
            <input aria-label="Filtrar TAC" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar operando..." className="min-w-0 flex-1 rounded border bg-background px-2 py-1 text-xs" />
            <select aria-label="Filtrar opcode" value={opcode} onChange={(event) => setOpcode(event.target.value)} className="rounded border bg-background px-2 py-1 text-xs"><option value="all">Todos</option>{opcodes.map((item) => <option key={item} value={item}>{item}</option>)}</select>
          </div>
          <pre className="max-h-72 overflow-auto rounded-md border bg-muted/30 p-3 font-mono text-xs leading-5">{filtered.map((item) => `${String(item.index).padStart(3, "0")}  ${item.op.padEnd(12, " ")}  ${item.result?.value ?? ""} ${item.arg1?.value ?? ""}${item.arg2 ? `, ${item.arg2.value}` : ""}`).join("\\n") || "Sin coincidencias."}</pre>
          <p className="text-xs text-muted-foreground">Mostrando {filtered.length} de {instructions.length} instrucciones · reutilización de temporales: {result.tac.metrics.temporariesReuseCount}</p>
        </>
      )}
    </div>
  );
}

export function RightDock({ result, inputText, activeTab, onTabChange, onSelectScope, onLoadTestSource }: RightDockProps) {
  return (
    <Tabs value={activeTab} onValueChange={(next) => onTabChange(next as DockTabId)} className="flex h-full flex-col gap-0">
      <TabsList variant="line" className="h-9 justify-start overflow-x-auto rounded-none border-b-2 bg-card px-1">
        <TabsTrigger value="resultado" className="px-2">
          <ListChecks size={14} />
        </TabsTrigger>
        <TabsTrigger value="simbolos" className="px-2">
          <Database size={14} />
        </TabsTrigger>
        <TabsTrigger value="ambitos" className="px-2">
          <FolderTree size={14} />
        </TabsTrigger>
        <TabsTrigger value="arboles" className="px-2">
          <Network size={14} />
        </TabsTrigger>
        <TabsTrigger value="tac" className="px-2">
          <Split size={14} />
        </TabsTrigger>
        <TabsTrigger value="documentacion" className="px-2">
          <Braces size={14} />
        </TabsTrigger>
        <TabsTrigger value="exportar" className="px-2">
          <Download size={14} />
        </TabsTrigger>
        <TabsTrigger value="pruebas" className="px-2">
          <FlaskConical size={14} />
        </TabsTrigger>
      </TabsList>

      <TabsContent value="resultado" className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <ResultOverviewPanel result={result} />
        </ScrollArea>
      </TabsContent>

      <TabsContent value="simbolos" className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {result ? <SymbolTablePanel result={result} /> : <EmptyPanel icon={<Database size={22} />} text="Ejecuta el análisis para ver los símbolos." />}
        </ScrollArea>
      </TabsContent>

      <TabsContent value="ambitos" className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {result ? (
            <ScopeTreePanel result={result} onSelectScope={onSelectScope} />
          ) : (
            <EmptyPanel icon={<FolderTree size={22} />} text="Ejecuta el análisis para ver los ámbitos." />
          )}
        </ScrollArea>
      </TabsContent>

      <TabsContent value="arboles" className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {result ? (
            <div className="flex flex-col gap-2">
              <p className="px-3 pt-3 text-xs font-head uppercase tracking-wide text-muted-foreground">Árbol semántico anotado</p>
              <SemanticTreePanel result={result} />
              <Separator />
              <p className="px-3 text-xs font-head uppercase tracking-wide text-muted-foreground">Árbol de parseo ANTLR</p>
              <ParseTreePanel result={result} />
            </div>
          ) : (
            <EmptyPanel icon={<Network size={22} />} text="Ejecuta el análisis para ver los árboles." />
          )}
        </ScrollArea>
      </TabsContent>

      <TabsContent value="tac" className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {result ? <TacInspector result={result} /> : <EmptyPanel icon={<Split size={22} />} text="Ejecuta el análisis para generar TAC." />}
        </ScrollArea>
      </TabsContent>

      <TabsContent value="documentacion" className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <DocumentationPanel />
        </ScrollArea>
      </TabsContent>

      <TabsContent value="exportar" className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <ExportsPanel result={result} inputText={inputText} />
        </ScrollArea>
      </TabsContent>

      <TabsContent value="pruebas" className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <TestsPanel onLoadSource={onLoadTestSource} />
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
