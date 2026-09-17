import { describe, expect, it } from "vitest";
import { analyzeInput } from "../../lib/analyze";
import type { SemanticDiagnosticCode } from "../../semantic/diagnostics";

function analyze(source: string) {
  return analyzeInput(source, "semantic");
}

function codesOf(source: string): SemanticDiagnosticCode[] {
  return analyze(source).semantic.diagnostics.map((diagnostic) => diagnostic.code);
}

describe("Análisis semántico — programas válidos", () => {
  it("acepta declaraciones, tipos y flujo de control estándar", () => {
    const result = analyze(`
      let total: integer = 0;
      for (let i: integer = 0; i < 10; i = i + 1) {
        total = total + i;
      }
      print(total);
    `);

    expect(result.semantic.status).toBe("completed");
    expect(result.semantic.errors).toHaveLength(0);
    expect(result.accepted).toBe(true);
  });

  it("acepta clases con campos, herencia, this y métodos heredados", () => {
    const result = analyze(`
      class Animal {
        let nombre: string;
        function constructor(nombre: string) {
          this.nombre = nombre;
        }
        function hablar(): string {
          return this.nombre;
        }
      }
      class Perro: Animal {
        function ladrar(): string {
          return this.hablar();
        }
      }
      let p: Perro = new Perro("Toby");
      print(p.ladrar());
    `);

    expect(result.semantic.errors).toHaveLength(0);
    expect(result.accepted).toBe(true);
  });

  it("acepta recursión, closures y referencias adelantadas a funciones", () => {
    const result = analyze(`
      print(fact(5));

      function fact(n: integer): integer {
        if (n <= 1) { return 1; }
        return n * fact(n - 1);
      }

      function contador(): integer {
        let total: integer = 0;
        function incrementar(): integer {
          total = total + 1;
          return total;
        }
        incrementar();
        return incrementar();
      }

      print(contador());
    `);

    expect(result.semantic.errors).toHaveLength(0);
    expect(result.semantic.metrics.capturedVariableCount).toBeGreaterThan(0);
  });

  it("permite promoción de integer a float", () => {
    const result = analyze(`
      let x: float = 3;
      let y: float = x + 2;
      print(y);
    `);
    expect(result.semantic.errors).toHaveLength(0);
  });

  it("acepta arreglos homogéneos, foreach e indexación", () => {
    const result = analyze(`
      let nums: integer[] = [1, 2, 3];
      foreach (n in nums) {
        print(n);
      }
      print(nums[0]);
    `);
    expect(result.semantic.errors).toHaveLength(0);
  });
});

describe("Análisis semántico — catálogo SEM001 a SEM021", () => {
  it("SEM001: identificador no declarado", () => {
    expect(codesOf(`print(noExiste);`)).toContain("SEM001");
  });

  it("SEM002: redeclaración en el mismo ámbito", () => {
    expect(codesOf(`let x: integer = 1; let x: integer = 2;`)).toContain("SEM002");
  });

  it("SEM002: detecta funciones duplicadas aunque se haga hoisting", () => {
    expect(codesOf(`function f() { } function f() { }`)).toContain("SEM002");
  });

  it("SEM003: inicialización incompatible", () => {
    expect(codesOf(`let x: integer = "hola";`)).toContain("SEM003");
  });

  it("SEM003: no permite reasignar una constante", () => {
    expect(codesOf(`const x: integer = 1; x = 2;`)).toContain("SEM003");
  });

  it("SEM004: operador aplicado a tipos inválidos", () => {
    expect(codesOf(`let x: boolean = true; let y: integer = x - 1;`)).toContain("SEM004");
  });

  it("SEM005: condición de if no booleana", () => {
    expect(codesOf(`if (5) { print(1); }`)).toContain("SEM005");
  });

  it("SEM006: cantidad de argumentos incorrecta", () => {
    expect(codesOf(`function f(a: integer): integer { return a; } f(1, 2);`)).toContain("SEM006");
  });

  it("SEM007: argumento de tipo incompatible", () => {
    expect(codesOf(`function f(a: integer): integer { return a; } f("hola");`)).toContain("SEM007");
  });

  it("SEM008: retorno incompatible", () => {
    expect(codesOf(`function f(): integer { return "hola"; }`)).toContain("SEM008");
  });

  it("SEM009: return fuera de una función", () => {
    expect(codesOf(`return 1;`)).toContain("SEM009");
  });

  it("SEM010: break fuera de bucle o switch", () => {
    expect(codesOf(`break;`)).toContain("SEM010");
  });

  it("SEM011: continue fuera de un bucle", () => {
    expect(codesOf(`continue;`)).toContain("SEM011");
  });

  it("SEM012: miembro inexistente", () => {
    expect(codesOf(`class A { } let a: A = new A(); print(a.zzz);`)).toContain("SEM012");
  });

  it("SEM013: this fuera de una clase", () => {
    expect(codesOf(`print(this);`)).toContain("SEM013");
  });

  it("SEM014: clase no declarada", () => {
    expect(codesOf(`let b = new NoExiste();`)).toContain("SEM014");
  });

  it("SEM015: índice no entero", () => {
    expect(codesOf(`let nums: integer[] = [1,2,3]; print(nums["x"]);`)).toContain("SEM015");
  });

  it("SEM016: acceso por índice sobre un valor no indexable", () => {
    expect(codesOf(`let x: integer = 5; print(x[0]);`)).toContain("SEM016");
  });

  it("SEM017: arreglo con elementos incompatibles", () => {
    expect(codesOf(`let mixto = [1, "dos", true];`)).toContain("SEM017");
  });

  it("SEM018: código inalcanzable tras return", () => {
    expect(codesOf(`function f(): integer { return 1; print("nunca"); }`)).toContain("SEM018");
  });

  it("SEM019: parámetro duplicado", () => {
    expect(codesOf(`function f(a: integer, a: integer): integer { return a; }`)).toContain("SEM019");
  });

  it("SEM020: herencia circular o clase padre inexistente", () => {
    expect(codesOf(`class A: B { } class B: A { }`)).toContain("SEM020");
  });

  it("SEM021: discriminante de switch inválido", () => {
    expect(codesOf(`let nums: integer[] = [1]; switch (nums) { case 1: print(1); }`)).toContain("SEM021");
  });

  it("omite la fase semántica cuando el parser ya reportó errores", () => {
    const result = analyze(`let x: integer = ;`);
    expect(result.semantic.status).toBe("skipped");
    expect(result.semantic.diagnostics).toHaveLength(0);
  });
});

describe("Análisis semántico — regresiones del Proyecto 1", () => {
  it("registra campos y métodos dentro de la tabla de símbolos", () => {
    const result = analyze(`
      class Persona {
        let nombre: string = "Ana";
        const codigo: integer = 1;
        function saludar(): string { return this.nombre; }
      }
    `);

    expect(result.semantic.errors).toHaveLength(0);
    expect(result.semantic.symbols.some((symbol) => symbol.name === "nombre" && symbol.kind === "field")).toBe(true);
    expect(result.semantic.symbols.some((symbol) => symbol.name === "codigo" && symbol.kind === "field")).toBe(true);
    expect(result.semantic.symbols.some((symbol) => symbol.name === "saludar" && symbol.kind === "method")).toBe(true);
  });

  it("valida el tipo del inicializador de un campo de clase", () => {
    expect(codesOf(`class A { let n: integer = "texto"; }`)).toContain("SEM003");
  });

  it("rechaza un campo y un método con el mismo nombre en una clase", () => {
    expect(codesOf(`class A { let valor: integer; function valor(): integer { return 1; } }`)).toContain("SEM002");
  });

  it("valida el tipo del inicializador de un for", () => {
    expect(codesOf(`for (let i: integer = "cero"; i < 3; i = i + 1) { print(i); }`)).toContain("SEM003");
  });

  it("valida como booleana una única expresión ubicada como condición del for", () => {
    expect(codesOf(`for (; 1; ) { print(1); }`)).toContain("SEM005");
  });

  it("no permite reasignar un campo const", () => {
    expect(codesOf(`
      class A { const codigo: integer = 1; }
      let a: A = new A();
      a.codigo = 2;
    `)).toContain("SEM003");
  });

  it("rechaza el resultado directo de new como destino de asignación", () => {
    expect(codesOf(`class A { } new A() = new A();`)).toContain("SEM003");
  });

  it("registra ámbitos global, función, clase y bloque", () => {
    const result = analyze(`
      class A { function m() { let z: integer = 1; } }
      function f() {
        let a: integer = 1;
        if (a > 0) { let b: integer = 2; }
      }
    `);
    const kinds = result.semantic.scopes.map((scope) => scope.kind);
    expect(kinds).toContain("global");
    expect(kinds).toContain("function");
    expect(kinds).toContain("class");
    expect(kinds).toContain("block");
  });

  it("reinicia identificadores de diagnósticos entre ejecuciones", () => {
    const first = analyze(`print(noExiste);`);
    const second = analyze(`print(otro);`);
    expect(first.semantic.diagnostics[0]?.id).toBe("sem-diag-0");
    expect(second.semantic.diagnostics[0]?.id).toBe("sem-diag-0");
  });

  it("SEM023: distingue uso antes de inicialización de identificador no declarado", () => {
    const codes = codesOf(`let x: integer; print(x);`);
    expect(codes).toContain("SEM023");
    expect(codes).not.toContain("SEM001");
  });

  it("no reporta SEM023 cuando la primera operación sobre una variable es inicializarla por asignación", () => {
    const result = analyze(`let x: integer; x = 10; print(x);`);
    expect(result.semantic.diagnostics.map((d) => d.code)).not.toContain("SEM023");
    expect(result.semantic.errors).toHaveLength(0);
  });

  it("no interpreta una única expresión de actualización del for como condición", () => {
    const result = analyze(`
      let i: integer = 0;
      for (; ; i = i + 1) {
        if (i > 2) { break; }
      }
    `);
    expect(result.semantic.errors).toHaveLength(0);
    expect(result.semantic.diagnostics.map((d) => d.code)).not.toContain("SEM005");
  });
});

describe("Análisis semántico — cobertura explícita de requisitos", () => {
  it("acepta operaciones lógicas exclusivamente booleanas", () => {
    const result = analyze(`let ok: boolean = true && !false; print(ok);`);
    expect(result.semantic.errors).toHaveLength(0);
  });

  it("rechaza operandos no booleanos en operaciones lógicas", () => {
    expect(codesOf(`let ok: boolean = 1 && true;`)).toContain("SEM004");
  });

  it("acepta comparaciones numéricas compatibles y promoción", () => {
    const result = analyze(`let a: integer = 1; let b: float = 2.5; let ok: boolean = a < b;`);
    expect(result.semantic.errors).toHaveLength(0);
  });

  it("rechaza comparaciones relacionales entre tipos incompatibles", () => {
    expect(codesOf(`let ok: boolean = "a" < 2;`)).toContain("SEM004");
  });

  it("la gramática obliga a inicializar const antes de la semántica", () => {
    const result = analyze(`const x: integer;`);
    expect(result.syntaxErrors.length).toBeGreaterThan(0);
    expect(result.semantic.status).toBe("skipped");
  });

  it("permite shadowing en un ámbito hijo sin redeclarar el símbolo padre", () => {
    const result = analyze(`
      let x: integer = 1;
      {
        let x: string = "local";
        print(x);
      }
      print(x);
    `);
    expect(result.semantic.errors).toHaveLength(0);
    expect(result.semantic.symbols.filter((symbol) => symbol.name === "x")).toHaveLength(2);
  });

  it("resuelve variables globales desde una función", () => {
    const result = analyze(`
      let global: integer = 7;
      function leer(): integer { return global; }
      print(leer());
    `);
    expect(result.semantic.errors).toHaveLength(0);
    expect(result.semantic.symbols.find((symbol) => symbol.name === "global")?.references.length).toBeGreaterThan(0);
  });

  it("acepta break y continue dentro de ciclos", () => {
    const result = analyze(`
      let xs: integer[] = [1, 2];
      foreach (x in xs) {
        if (x == 1) { continue; }
        break;
      }
    `);
    expect(result.semantic.errors).toHaveLength(0);
  });

  it("acepta break dentro de switch", () => {
    const result = analyze(`
      let x: integer = 1;
      switch (x) {
        case 1: break;
        default: print(x);
      }
    `);
    expect(result.semantic.errors).toHaveLength(0);
  });

  it("rechaza condiciones no booleanas de while y do-while", () => {
    const codes = codesOf(`
      while (1) { break; }
      do { print(1); } while ("no");
    `);
    expect(codes.filter((code) => code === "SEM005").length).toBeGreaterThanOrEqual(2);
  });

  it("valida cantidad de argumentos del constructor", () => {
    expect(codesOf(`
      class A {
        function constructor(x: integer) { print(x); }
      }
      let a: A = new A();
    `)).toContain("SEM006");
  });

  it("valida tipo de argumentos del constructor", () => {
    expect(codesOf(`
      class A {
        function constructor(x: integer) { print(x); }
      }
      let a: A = new A("texto");
    `)).toContain("SEM007");
  });


  it("rechaza argumentos cuando solo existe el constructor implícito sin parámetros", () => {
    expect(codesOf(`
      class A { }
      let a: A = new A(1);
    `)).toContain("SEM006");
  });

  it("permite comparar null con referencias y rechaza null contra primitivos no anulables", () => {
    const valid = analyze(`
      class A { }
      let a: A = null;
      let ok: boolean = a == null;
    `);
    expect(valid.semantic.errors).toHaveLength(0);

    expect(codesOf(`let bad: boolean = 1 == null;`)).toContain("SEM004");
  });

  it("resuelve campos y métodos heredados", () => {
    const result = analyze(`
      class Base {
        let dato: integer = 1;
        function leer(): integer { return this.dato; }
      }
      class Hija: Base {
        function doble(): integer { return this.leer() * 2; }
      }
      let h: Hija = new Hija();
      print(h.dato);
      print(h.doble());
    `);
    expect(result.semantic.errors).toHaveLength(0);
  });

  it("rechaza un case incompatible con el discriminante", () => {
    expect(codesOf(`switch (1) { case "uno": print(1); }`)).toContain("SEM021");
  });

  it("rechaza operaciones aritméticas sobre funciones", () => {
    expect(codesOf(`
      function f(): integer { return 1; }
      let x = f * 2;
    `)).toContain("SEM004");
  });

  it("marca código inalcanzable después de break dentro de un ciclo", () => {
    expect(codesOf(`
      while (true) {
        break;
        print("nunca");
      }
    `)).toContain("SEM018");
  });

  it("marca código inalcanzable después de continue dentro de un ciclo", () => {
    expect(codesOf(`
      while (true) {
        continue;
        print("nunca");
      }
    `)).toContain("SEM018");
  });

  it("acepta return dentro de una función con tipo compatible", () => {
    const result = analyze(`function uno(): integer { return 1; } print(uno());`);
    expect(result.semantic.errors).toHaveLength(0);
  });

  it("crea ámbitos para loop, switch y catch", () => {
    const result = analyze(`
      let xs: integer[] = [1];
      foreach (x in xs) { print(x); }
      switch (1) { case 1: print(1); }
      try { print(1); } catch (err) { print(err); }
    `);
    const kinds = result.semantic.scopes.map((scope) => scope.kind);
    expect(kinds).toContain("loop");
    expect(kinds).toContain("switch");
    expect(kinds).toContain("catch");
  });
});

describe("Análisis semántico — ámbitos de clases e inferencia", () => {
  it("mantiene la exigencia oficial de bloques en estructuras de control", () => {
    const result = analyze(`if (true) print(1);`);
    expect(result.syntaxErrors.length).toBeGreaterThan(0);
    expect(result.semantic.status).toBe("skipped");
  });

  it("impide usar fuera del bloque una clase local", () => {
    const result = analyze(`
      { class Local { } }
      let dato: Local = new Local();
    `);
    expect(result.semantic.diagnostics.map((diagnostic) => diagnostic.code)).toContain("SEM001");
  });

  it("permite clases homónimas en ámbitos hermanos", () => {
    const result = analyze(`
      { class Nodo { let valor: integer = 1; } let a: Nodo = new Nodo(); }
      { class Nodo { let valor: string = "dos"; } let b: Nodo = new Nodo(); }
    `);
    expect(result.semantic.errors).toHaveLength(0);
    expect(result.semantic.symbols.filter((symbol) => symbol.name === "Nodo")).toHaveLength(2);
  });

  it("infiere campos antes de validar métodos aunque estén declarados después", () => {
    expect(codesOf(`
      class A {
        function valor(): integer { return this.texto; }
        let texto = "cadena";
      }
    `)).toContain("SEM008");
  });

  it("infiere el retorno de funciones sin anotación", () => {
    const result = analyze(`
      function uno() { return 1; }
      let valor: integer = uno();
    `);
    expect(result.semantic.errors).toHaveLength(0);
    expect(result.semantic.symbols.find((symbol) => symbol.name === "uno")?.returnType).toEqual({
      kind: "primitive",
      name: "integer"
    });
  });

  it("registra referencias de clases, campos y métodos", () => {
    const result = analyze(`
      class A {
        let x: integer = 1;
        function obtener(): integer { return this.x; }
      }
      let a: A = new A();
      print(a.obtener());
    `);
    for (const name of ["A", "x", "obtener"]) {
      expect(result.semantic.symbols.find((symbol) => symbol.name === name)?.references.length).toBeGreaterThan(0);
    }
  });
});
