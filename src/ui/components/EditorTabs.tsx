import { BookOpen, FileCode2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ScopeInfo } from "../../semantic/scopes";
import { CodeEditor, type EditorMarker } from "./CodeEditor";
import { EditorBreadcrumb } from "./EditorBreadcrumb";
import { GrammarTab } from "./GrammarTab";

export type EditorTabId = "program" | "grammar";

interface EditorTabsProps {
  activeTab: EditorTabId;
  onTabChange: (tab: EditorTabId) => void;
  value: string;
  onChange: (value: string) => void;
  markers: EditorMarker[];
  revealLine?: number;
  onRunShortcut: () => void;
  theme: "light" | "dark";
  onCursorChange: (position: { line: number; column: number }) => void;
  scopeChain: ScopeInfo[] | null;
  onClearScope: () => void;
}

export function EditorTabs({
  activeTab,
  onTabChange,
  value,
  onChange,
  markers,
  revealLine,
  onRunShortcut,
  theme,
  onCursorChange,
  scopeChain,
  onClearScope
}: EditorTabsProps) {
  const isEmpty = value.trim().length === 0;

  return (
    <Tabs
      value={activeTab}
      onValueChange={(next) => onTabChange(next as EditorTabId)}
      className="flex h-full flex-col gap-0"
    >
      <TabsList variant="line" className="h-9 justify-start rounded-none border-b-2 bg-card px-2">
        <TabsTrigger value="program">
          <FileCode2 size={14} /> program.cps
        </TabsTrigger>
        <TabsTrigger value="grammar">
          <BookOpen size={14} /> Compiscript.g4
        </TabsTrigger>
      </TabsList>

      <TabsContent value="program" className="flex min-h-0 flex-1 flex-col">
        <EditorBreadcrumb fileName="program.cps" scopeChain={scopeChain} onClearScope={onClearScope} />
        {isEmpty && (
          <div className="border-b-2 bg-yellow-200 px-3 py-1.5 text-xs text-yellow-900">
            La entrada está vacía. Selecciona un caso o carga un archivo Compiscript.
          </div>
        )}
        <div className="min-h-0 flex-1">
          <CodeEditor
            value={value}
            onChange={onChange}
            markers={markers}
            revealLine={revealLine}
            onRunShortcut={onRunShortcut}
            theme={theme}
            onCursorChange={onCursorChange}
          />
        </div>
      </TabsContent>

      <TabsContent value="grammar" className="flex min-h-0 flex-1 flex-col">
        <GrammarTab theme={theme} />
      </TabsContent>
    </Tabs>
  );
}
