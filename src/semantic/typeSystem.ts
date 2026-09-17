// ============================================================
// OPERACIONES DEL SISTEMA DE TIPOS — Compiscript
// ============================================================
//
// Funciones centrales de compatibilidad y combinación de tipos. Todas
// absorben `error`/`unknown` para que un único problema no produzca una
// cascada de diagnósticos no relacionados.

import {
  type SemanticType,
  T,
  displayType,
  isAbsorbing,
  isArrayType,
  isBoolean,
  isInstanceType,
  isNullType,
  isNumeric,
  isString,
  isVoid,
  typesEqual
} from "./semanticTypes";

/** Permite consultar la jerarquía de clases sin acoplar este módulo al
 * analizador. `isSubclassOf(child, parent)` debe responder si `child`
 * hereda (directa o transitivamente) de `parent`. */
export type ClassHierarchyLookup = (child: string, parent: string) => boolean;

/**
 * isAssignable
 *
 * ¿Puede asignarse un valor de tipo `source` a un destino de tipo `target`?
 * Reglas relevantes:
 * - `error`/`unknown` en cualquiera de los dos lados nunca genera un nuevo
 *   diagnóstico (se consideran compatibles para evitar cascadas).
 * - `integer` puede promoverse a `float`, pero no al revés.
 * - Los arreglos son covariantes en su tipo de elemento.
 * - Las instancias son asignables a su propio tipo o al de una superclase.
 * - `null` es asignable a cualquier tipo de instancia o arreglo.
 */
export function isAssignable(
  target: SemanticType,
  source: SemanticType,
  isSubclassOf?: ClassHierarchyLookup
): boolean {
  if (isAbsorbing(target) || isAbsorbing(source)) return true;
  if (typesEqual(target, source)) return true;

  // Promoción numérica controlada: integer -> float, nunca al revés.
  if (target.kind === "primitive" && target.name === "float" && isNumeric(source)) {
    return true;
  }

  // null es asignable a instancias y arreglos (representa "sin valor").
  if (source.kind === "primitive" && source.name === "null") {
    return target.kind === "instance" || target.kind === "array";
  }

  if (isArrayType(target) && isArrayType(source)) {
    return isAssignable(target.element, source.element, isSubclassOf);
  }

  if (isInstanceType(target) && isInstanceType(source)) {
    if (target.classId === source.classId) return true;
    return isSubclassOf ? isSubclassOf(source.classId, target.classId) : false;
  }

  return false;
}

/**
 * isComparable
 *
 * ¿Pueden compararse dos tipos con el operador dado? `==`/`!=` aceptan
 * cualquier combinación numérica o tipos idénticos; los relacionales
 * (`<`, `<=`, `>`, `>=`) exigen operandos numéricos.
 */
export function isComparable(
  left: SemanticType,
  right: SemanticType,
  operator: "==" | "!=" | "<" | "<=" | ">" | ">="
): boolean {
  if (isAbsorbing(left) || isAbsorbing(right)) return true;

  if (operator === "==" || operator === "!=") {
    if (isNumeric(left) && isNumeric(right)) return true;

    // `null` solo es comparable con otro null o con tipos que pueden
    // contenerlo según isAssignable (instancias y arreglos). Evita aceptar
    // comparaciones sin sentido como `1 == null` o `true != null`.
    if (isNullType(left) || isNullType(right)) {
      const other = isNullType(left) ? right : left;
      return isNullType(other) || isArrayType(other) || isInstanceType(other);
    }

    return typesEqual(left, right);
  }

  return isNumeric(left) && isNumeric(right);
}

/**
 * numericResult
 *
 * Tipo resultante de una operación aritmética numérica. `integer op
 * integer` produce `integer`; si cualquiera de los dos es `float`, el
 * resultado es `float`. Devuelve `null` si alguno de los operandos no es
 * numérico (y no es absorbente).
 */
export function numericResult(left: SemanticType, right: SemanticType): SemanticType | null {
  if (isAbsorbing(left) || isAbsorbing(right)) return T.unknown;
  if (!isNumeric(left) || !isNumeric(right)) return null;
  if (left.kind === "primitive" && left.name === "float") return T.float;
  if (right.kind === "primitive" && right.name === "float") return T.float;
  return T.integer;
}

/**
 * commonType
 *
 * Tipo común de una lista de tipos (usado para arreglos literales). Si
 * todos son iguales, ese es el tipo común. Si son numéricos mixtos
 * (integer/float), el común es `float`. En cualquier otro caso de mezcla
 * no hay tipo común y se devuelve `null`.
 */
export function commonType(types: SemanticType[]): SemanticType | null {
  if (types.length === 0) return T.unknown;

  const nonAbsorbing = types.filter((type) => !isAbsorbing(type));
  if (nonAbsorbing.length === 0) return T.unknown;

  let acc = nonAbsorbing[0];
  for (const type of nonAbsorbing.slice(1)) {
    if (typesEqual(acc, type)) continue;
    if (isNumeric(acc) && isNumeric(type)) {
      acc = T.float;
      continue;
    }
    return null;
  }
  return acc;
}

/** ¿Es válido usar este tipo como operando lógico (`&&`, `||`, `!`)? */
export function isLogicalOperand(type: SemanticType): boolean {
  return isAbsorbing(type) || isBoolean(type);
}

/** ¿Es válido usar este tipo como operando de concatenación/suma (`+`)? */
export function isAdditiveOperand(type: SemanticType): boolean {
  return isAbsorbing(type) || isNumeric(type) || isString(type);
}

/** Política centralizada para discriminantes de `switch` — ver
 * docs/DECISIONES_SEMANTICAS.md, sección 8.2. Se aceptan integer, string y
 * boolean; se rechazan arreglos, funciones, clases y void. */
export function isValidSwitchDiscriminant(type: SemanticType): boolean {
  if (isAbsorbing(type)) return true;
  return isNumeric(type) || isString(type) || isBoolean(type);
}

/** ¿Tiene sentido semántico multiplicar/restar/dividir este tipo? Se usa
 * para bloquear operaciones aritméticas sobre funciones, clases o void. */
export function isMeaninglessOperand(type: SemanticType): boolean {
  return isVoid(type) || type.kind === "function" || type.kind === "class" || type.kind === "instance";
}

export { displayType };
