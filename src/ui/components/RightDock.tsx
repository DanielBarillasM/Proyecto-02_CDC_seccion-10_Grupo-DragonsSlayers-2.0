import { useMemo, useState } from "react";
import { Braces, Database, Download, FlaskConical, FolderTree, ListChecks, Network, Search, Split, Workflow } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { downloadText, tacReportToText, tacToCsv } from "../../lib/downloads";
import type { AnalyzeResult } from "../../lib/types";
import { formatTac } from "../../tac/types";
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

export type DockTabId = "resultado" | "simbolos" | "ambitos" | "arboles" | "tac" | "visual" | "documentacion" | "exportar" | "pruebas";

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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-head uppercase tracking-wide">Código de tres direcciones</p>
          <p className="mt-1 text-xs text-muted-foreground">Inspecciona, filtra y exporta la representación intermedia.</p>
        </div>
        <div className="flex gap-1">
          <button className="rounded border bg-primary px-2 py-1 text-[11px] font-semibold shadow-xs" onClick={() => downloadText("compiscript.tac", result.tac.formattedCode)}>Descargar TAC</button>
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
            <label className="flex min-w-0 flex-1 items-center gap-1.5 rounded border bg-background px-2 py-1 focus-within:ring-1 focus-within:ring-ring">
              <Search size={13} className="shrink-0 text-muted-foreground" />
              <input aria-label="Filtrar TAC" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar operando o etiqueta..." className="min-w-0 flex-1 bg-transparent text-xs outline-none" />
            </label>
            <select aria-label="Filtrar opcode" value={opcode} onChange={(event) => setOpcode(event.target.value)} className="rounded border bg-background px-2 py-1 text-xs"><option value="all">Todos los opcodes</option>{opcodes.map((item) => <option key={item} value={item}>{item}</option>)}</select>
          </div>
          <div className="overflow-hidden rounded-md border bg-[#10151a] shadow-inner">
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              <span className="text-white">Listado de instrucciones</span>
              <span className="font-mono normal-case tracking-normal">TAC / IR</span>
            </div>
            <div className="max-h-80 overflow-auto py-1 font-mono text-[12px] leading-6">
              {filtered.length ? filtered.map((item) => {
                const line = formatTac([item]);
                return (
                  <div key={item.index} className="group grid min-w-[34rem] grid-cols-[3.5rem_5.75rem_minmax(0,1fr)] items-baseline px-3 hover:bg-primary/10">
                    <span className="select-none text-right text-[10px] text-muted-foreground/60">{String(item.index).padStart(3, "0")}</span>
                    <span className="pl-4 text-[10px] font-semibold tracking-wide text-primary/80">{item.op}</span>
                    <code className="whitespace-pre pl-3 text-white/90">{line}</code>
                  </div>
                );
              }) : <p className="px-4 py-8 text-center text-xs text-muted-foreground">Sin coincidencias.</p>}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Mostrando {filtered.length} de {instructions.length} instrucciones · reutilización de temporales: {result.tac.metrics.temporariesReuseCount}</p>
        </>
      )}
    </div>
  );
}

function TacVisualPanel({ result }: { result: AnalyzeResult }) {
  const instructions = result.tac.instructions;
  const labels = useMemo(() => new Map(instructions.filter((item) => item.op === "LABEL").map((item) => [String(item.result?.value), item.index])), [instructions]);
  const blocks = useMemo(() => {
    const starts = [0, ...instructions.filter((item) => item.op === "LABEL").map((item) => item.index)];
    return [...new Set(starts)].sort((a, b) => a - b).map((start, index, all) => {
      const end = all[index + 1] ?? instructions.length;
      const block = instructions.slice(start, end);
      return { id: `B${index}`, start, block, title: block.find((item) => item.op === "LABEL")?.result?.value ?? `entrada_${index}` };
    });
  }, [instructions]);
  const edges = useMemo(() => blocks.flatMap((block, index) => {
    const last = block.block[block.block.length - 1];
    const target = last?.result?.kind === "label" ? labels.get(String(last.result.value)) : undefined;
    const targetIndex = target === undefined ? -1 : blocks.findIndex((candidate) => candidate.start === target);
    const isConditional = last?.op === "IF_TRUE" || last?.op === "IF_FALSE";
    const destinations = isConditional
      ? [targetIndex, index < blocks.length - 1 ? index + 1 : -1]
      : last?.op === "GOTO" ? [targetIndex] : [index < blocks.length - 1 ? index + 1 : -1];
    return [...new Set(destinations)].filter((value) => value >= 0).map((to) => ({ from: index, to, conditional: isConditional }));
  }), [blocks, labels]);
  const outgoingByBlock = useMemo(() => new Map(blocks.map((block, index) => [index, edges.filter((edge) => edge.from === index)])), [blocks, edges]);
  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-sm font-head uppercase tracking-wide">Flujo visual del TAC</p><p className="mt-1 max-w-xl text-xs text-muted-foreground">Cada tarjeta es un bloque básico. Las conexiones muestran la siguiente instrucción o el destino de un salto.</p></div>
        <div className="hidden shrink-0 items-center gap-2 text-[10px] text-muted-foreground sm:flex"><span className="h-2 w-2 rounded-full bg-primary" /> salto <span className="h-2 w-2 rounded-full bg-amber-400" /> condición</div>
      </div>
      {result.tac.status === "skipped" ? <p className="text-sm text-muted-foreground">{result.tac.skipReason}</p> : (
        <div className="min-w-0 overflow-hidden rounded-lg border bg-[#0d1217] p-3">
          <div className="grid min-w-0 grid-cols-1 gap-3" role="list" aria-label="Bloques básicos del código TAC">
            {blocks.map((block, index) => {
              const outgoing = outgoingByBlock.get(index) ?? [];
              return <article key={block.id} role="listitem" className="relative min-w-0 overflow-hidden rounded-lg border border-white/10 bg-[#18212a] shadow-sm transition-colors hover:border-primary/70">
                <header className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-3 py-2"><div><span className="font-mono text-xs font-bold text-primary">{block.id}</span><span className="ml-2 text-[10px] text-white/60">{String(block.title)}</span></div><span className="font-mono text-[10px] text-white/45">{block.start.toString().padStart(3, "0")}</span></header>
                <div className="min-w-0 space-y-1 p-3">{block.block.slice(0, 6).map((item) => <div key={item.index} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-2 font-mono text-[11px] leading-5"><span className="text-right text-white/35">{item.index}</span><code className="min-w-0 break-words whitespace-normal text-white/90" title={formatTac([item])}>{formatTac([item])}</code></div>)}{block.block.length > 6 && <p className="pl-10 text-[10px] text-white/45">+ {block.block.length - 6} instrucciones</p>}</div>
                <footer className="flex flex-wrap gap-1 border-t border-white/10 px-3 py-2">{outgoing.length ? outgoing.map((edge) => <span key={`${edge.from}-${edge.to}`} className={`rounded-full px-2 py-0.5 text-[10px] ${edge.conditional ? "bg-amber-400/15 text-amber-300" : "bg-primary/15 text-primary"}`}>{edge.conditional ? "condición →" : "siguiente →"} {blocks[edge.to]?.id ?? "fin"}</span>) : <span className="text-[10px] text-white/45">fin del flujo</span>}</footer>
              </article>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function RightDock({ result, inputText, activeTab, onTabChange, onSelectScope, onLoadTestSource }: RightDockProps) {
  return (
    <Tabs value={activeTab} onValueChange={(next) => onTabChange(next as DockTabId)} className="flex h-full flex-col gap-0">
      <TabsList variant="line" className="h-9 justify-start overflow-x-auto rounded-none border-b-2 bg-card px-1">
        <TabsTrigger value="resultado" className="gap-1.5 px-2 text-xs">
          <ListChecks size={14} /> <span>Resultado</span>
        </TabsTrigger>
        <TabsTrigger value="simbolos" className="gap-1.5 px-2 text-xs">
          <Database size={14} /> <span>Símbolos</span>
        </TabsTrigger>
        <TabsTrigger value="ambitos" className="gap-1.5 px-2 text-xs">
          <FolderTree size={14} /> <span>Ámbitos</span>
        </TabsTrigger>
        <TabsTrigger value="arboles" className="gap-1.5 px-2 text-xs">
          <Network size={14} /> <span>Árboles</span>
        </TabsTrigger>
        <TabsTrigger value="tac" className="gap-1.5 bg-primary/15 px-2 text-xs font-semibold">
          <Split size={14} /> <span>TAC</span>
        </TabsTrigger>
        <TabsTrigger value="visual" className="gap-1.5 px-2 text-xs">
          <Workflow size={14} /> <span>Visual</span>
        </TabsTrigger>
        <TabsTrigger value="documentacion" className="gap-1.5 px-2 text-xs">
          <Braces size={14} /> <span>Docs</span>
        </TabsTrigger>
        <TabsTrigger value="exportar" className="gap-1.5 px-2 text-xs">
          <Download size={14} /> <span>Exportar</span>
        </TabsTrigger>
        <TabsTrigger value="pruebas" className="gap-1.5 px-2 text-xs">
          <FlaskConical size={14} /> <span>Pruebas</span>
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

      <TabsContent value="visual" className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {result ? <TacVisualPanel result={result} /> : <EmptyPanel icon={<Workflow size={22} />} text="Ejecuta el análisis para visualizar el flujo TAC." />}
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
