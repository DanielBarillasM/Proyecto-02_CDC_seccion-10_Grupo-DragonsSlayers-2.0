import { Braces, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { AnalyzeResult } from "../../lib/types";
import type { SemanticTreeNode } from "../../semantic/ast";
import { EmptyPanel } from "./EmptyPanel";

interface SemanticTreePanelProps {
  result: AnalyzeResult;
}

export function SemanticTreePanel({ result }: SemanticTreePanelProps) {
  if (result.semantic.status !== "completed") {
    return <EmptyPanel icon={<Braces size={22} />} text="El árbol semántico anotado se genera después de validar el CST." />;
  }

  if (result.semantic.semanticTree.length === 0) {
    return <EmptyPanel icon={<Braces size={22} />} text="No hay nodos semánticos para mostrar." />;
  }

  return (
    <div className="flex flex-col gap-0.5 p-3">
      {result.semantic.semanticTree.map((node) => (
        <SemanticNode key={node.id} node={node} depth={0} />
      ))}
    </div>
  );
}

function SemanticNode({ node, depth }: { node: SemanticTreeNode; depth: number }) {
  const [collapsed, setCollapsed] = useState(depth > 3);
  const hasChildren = node.children.length > 0;

  return (
    <div style={{ marginLeft: depth === 0 ? 0 : "1rem" }}>
      <button
        type="button"
        className={`flex w-full flex-wrap items-center gap-1.5 rounded border-2 px-2 py-1 text-left text-xs ${
          node.diagnostics.length > 0 ? "border-red-900 bg-red-200 text-red-900" : "border-transparent hover:border-border hover:bg-accent"
        }`}
        onClick={() => hasChildren && setCollapsed((value) => !value)}
      >
        {hasChildren ? (
          collapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />
        ) : (
          <span className="inline-block size-1.5 rounded-full bg-border" />
        )}
        <span className="rounded border-2 bg-muted px-1.5 py-0.5">{node.kind}</span>
        <strong className="font-head">{node.label}</strong>
        {node.inferredType && <code className="rounded border-2 bg-card px-1">{node.inferredType}</code>}
        {node.location && (
          <span className="text-muted-foreground">
            L{node.location.line}:C{node.location.column}
          </span>
        )}
        {node.diagnostics.map((code) => (
          <span key={`${node.id}-${code}`} className="rounded border-2 border-red-900 bg-red-300 px-1 text-red-900">
            {code}
          </span>
        ))}
      </button>
      {!collapsed && hasChildren && (
        <div>
          {node.children.map((child) => (
            <SemanticNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
