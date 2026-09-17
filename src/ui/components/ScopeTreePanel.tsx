import { ChevronDown, ChevronRight, FolderTree } from "lucide-react";
import { useMemo, useState } from "react";
import type { AnalyzeResult } from "../../lib/types";
import type { ScopeInfo } from "../../semantic/scopes";
import { EmptyPanel } from "./EmptyPanel";

interface ScopeTreePanelProps {
  result: AnalyzeResult;
  onSelectScope: (chain: ScopeInfo[]) => void;
}

export function ScopeTreePanel({ result, onSelectScope }: ScopeTreePanelProps) {
  const { scopes, scopeRootId } = result.semantic;
  const scopeMap = useMemo(() => new Map(scopes.map((scope) => [scope.id, scope])), [scopes]);
  const root = scopeRootId ? scopeMap.get(scopeRootId) : undefined;

  if (result.semantic.status !== "completed") {
    return <EmptyPanel icon={<FolderTree size={22} />} text="Los ámbitos se construyen durante el análisis semántico." />;
  }

  if (!root) {
    return <EmptyPanel icon={<FolderTree size={22} />} text="No se generó un árbol de ámbitos." />;
  }

  return (
    <div className="flex flex-col gap-0.5 p-3">
      <ScopeNode scope={root} scopeMap={scopeMap} depth={0} ancestors={[]} onSelectScope={onSelectScope} />
    </div>
  );
}

function ScopeNode({
  scope,
  scopeMap,
  depth,
  ancestors,
  onSelectScope
}: {
  scope: ScopeInfo;
  scopeMap: Map<string, ScopeInfo>;
  depth: number;
  ancestors: ScopeInfo[];
  onSelectScope: (chain: ScopeInfo[]) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const chain = [...ancestors, scope];
  const children = scope.childIds.map((id) => scopeMap.get(id)).filter((item): item is ScopeInfo => Boolean(item));

  return (
    <div style={{ marginLeft: depth === 0 ? 0 : "1rem" }}>
      <button
        type="button"
        className="flex w-full items-center gap-2 rounded border-2 border-transparent px-2 py-1 text-left text-xs hover:border-border hover:bg-accent"
        onClick={() => {
          setCollapsed((value) => !value);
          onSelectScope(chain);
        }}
      >
        {children.length > 0 ? (
          collapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />
        ) : (
          <span className="inline-block size-1.5 rounded-full bg-border" />
        )}
        <span className="rounded border-2 bg-muted px-1.5 py-0.5">{scope.kind}</span>
        <strong className="font-head">{scope.name}</strong>
        <span className="text-muted-foreground">{scope.symbolIds.length} símbolos</span>
        <code className="ml-auto text-muted-foreground">{scope.id}</code>
      </button>
      {!collapsed && children.length > 0 && (
        <div>
          {children.map((child) => (
            <ScopeNode key={child.id} scope={child} scopeMap={scopeMap} depth={depth + 1} ancestors={chain} onSelectScope={onSelectScope} />
          ))}
        </div>
      )}
    </div>
  );
}
