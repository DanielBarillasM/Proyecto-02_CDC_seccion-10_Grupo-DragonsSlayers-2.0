import { useCallback, useEffect, useMemo, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { analyzeInput } from "../lib/analyze";
import { downloadText } from "../lib/downloads";
import { exampleCase } from "../lib/examples";
import type { AnalysisMode, AnalyzeResult } from "../lib/types";
import type { ScopeInfo } from "../semantic/scopes";
import { ActivitySidebar } from "./components/ActivitySidebar";
import { CommandPalette } from "./components/CommandPalette";
import type { EditorMarker } from "./components/CodeEditor";
import { EditorTabs, type EditorTabId } from "./components/EditorTabs";
import { MenuBar } from "./components/MenuBar";
import { ProblemsPanel } from "./components/ProblemsPanel";
import { RightDock, type DockTabId } from "./components/RightDock";
import { StatusBar } from "./components/StatusBar";
import { Toolbar } from "./components/Toolbar";

export function App() {
  const [mode, setMode] = useState<AnalysisMode>("valid");
  const [customInput, setCustomInput] = useState<string>("");
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeEditorTab, setActiveEditorTab] = useState<EditorTabId>("program");
  const [activeDockTab, setActiveDockTab] = useState<DockTabId>("resultado");
  const [scopeChain, setScopeChain] = useState<ScopeInfo[] | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [cursor, setCursor] = useState({ line: 1, column: 1 });
  const [revealLine, setRevealLine] = useState<number | undefined>(undefined);

  const inputValue = useMemo(() => {
    if (mode === "lexical") return exampleCase.lexicalErrorInput;
    if (mode === "syntax") return exampleCase.syntaxErrorInput;
    if (mode === "semantic-error") return exampleCase.semanticErrorInput;
    if (mode === "custom") return customInput;
    return exampleCase.validInput;
  }, [mode, customInput]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((value) => !value);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const markers = useMemo<EditorMarker[]>(() => {
    if (!result) return [];
    const lexical: EditorMarker[] = result.lexicalErrors.map((error) => ({
      line: error.line,
      column: error.column,
      message: error.message,
      severity: "error"
    }));
    const syntax: EditorMarker[] = result.syntaxErrors.map((error) => ({
      line: error.line,
      column: error.column,
      message: error.message,
      severity: "error"
    }));
    const semantic: EditorMarker[] = result.semantic.diagnostics.map((diagnostic) => ({
      line: diagnostic.line,
      column: diagnostic.column,
      message: diagnostic.message,
      severity: diagnostic.severity
    }));
    return [...lexical, ...syntax, ...semantic];
  }, [result]);

  function handleModeChange(nextMode: AnalysisMode) {
    setMode(nextMode);
    if (nextMode === "custom" && customInput === "") {
      setCustomInput(exampleCase.validInput);
    }
    setResult(null);
    setAnalyzeError(null);
    setActiveEditorTab("program");
  }

  function handleInputChange(value: string) {
    setMode("custom");
    setCustomInput(value);
    setResult(null);
  }

  async function handleAnalyze() {
    setIsRunning(true);
    setAnalyzeError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 0));
      setResult(analyzeInput(inputValue, mode === "tac" ? "tac" : "semantic"));
      setActiveDockTab(mode === "tac" ? "tac" : "resultado");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("Cannot find module") || message.includes("generated")) {
        setAnalyzeError("Los archivos ANTLR generados no están disponibles. Ejecuta 'npm run generate' y reinicia el servidor.");
      } else {
        setAnalyzeError(`Error durante el análisis: ${message}`);
      }
    } finally {
      setIsRunning(false);
    }
  }

  function handleClear() {
    setMode("valid");
    setCustomInput("");
    setResult(null);
    setAnalyzeError(null);
    setFileError(null);
  }

  function handleLoadFile(text: string) {
    setFileError(null);
    handleInputChange(text);
    setActiveEditorTab("program");
  }

  const revealInEditor = useCallback((line: number) => {
    setActiveEditorTab("program");
    setRevealLine(line);
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <MenuBar
        onLoadFile={handleLoadFile}
        onFileError={setFileError}
        onDownloadInput={() => downloadText(`compiscript_${mode}.cps`, inputValue)}
        onCopyInput={() => navigator.clipboard.writeText(inputValue)}
        onReset={handleClear}
        onAnalyze={handleAnalyze}
        isRunning={isRunning}
        isEmpty={inputValue.trim().length === 0}
        onExportFocus={() => setActiveDockTab("exportar")}
        onOpenDocs={() => setActiveDockTab("documentacion")}
        theme={theme}
        onThemeChange={setTheme}
        aboutOpen={aboutOpen}
        onAboutOpenChange={setAboutOpen}
      />

      <Toolbar
        isRunning={isRunning}
        isEmpty={inputValue.trim().length === 0}
        onAnalyze={handleAnalyze}
        onReset={handleClear}
        result={result}
        theme={theme}
        onThemeChange={setTheme}
      />

      {(analyzeError || fileError) && (
        <div className="border-b-2 bg-red-200 px-3 py-1.5 text-xs text-red-900">{analyzeError ?? fileError}</div>
      )}

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize="18" minSize="12" maxSize="30">
            <ActivitySidebar mode={mode} onModeChange={handleModeChange} />
          </ResizablePanel>
          <ResizableHandle withHandle />

          <ResizablePanel defaultSize="52" minSize="30">
            <ResizablePanelGroup orientation="vertical">
              <ResizablePanel defaultSize="70" minSize="30">
                <EditorTabs
                  activeTab={activeEditorTab}
                  onTabChange={setActiveEditorTab}
                  value={inputValue}
                  onChange={handleInputChange}
                  markers={markers}
                  revealLine={revealLine}
                  onRunShortcut={handleAnalyze}
                  theme={theme}
                  onCursorChange={setCursor}
                  scopeChain={scopeChain}
                  onClearScope={() => setScopeChain(null)}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize="30" minSize="15">
                <ProblemsPanel result={result} onRevealLine={revealInEditor} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle withHandle />

          <ResizablePanel defaultSize="30" minSize="20" maxSize="45">
            <RightDock
              result={result}
              inputText={inputValue}
              activeTab={activeDockTab}
              onTabChange={setActiveDockTab}
              onSelectScope={setScopeChain}
              onLoadTestSource={handleLoadFile}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <StatusBar isRunning={isRunning} result={result} value={inputValue} cursor={cursor} />

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onAnalyze={handleAnalyze}
        onReset={handleClear}
        onCopyInput={() => navigator.clipboard.writeText(inputValue)}
        onDownloadInput={() => downloadText(`compiscript_${mode}.cps`, inputValue)}
        onSelectExample={handleModeChange}
        onOpenGrammar={() => setActiveEditorTab("grammar")}
        onSelectDock={setActiveDockTab}
        onOpenAbout={() => setAboutOpen(true)}
        theme={theme}
        onThemeChange={setTheme}
        isRunning={isRunning}
        isEmpty={inputValue.trim().length === 0}
      />
    </div>
  );
}
