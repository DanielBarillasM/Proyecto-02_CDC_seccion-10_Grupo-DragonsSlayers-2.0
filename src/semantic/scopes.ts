// ============================================================
// ÁMBITOS Y TABLA DE SÍMBOLOS — ScopeManager
// ============================================================
//
// Implementa el árbol de ámbitos exigido por la fase de análisis
// semántico: cada función, clase, bloque, ciclo o `catch` recibe su propio
// entorno con un identificador estable, encadenado a su ámbito padre.

import type { SourceLocation, SymbolEntry } from "./symbols";

export type ScopeKind = "global" | "block" | "function" | "class" | "loop" | "catch" | "switch";

export interface ScopeInfo {
  id: string;
  name: string;
  kind: ScopeKind;
  parentId: string | null;
  childIds: string[];
  symbolIds: string[];
  start: SourceLocation;
  end?: SourceLocation;
}

export type DeclareResult =
  | { ok: true; symbol: SymbolEntry }
  | { ok: false; existing: SymbolEntry };

export type SymbolUpdate = Partial<Pick<
  SymbolEntry,
  "type" | "mutable" | "initialized" | "parameters" | "returnType" | "members" | "parentClass" | "captured"
>>;

export class ScopeManager {
  readonly scopes = new Map<string, ScopeInfo>();
  readonly symbols = new Map<string, SymbolEntry>();
  readonly rootId: string;

  private scopeCounter = 0;
  private symbolCounter = 0;
  private stack: string[] = [];

  constructor(start: SourceLocation) {
    const root = this.createScope("global", "global", null, start);
    this.rootId = root.id;
    this.stack.push(root.id);
  }

  private createScope(
    kind: ScopeKind,
    name: string,
    parentId: string | null,
    start: SourceLocation
  ): ScopeInfo {
    const id = `scope-${this.scopeCounter++}`;
    const scope: ScopeInfo = {
      id,
      name,
      kind,
      parentId,
      childIds: [],
      symbolIds: [],
      start
    };
    this.scopes.set(id, scope);
    if (parentId) {
      this.scopes.get(parentId)?.childIds.push(id);
    }
    return scope;
  }

  currentScopeId(): string {
    return this.stack[this.stack.length - 1];
  }

  /** Crea un nuevo ámbito hijo del actual y lo convierte en el ámbito activo. */
  enterScope(kind: ScopeKind, name: string, start: SourceLocation): ScopeInfo {
    const scope = this.createScope(kind, name, this.currentScopeId(), start);
    this.stack.push(scope.id);
    return scope;
  }

  /** Cierra el ámbito activo y regresa al ámbito padre. */
  exitScope(end?: SourceLocation): void {
    const id = this.stack.pop();
    if (id && end) {
      const scope = this.scopes.get(id);
      if (scope) scope.end = end;
    }
  }

  /**
   * declare
   *
   * Registra un símbolo en el ámbito indicado (por defecto, el activo).
   * Si ya existe un símbolo con el mismo nombre en ESE ámbito exacto
   * (no en los padres), la declaración falla y se devuelve el símbolo
   * existente para poder señalar su ubicación original (SEM002).
   */
  declare(
    entry: Omit<SymbolEntry, "id" | "scopeId" | "references"> & { scopeId?: string }
  ): DeclareResult {
    const scopeId = entry.scopeId ?? this.currentScopeId();
    const scope = this.scopes.get(scopeId);
    if (!scope) throw new Error(`Ámbito desconocido: ${scopeId}`);

    const existing = this.resolveLocal(entry.name, scopeId);
    if (existing) {
      return { ok: false, existing };
    }

    const id = `sym-${this.symbolCounter++}`;
    const symbol: SymbolEntry = {
      ...entry,
      id,
      scopeId,
      references: []
    };
    this.symbols.set(id, symbol);
    scope.symbolIds.push(id);
    return { ok: true, symbol };
  }

  /** Busca un símbolo únicamente en el ámbito indicado (sin subir a padres). */
  resolveLocal(name: string, scopeId: string): SymbolEntry | undefined {
    const scope = this.scopes.get(scopeId);
    if (!scope) return undefined;
    for (const symbolId of scope.symbolIds) {
      const symbol = this.symbols.get(symbolId);
      if (symbol && symbol.name === name) return symbol;
    }
    return undefined;
  }

  /** Busca un símbolo subiendo por la cadena de ámbitos padres. */
  resolve(name: string, scopeId: string = this.currentScopeId()): SymbolEntry | undefined {
    let current: string | null = scopeId;
    while (current) {
      const found = this.resolveLocal(name, current);
      if (found) return found;
      current = this.scopes.get(current)?.parentId ?? null;
    }
    return undefined;
  }

  /** Determina el ámbito de función que encierra a `scopeId`, si existe. */
  enclosingFunctionScope(scopeId: string = this.currentScopeId()): ScopeInfo | undefined {
    let current: string | null = scopeId;
    while (current) {
      const scope = this.scopes.get(current);
      if (scope?.kind === "function") return scope;
      current = scope?.parentId ?? null;
    }
    return undefined;
  }

  enclosingLoopOrSwitch(kinds: ScopeKind[], scopeId: string = this.currentScopeId()): ScopeInfo | undefined {
    let current: string | null = scopeId;
    while (current) {
      const scope = this.scopes.get(current);
      if (scope && kinds.includes(scope.kind)) return scope;
      // No cruzar la frontera de una función: un break/continue de un ciclo
      // externo nunca aplica dentro de una función anidada.
      if (scope?.kind === "function") return undefined;
      current = scope?.parentId ?? null;
    }
    return undefined;
  }

  addReference(symbolId: string, location: SourceLocation): void {
    const symbol = this.symbols.get(symbolId);
    if (symbol) symbol.references.push(location);
  }

  /** Actualiza de forma controlada la información mutable de un símbolo.
   * Su identidad, nombre, ámbito y ubicación de declaración permanecen
   * invariantes durante toda la fase semántica. */
  updateSymbol(symbolId: string, changes: SymbolUpdate): SymbolEntry | undefined {
    const symbol = this.symbols.get(symbolId);
    if (!symbol) return undefined;
    Object.assign(symbol, changes);
    return symbol;
  }

  markInitialized(symbolId: string): void {
    this.updateSymbol(symbolId, { initialized: true });
  }

  markCaptured(symbolId: string): void {
    this.updateSymbol(symbolId, { captured: true });
  }

  allScopes(): ScopeInfo[] {
    return Array.from(this.scopes.values());
  }

  allSymbols(): SymbolEntry[] {
    return Array.from(this.symbols.values());
  }
}
