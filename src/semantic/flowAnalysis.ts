// ============================================================
// ANÁLISIS DE FLUJO — Terminación de instrucciones y código muerto
// ============================================================
//
// Determina, de forma estática y conservadora, si una instrucción
// "termina" el flujo de ejecución del bloque que la contiene (mediante
// `return`, `break` o `continue`). Se usa para:
// - detectar código inalcanzable (SEM018) después de un terminador;
// - decidir si una función con tipo de retorno declarado garantiza un
//   valor en todas sus rutas.
//
// Es deliberadamente conservador: construcciones como `while`, `for` o
// `switch` no se consideran terminadoras aunque en un caso particular sí
// lo sean (p. ej. `while (true) { return 1; }`). Esta limitación se
// documenta en docs/DECISIONES_SEMANTICAS.md.

import type { StatementContext } from "../generated/CompiscriptParser";

/** Recursión común a ambos análisis: solo cambia qué instrucción cuenta
 * como terminadora (`return` únicamente, o también `break`/`continue`). */
function statementSatisfies(ctx: StatementContext, isTerminator: (s: StatementContext) => boolean): boolean {
  if (isTerminator(ctx)) return true;

  const block = ctx.block();
  if (block) {
    return block.statement().some((s) => statementSatisfies(s, isTerminator));
  }

  const ifStmt = ctx.ifStatement();
  if (ifStmt) {
    const branches = ifStmt.block();
    if (branches.length < 2) return false; // sin `else`, no puede garantizar terminación
    return branches.every((branch) =>
      branch.statement().some((s) => statementSatisfies(s, isTerminator))
    );
  }

  return false;
}

export function statementTerminates(ctx: StatementContext): boolean {
  return statementSatisfies(
    ctx,
    (s) => Boolean(s.returnStatement() || s.breakStatement() || s.continueStatement())
  );
}

/** ¿El cuerpo de una función (lista de statements) garantiza terminar en
 * todas sus rutas con `return`? Usado para advertir sobre retornos
 * faltantes en funciones con tipo de retorno declarado distinto de void. */
export function bodyGuaranteesReturn(statements: StatementContext[]): boolean {
  return statements.some((s) => statementSatisfies(s, (x) => Boolean(x.returnStatement())));
}

/** Marca el primer statement inalcanzable dentro de una lista, aplicando
 * la regla de terminación anterior. Devuelve el índice del primer
 * statement inalcanzable, o -1 si no hay ninguno. */
export function findFirstUnreachableIndex(statements: StatementContext[]): number {
  let terminated = false;
  for (let i = 0; i < statements.length; i++) {
    if (terminated) return i;
    if (statementTerminates(statements[i])) terminated = true;
  }
  return -1;
}
