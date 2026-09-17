import { ChevronRight, FileCode2, X } from "lucide-react";
import type { ScopeInfo } from "../../semantic/scopes";

interface EditorBreadcrumbProps {
  fileName: string;
  scopeChain: ScopeInfo[] | null;
  onClearScope: () => void;
}

export function EditorBreadcrumb({ fileName, scopeChain, onClearScope }: EditorBreadcrumbProps) {
  return (
    <div className="flex items-center gap-1 border-b-2 bg-card px-2 py-1 text-xs text-muted-foreground">
      <FileCode2 size={13} />
      <span>{fileName}</span>
      {scopeChain?.map((scope) => (
        <span key={scope.id} className="flex items-center gap-1">
          <ChevronRight size={12} />
          <span className="rounded border-2 bg-muted px-1.5 py-0.5 text-foreground">
            {scope.kind} · {scope.name}
          </span>
        </span>
      ))}
      {scopeChain && scopeChain.length > 0 && (
        <button
          type="button"
          onClick={onClearScope}
          className="ml-1 flex items-center rounded border-2 border-transparent p-0.5 hover:border-border hover:bg-accent"
          aria-label="Limpiar ámbito seleccionado"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
