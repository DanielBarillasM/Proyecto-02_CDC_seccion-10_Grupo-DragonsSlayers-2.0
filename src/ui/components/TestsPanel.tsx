import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, ChevronRight, FlaskConical, Play, Plus, RotateCcw, Trash2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  defaultTestCases,
  PHASE_LABELS,
  runTestCase,
  type TestCase,
  type TestPhase,
  type TestRunOutcome
} from "../../lib/testCases";
import type { SemanticDiagnosticCode } from "../../semantic/diagnostics";

const CUSTOM_CASES_KEY = "compiscript.tests.custom.v1";
const DELETED_DEFAULTS_KEY = "compiscript.tests.deletedDefaults.v1";
const PHASE_ORDER: TestPhase[] = ["lexer", "parser", "semantic", "rubric"];

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // almacenamiento no disponible (modo privado, cuota); las pruebas siguen funcionando en memoria.
  }
}

interface TestsPanelProps {
  onLoadSource?: (source: string) => void;
}

export function TestsPanel({ onLoadSource }: TestsPanelProps) {
  const [customCases, setCustomCases] = useState<TestCase[]>(() => readJson(CUSTOM_CASES_KEY, []));
  const [deletedDefaultIds, setDeletedDefaultIds] = useState<string[]>(() => readJson(DELETED_DEFAULTS_KEY, []));
  const [outcomes, setOutcomes] = useState<Record<string, TestRunOutcome>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => writeJson(CUSTOM_CASES_KEY, customCases), [customCases]);
  useEffect(() => writeJson(DELETED_DEFAULTS_KEY, deletedDefaultIds), [deletedDefaultIds]);

  const visibleCases = useMemo(() => {
    const deleted = new Set(deletedDefaultIds);
    return [...defaultTestCases.filter((testCase) => !deleted.has(testCase.id)), ...customCases];
  }, [customCases, deletedDefaultIds]);

  const grouped = useMemo(() => {
    const groups = new Map<TestPhase, TestCase[]>();
    for (const testCase of visibleCases) {
      const list = groups.get(testCase.phase) ?? [];
      list.push(testCase);
      groups.set(testCase.phase, list);
    }
    return groups;
  }, [visibleCases]);

  const ranIds = Object.keys(outcomes).filter((id) => visibleCases.some((testCase) => testCase.id === id));
  const passedCount = ranIds.filter((id) => outcomes[id]?.passed).length;

  function runOne(testCase: TestCase) {
    const outcome = runTestCase(testCase);
    setOutcomes((prev) => ({ ...prev, [testCase.id]: outcome }));
    return outcome;
  }

  function runAll() {
    const next: Record<string, TestRunOutcome> = {};
    for (const testCase of visibleCases) next[testCase.id] = runTestCase(testCase);
    setOutcomes(next);
  }

  function deleteCase(testCase: TestCase) {
    if (testCase.isDefault) {
      setDeletedDefaultIds((prev) => (prev.includes(testCase.id) ? prev : [...prev, testCase.id]));
    } else {
      setCustomCases((prev) => prev.filter((item) => item.id !== testCase.id));
    }
    setOutcomes((prev) => {
      const { [testCase.id]: _removed, ...rest } = prev;
      return rest;
    });
    if (expandedId === testCase.id) setExpandedId(null);
  }

  function addCustomCase(testCase: TestCase) {
    setCustomCases((prev) => [...prev, testCase]);
    setFormOpen(false);
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex flex-col gap-1 rounded border-2 bg-card p-3">
        <div className="flex items-center gap-2">
          <FlaskConical size={18} />
          <h3 className="font-head text-sm">Pruebas de lexer, parser y semántica</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Casos derivados de los mismos archivos .cps que usan las suites de Vitest
          (<code>lexer.test.ts</code>, <code>parser.test.ts</code>, <code>semantic/</code> y{" "}
          <code>rubric.examples.test.ts</code>). Sirven para demostrar y explorar en el IDE; la
          suite real sigue siendo <code>npm test</code>.
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={runAll}>
            <Play size={14} /> Ejecutar todas
          </Button>
          <Button size="sm" variant="outline" onClick={() => setFormOpen((value) => !value)}>
            <Plus size={14} /> Agregar prueba
          </Button>
          {deletedDefaultIds.length > 0 && (
            <Button size="sm" variant="ghost" onClick={() => setDeletedDefaultIds([])}>
              <RotateCcw size={14} /> Restaurar predeterminadas
            </Button>
          )}
          {ranIds.length > 0 && (
            <Badge variant={passedCount === ranIds.length ? "default" : "destructive"}>
              {passedCount}/{ranIds.length} aprobadas
            </Badge>
          )}
        </div>
      </div>

      {formOpen && <TestCaseForm onCancel={() => setFormOpen(false)} onSubmit={addCustomCase} />}

      {visibleCases.length === 0 ? (
        <p className="rounded border-2 bg-card p-3 text-center text-sm text-muted-foreground">
          No hay pruebas visibles. Restaura las predeterminadas o agrega una.
        </p>
      ) : (
        PHASE_ORDER.filter((phase) => grouped.has(phase)).map((phase) => (
          <div key={phase} className="flex flex-col gap-2">
            <p className="px-1 text-xs font-head uppercase tracking-wide text-muted-foreground">
              {PHASE_LABELS[phase]} ({grouped.get(phase)!.length})
            </p>
            {grouped.get(phase)!.map((testCase) => (
              <TestCaseRow
                key={testCase.id}
                testCase={testCase}
                outcome={outcomes[testCase.id]}
                expanded={expandedId === testCase.id}
                onToggleExpand={() => setExpandedId((current) => (current === testCase.id ? null : testCase.id))}
                onRun={() => runOne(testCase)}
                onDelete={() => deleteCase(testCase)}
                onLoadSource={onLoadSource}
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
}

function TestCaseRow({
  testCase,
  outcome,
  expanded,
  onToggleExpand,
  onRun,
  onDelete,
  onLoadSource
}: {
  testCase: TestCase;
  outcome?: TestRunOutcome;
  expanded: boolean;
  onToggleExpand: () => void;
  onRun: () => void;
  onDelete: () => void;
  onLoadSource?: (source: string) => void;
}) {
  const statusIcon = !outcome ? (
    <span className="size-4 shrink-0 rounded-full border-2 border-muted-foreground/40" />
  ) : outcome.passed ? (
    <CheckCircle2 size={18} className="shrink-0 text-green-700" />
  ) : (
    <XCircle size={18} className="shrink-0 text-red-700" />
  );

  return (
    <div className="rounded border-2 bg-card">
      <div className="flex items-start gap-2 p-2">
        {statusIcon}
        <button type="button" className="flex flex-1 flex-col items-start text-left" onClick={onToggleExpand}>
          <span className="flex items-center gap-1.5 font-head text-sm">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            {testCase.name}
            <Badge variant={testCase.isDefault ? "outline" : "secondary"} className="ml-1">
              {testCase.isDefault ? "predeterminada" : "personalizada"}
            </Badge>
          </span>
          <span className="pl-[18px] text-xs text-muted-foreground">{testCase.description}</span>
        </button>
        <div className="flex shrink-0 items-center gap-1">
          <Button size="icon-sm" variant="outline" onClick={onRun} title="Ejecutar">
            <Play size={13} />
          </Button>
          <Button size="icon-sm" variant="ghost" onClick={onDelete} title="Eliminar">
            <Trash2 size={13} />
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="flex flex-col gap-2 border-t-2 p-2 pl-[38px]">
          <ExpectationSummary expectation={testCase.expectation} />
          {outcome && !outcome.passed && (
            <ul className="list-disc pl-4 text-xs text-red-700">
              {outcome.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}
          <details>
            <summary className="cursor-pointer text-xs font-head uppercase tracking-wide text-muted-foreground">
              Ver código fuente
            </summary>
            <pre className="mt-1 max-h-48 overflow-auto rounded border-2 bg-muted p-2 text-xs">{testCase.source}</pre>
          </details>
          {onLoadSource && (
            <Button size="sm" variant="outline" className="w-fit" onClick={() => onLoadSource(testCase.source)}>
              Cargar en el editor
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function ExpectationSummary({ expectation }: { expectation: TestCase["expectation"] }) {
  const parts: string[] = [`aceptado=${expectation.accepted}`];
  if (expectation.lexicalErrors !== undefined) parts.push(`errores léxicos=${expectation.lexicalErrors}`);
  if (expectation.syntaxErrors !== undefined) parts.push(`errores sintácticos=${expectation.syntaxErrors}`);
  if (expectation.noSemanticDiagnostics) parts.push("0 diagnósticos semánticos");
  if (expectation.semanticCodes?.length) parts.push(`códigos: ${expectation.semanticCodes.join(", ")}`);
  return <p className="text-xs text-muted-foreground">Se espera: {parts.join(" · ")}</p>;
}

function TestCaseForm({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: (testCase: TestCase) => void }) {
  const [name, setName] = useState("");
  const [phase, setPhase] = useState<TestPhase>("semantic");
  const [source, setSource] = useState("");
  const [accepted, setAccepted] = useState<"true" | "false">("false");
  const [lexicalErrors, setLexicalErrors] = useState("");
  const [syntaxErrors, setSyntaxErrors] = useState("");
  const [semanticCodes, setSemanticCodes] = useState("");
  const [error, setError] = useState<string | null>(null);

  function parseCount(value: string): number | undefined {
    if (value.trim() === "") return undefined;
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed >= 0 ? parsed : undefined;
  }

  function handleSubmit() {
    if (name.trim() === "" || source.trim() === "") {
      setError("El nombre y el código fuente son obligatorios.");
      return;
    }
    const codes = semanticCodes
      .split(",")
      .map((code) => code.trim().toUpperCase())
      .filter((code): code is SemanticDiagnosticCode => /^SEM\d{3}$/.test(code));

    onSubmit({
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      phase,
      description: "Prueba agregada manualmente.",
      source,
      isDefault: false,
      expectation: {
        accepted: accepted === "true",
        lexicalErrors: parseCount(lexicalErrors),
        syntaxErrors: parseCount(syntaxErrors),
        semanticCodes: codes.length > 0 ? codes : undefined
      }
    });
  }

  return (
    <div className="flex flex-col gap-2 rounded border-2 border-primary bg-card p-3">
      <h4 className="font-head text-sm">Nueva prueba</h4>
      {error && <p className="text-xs text-red-700">{error}</p>}

      <Input placeholder="Nombre" value={name} onChange={(event) => setName(event.target.value)} />

      <div className="flex flex-wrap gap-2">
        <Select value={phase} onValueChange={(value) => setPhase(value as TestPhase)}>
          <SelectTrigger size="sm" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PHASE_ORDER.map((value) => (
              <SelectItem key={value} value={value}>
                {PHASE_LABELS[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={accepted} onValueChange={(value) => setAccepted(value as "true" | "false")}>
          <SelectTrigger size="sm" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Debe ser aceptado</SelectItem>
            <SelectItem value="false">Debe ser rechazado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <textarea
        placeholder="Código Compiscript (.cps)"
        value={source}
        onChange={(event) => setSource(event.target.value)}
        rows={6}
        className="w-full rounded border-2 bg-input p-2 font-mono text-xs shadow-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      />

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="# errores léxicos esperados (opcional)"
          value={lexicalErrors}
          onChange={(event) => setLexicalErrors(event.target.value)}
          className="w-56"
          inputMode="numeric"
        />
        <Input
          placeholder="# errores sintácticos esperados (opcional)"
          value={syntaxErrors}
          onChange={(event) => setSyntaxErrors(event.target.value)}
          className="w-56"
          inputMode="numeric"
        />
      </div>
      <Input
        placeholder="Códigos SEM esperados, separados por coma (opcional)"
        value={semanticCodes}
        onChange={(event) => setSemanticCodes(event.target.value)}
      />

      <Separator />
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button size="sm" onClick={handleSubmit}>
          Guardar prueba
        </Button>
      </div>
    </div>
  );
}
