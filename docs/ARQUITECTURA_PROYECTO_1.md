# Arquitectura del Compiscript Semantic IDE

## Vista general

```text
Fuente .cps
  |
  v
CompiscriptLexer ----------> tokens y errores léxicos
  |
  v
CommonTokenStream
  |
  v
CompiscriptParser.program() -> CST y errores sintácticos
  |
  | solo si lexer y parser son válidos
  v
ClassRegistry + hoisting por ámbito
  |
  v
SemanticAnalyzer (Visitor de ANTLR)
  |-- ScopeManager ----------> símbolos, referencias y ámbitos
  |-- declarationVisitor ---> clases, miembros, firmas y herencia
  |-- typeSystem -----------> asignabilidad, operadores e inferencia
  |-- flowAnalysis ---------> retornos y código inalcanzable
  |-- diagnostics ----------> SEM001..SEM023
  `-- ast ------------------> árbol semántico tipado
  |
  v
AnalyzeResult
  |-- React UI
  |-- CLI
  `-- exportaciones TXT, CSV y JSON
```

## Capas

### Orquestación

`src/lib/analyze.ts` crea el lexer, llena el token stream, ejecuta `program()` y decide si la fase semántica puede comenzar. UI, CLI y pruebas consumen el mismo `AnalyzeResult`; ninguna interfaz posee una versión alternativa de las reglas.

### Gramática

`src/grammars/Compiscript.g4` es la fuente de verdad. `src/generated/` se produce con `npm run generate`. La gramática activa conserva los bloques con llaves exigidos por la gramática oficial y añade el tipo/literal `float` requerido por el enunciado semántico.

### Prepasada de declaraciones

`src/semantic/declarationVisitor.ts` construye un `ClassRegistry` con dos índices:

- `byContext`, para asociar cada nodo ANTLR con su clase exacta;
- `byId`, para consultar una declaración sin confundir clases homónimas.

Cada clase recibe un `classId` estable. El nombre visible se publica como símbolo en el ámbito correspondiente y se resuelve léxicamente. La prepasada crea esqueletos antes de enlazar padres y recolectar miembros, lo que permite referencias adelantadas e impide que una clase local se filtre al ámbito global.

### Recorrido semántico

`src/semantic/semanticVisitor.ts` extiende `AbstractParseTreeVisitor` e implementa el Visitor generado. El análisis se organiza en dos pasos por ámbito:

1. hoisting de clases y funciones;
2. recorrido de instrucciones y expresiones.

Los nodos de expresión devuelven tipo, nodo semántico y metadatos de asignación o invocación. Así se evita construir un segundo parser y se conserva la ubicación original de ANTLR.

Los campos de una clase se analizan antes que sus métodos, aunque aparezcan después en el archivo. Con ello, un método puede usar el tipo inferido de cualquier campo sin depender del orden textual. Los resultados vuelven a ordenarse para que el árbol presentado respete el programa fuente.

### Tipos

`semanticTypes.ts` define la representación algebraica de tipos y `typeSystem.ts` centraliza igualdad, asignabilidad, promoción numérica, comparabilidad y resultados de operadores. Las instancias llevan `classId`; por ello dos clases homónimas de bloques distintos no son intercambiables.

Una función sin anotación comienza con retorno `unknown`. Sus instrucciones `return` alimentan `observedReturnTypes` y, al finalizar el cuerpo, se infiere un tipo común. El símbolo y la firma de método se actualizan de forma controlada.

### Tabla de símbolos

`src/semantic/scopes.ts` encapsula los ámbitos y garantiza estas invariantes:

- `declare` solo inserta en el ámbito activo;
- `resolveCurrent` no cruza el límite del ámbito;
- `resolve` recorre padres hasta el global;
- `updateSymbol` modifica datos permitidos sin cambiar identidad, nombre, ámbito o ubicación de declaración;
- `enterScope` y `exitScope` conservan el árbol de entornos;
- `markInitialized` y `markCaptured` reutilizan la actualización controlada.

Las referencias a variables, clases, campos y métodos incrementan el contador del símbolo real. Una captura se registra cuando una función usa un símbolo declarado en una función externa.

### Flujo y diagnósticos

`flowAnalysis.ts` reconoce terminaciones directas y retornos en todos los caminos relevantes. `diagnostics.ts` produce mensajes serializables con código, severidad y posición. Los IDs se reinician por ejecución y los diagnósticos equivalentes se deduplican.

### Presentación

`src/ui/App.tsx` orquesta un IDE con barra de menú, barra de herramientas, barra lateral, editor con pestañas, panel de problemas y dock derecho. La fase semántica utiliza:

- `ActivitySidebar`, con `ExamplesExplorer` y `CompilerGuide`;
- `EditorTabs`, con `CodeEditor` basado en Monaco para edición y resaltado;
- `ProblemsPanel`, que agrupa diagnósticos léxicos, sintácticos y semánticos;
- `RightDock`, que organiza `ResultOverviewPanel`, `SymbolTablePanel`, `ScopeTreePanel`, `ParseTreePanel`, `TestsPanel`, `DocumentationPanel` y `ExportsPanel`;
- `StatusBar` y `CommandPalette` para estado y acciones rápidas.

La capa visual vigente adopta un lenguaje neobrutalista: fondo crema, superficies blancas o amarillas, bordes negros de dos píxeles, esquinas rectas y sombras sólidas desplazadas. Las ilustraciones documentales `compiler-pipeline-neobrutalist.png` y `scopes-symbol-table-neobrutalist.png` reproducen esa misma jerarquía visual como referencias conceptuales; no pretenden ser capturas literales de la aplicación.

La interfaz no decide si un programa es válido. Su responsabilidad es explicar resultados ya calculados por el motor.

## Invariantes del sistema

1. El lexer puede ejecutarse de forma independiente.
2. La semántica no corre si lexer o parser tienen errores.
3. Los archivos generados por ANTLR no se editan manualmente.
4. Toda declaración de clase tiene identidad independiente de su nombre.
5. La resolución de nombres siempre parte del ámbito activo.
6. UI y CLI ejecutan el mismo pipeline.
7. Los resultados de una corrida no contaminan la siguiente.

## Estrategia de pruebas

`src/__tests__/semantic/semanticAnalyzer.test.ts` contiene programas de éxito, un caso por diagnóstico y regresiones de flujo, clases, funciones y arreglos. `scopeManager.test.ts` prueba de forma directa inserción, recuperación, actualización y manejo de alcances, que son operaciones explícitas de la rúbrica.

Las suites adicionales verifican el pipeline general, los archivos de ejemplo, los casos de rúbrica y los casos predeterminados que expone `TestsPanel`. `lexer.test.ts` y `parser.test.ts` mantienen testers identificables por fase; `testCases.defaults.test.ts` garantiza que los casos integrados en la interfaz produzcan el resultado esperado. La versión actual ejecuta **115 pruebas en 7 suites**.

La aplicación se empaqueta con Electron Builder. `exe:portable` genera Windows x64; `exe:mac` produce ZIP y DMG sin firma para Intel y Apple Silicon; `exe:linux` produce AppImage x64. Los targets macOS se construyen en macOS o en un runner macOS; Linux se construye de forma nativa, mediante WSL o Docker para conservar permisos y enlaces simbólicos. El último corte portable publicado es el [release V1.2.0](https://github.com/DanielBarillasM/Proyecto-01_CDC_seccion-10_Grupo-DragonsSlayers-2.0/releases/tag/Compiscript-Semantic-IDE-V1.2.0), mientras que `main` conserva las incorporaciones multiplataforma posteriores al tag.

## Extensión futura

La separación entre tipos, símbolos, flujo y presentación permite añadir una representación intermedia o intérprete sin mover reglas a la UI. La tabla ya conserva información útil para fases posteriores: tipo, categoría, mutabilidad, inicialización, firma, referencias y captura.
