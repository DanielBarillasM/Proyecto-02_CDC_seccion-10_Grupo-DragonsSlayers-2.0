// ============================================================
// SISTEMA DE TIPOS SEMÁNTICOS — Compiscript
// ============================================================
//
// Modela los tipos que puede tener cualquier expresión o símbolo de
// Compiscript durante el análisis semántico. No se usan strings sueltos:
// cada tipo es un objeto estructurado para poder comparar, combinar y
// mostrar tipos de forma consistente en todo el analizador.

/** Tipos primitivos soportados. `float` es una extensión documentada en
 * docs/DECISIONES_SEMANTICAS.md porque no aparece en la gramática oficial
 * del lenguaje, pero sí en el requerimiento de análisis semántico. */
export type PrimitiveTypeName =
  | "integer"
  | "float"
  | "string"
  | "boolean"
  | "null"
  | "void"
  | "unknown"
  | "error";

export interface PrimitiveSemanticType {
  kind: "primitive";
  name: PrimitiveTypeName;
}

export interface ArraySemanticType {
  kind: "array";
  element: SemanticType;
}

/** El tipo de la clase misma (por ejemplo el valor que representa `Animal`
 * como constructor), distinto del tipo de una instancia. */
export interface ClassSemanticType {
  kind: "class";
  name: string;
  /** Identificador interno de la declaración. Permite clases homónimas en
   * ámbitos distintos sin confundir sus instancias. */
  classId: string;
}

/** Tipo de una instancia de una clase declarada, p. ej. `let p: Perro`. */
export interface InstanceSemanticType {
  kind: "instance";
  className: string;
  classId: string;
}

export interface FunctionSemanticType {
  kind: "function";
  params: SemanticType[];
  returnType: SemanticType;
}

export type SemanticType =
  | PrimitiveSemanticType
  | ArraySemanticType
  | ClassSemanticType
  | InstanceSemanticType
  | FunctionSemanticType;

// ──── Constructores ────────────────────────────────────────────────────────

function primitive(name: PrimitiveTypeName): PrimitiveSemanticType {
  return { kind: "primitive", name };
}

export const T = {
  integer: primitive("integer"),
  float: primitive("float"),
  string: primitive("string"),
  boolean: primitive("boolean"),
  null: primitive("null"),
  void: primitive("void"),
  unknown: primitive("unknown"),
  error: primitive("error"),
  array(element: SemanticType): ArraySemanticType {
    return { kind: "array", element };
  },
  classType(name: string, classId = name): ClassSemanticType {
    return { kind: "class", name, classId };
  },
  instance(className: string, classId = className): InstanceSemanticType {
    return { kind: "instance", className, classId };
  },
  fn(params: SemanticType[], returnType: SemanticType): FunctionSemanticType {
    return { kind: "function", params, returnType };
  }
};

// ──── Predicados básicos ────────────────────────────────────────────────────

export function isErrorType(type: SemanticType): boolean {
  return type.kind === "primitive" && type.name === "error";
}

export function isUnknownType(type: SemanticType): boolean {
  return type.kind === "primitive" && type.name === "unknown";
}

/** El tipo `error` (y, para no generar cascadas, también `unknown`)
 * absorbe operaciones posteriores: una vez que apareció un problema no se
 * repiten diagnósticos derivados sobre el mismo valor. */
export function isAbsorbing(type: SemanticType): boolean {
  return isErrorType(type) || isUnknownType(type);
}

export function isNumeric(type: SemanticType): boolean {
  return type.kind === "primitive" && (type.name === "integer" || type.name === "float");
}

export function isBoolean(type: SemanticType): boolean {
  return type.kind === "primitive" && type.name === "boolean";
}

export function isString(type: SemanticType): boolean {
  return type.kind === "primitive" && type.name === "string";
}

export function isVoid(type: SemanticType): boolean {
  return type.kind === "primitive" && type.name === "void";
}

export function isNullType(type: SemanticType): boolean {
  return type.kind === "primitive" && type.name === "null";
}

export function isArrayType(type: SemanticType): type is ArraySemanticType {
  return type.kind === "array";
}

export function isInstanceType(type: SemanticType): type is InstanceSemanticType {
  return type.kind === "instance";
}

export function isFunctionType(type: SemanticType): type is FunctionSemanticType {
  return type.kind === "function";
}

// ──── Igualdad estructural ──────────────────────────────────────────────────

export function typesEqual(a: SemanticType, b: SemanticType): boolean {
  if (a.kind !== b.kind) return false;
  switch (a.kind) {
    case "primitive":
      return a.name === (b as PrimitiveSemanticType).name;
    case "array":
      return typesEqual(a.element, (b as ArraySemanticType).element);
    case "class":
      return a.classId === (b as ClassSemanticType).classId;
    case "instance":
      return a.classId === (b as InstanceSemanticType).classId;
    case "function": {
      const other = b as FunctionSemanticType;
      if (a.params.length !== other.params.length) return false;
      return (
        a.params.every((p, i) => typesEqual(p, other.params[i])) &&
        typesEqual(a.returnType, other.returnType)
      );
    }
    default:
      return false;
  }
}

// ──── Representación legible ────────────────────────────────────────────────

export function displayType(type: SemanticType): string {
  switch (type.kind) {
    case "primitive":
      return type.name;
    case "array":
      return `${displayType(type.element)}[]`;
    case "class":
      return `clase ${type.name}`;
    case "instance":
      return type.className;
    case "function":
      return `(${type.params.map(displayType).join(", ")}) => ${displayType(type.returnType)}`;
    default:
      return "unknown";
  }
}
