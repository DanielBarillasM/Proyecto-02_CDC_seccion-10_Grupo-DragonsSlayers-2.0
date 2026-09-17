# Matriz de trazabilidad de requisitos

Esta matriz contrasta el enunciado de análisis semántico con la implementación entregada. “Cubierto” significa que existe lógica concreta y al menos una prueba automatizada o una verificación de integración asociada.

## Reglas semánticas

| Área | Requisito del enunciado | Implementación | Evidencia automatizada | Estado |
| --- | --- | --- | --- | --- |
| Tipos | Operaciones aritméticas numéricas | `typeSystem.ts`, `semanticVisitor.ts` | casos válidos, `SEM004`, funciones como operandos | Cubierto |
| Tipos | Operaciones lógicas booleanas | `typeSystem.ts` | aceptación y rechazo de operandos lógicos | Cubierto |
| Tipos | Comparaciones compatibles | `typeSystem.ts` | comparación numérica y comparación incompatible | Cubierto |
| Tipos | Asignación compatible | `semanticVisitor.ts` | `SEM003`, promoción `integer -> float` | Cubierto |
| Tipos | Inicialización de constantes | gramática y Visitor | rechazo sintáctico de `const` sin valor y reasignación | Cubierto |
| Tipos | Elementos homogéneos en listas | `commonType`, análisis de literales | `SEM017` y arreglo válido | Cubierto |
| Ámbitos | Resolución local/global | `ScopeManager.resolve` | acceso global desde función y prueba directa de padres | Cubierto |
| Ámbitos | Variable no declarada | resolución de identificadores | `SEM001` | Cubierto |
| Ámbitos | Redeclaración en el mismo entorno | `ScopeManager.declare` | `SEM002` y prueba directa | Cubierto |
| Ámbitos | Acceso desde bloques anidados | cadena de ámbitos | shadowing y restauración al salir | Cubierto |
| Ámbitos | Entornos de función, clase y bloque | `enterScope`/`exitScope` | inspección de ámbitos; loop, switch y catch | Cubierto |
| Funciones | Cantidad y tipo de argumentos | validación de firmas | `SEM006` y `SEM007` | Cubierto |
| Funciones | Tipo de retorno | contexto de función e inferencia | `SEM008`, retorno válido y retorno inferido | Cubierto |
| Funciones | Recursión | hoisting de declaraciones | programa recursivo válido | Cubierto |
| Funciones | Funciones anidadas y closures | marca `captured` | programa con closure válido | Cubierto |
| Funciones | Funciones duplicadas sin sobrecarga | declaración por ámbito | duplicado con hoisting, `SEM002` | Cubierto |
| Flujo | Condiciones booleanas | análisis de `if` y ciclos | `SEM005`, `while`, `do-while`, `for` | Cubierto |
| Flujo | Uso contextual de `break` y `continue` | pila de contextos | `SEM010`, `SEM011` y usos válidos | Cubierto |
| Flujo | `return` dentro de función | contexto de función | `SEM009` y retorno válido | Cubierto |
| Clases | Existencia de atributos y métodos | registro y búsqueda heredada | `SEM012`, miembros propios y heredados | Cubierto |
| Clases | Llamada correcta al constructor | firma explícita o implícita | aridad y tipo del constructor | Cubierto |
| Clases | Uso contextual de `this` | contexto de clase | clase válida y `SEM013` | Cubierto |
| Listas | Tipo de elementos | unificación de tipos | arreglo homogéneo y `SEM017` | Cubierto |
| Listas | Índices válidos | validación de receptor e índice | `SEM015` y `SEM016` | Cubierto |
| General | Código muerto | `flowAnalysis.ts` | después de `return`, `break` y `continue` | Cubierto |
| General | Expresiones con sentido | reglas de operadores e invocación | operación aritmética sobre función | Cubierto |
| General | Declaraciones y parámetros duplicados | tabla y firmas | `SEM002` y `SEM019` | Cubierto |

## Requisitos de construcción

| Requisito | Evidencia | Estado |
| --- | --- | --- |
| Parser generado | `src/grammars/Compiscript.g4` y `src/generated/` | Cubierto |
| Recorrido con Visitor | `SemanticAnalyzer` implementa el Visitor generado por ANTLR | Cubierto |
| Árbol con representación visual | CST y árbol semántico tipado en el explorador de resultados | Cubierto |
| Batería de casos exitosos y fallidos | `src/__tests__/`, `examples/semantic/` y `projectExamples.test.ts` | Cubierto |
| Tabla de símbolos | `semantic/scopes.ts`, tabla, referencias y árbol de ámbitos | Cubierto |
| IDE para escribir y compilar | React/Vite, editor, análisis y exportaciones | Cubierto |
| Arquitectura y ejecución documentadas | README, arquitectura, decisiones, auditoría e informe | Cubierto |
| Repositorio y contribuciones | El historial de Git es la única fuente válida de autoría | Revisión manual |

## Evidencia específica de la tabla de símbolos

La rúbrica mostrada solicita demostrar cuatro operaciones. Se cubren de esta forma:

| Operación | API o comportamiento | Prueba |
| --- | --- | --- |
| Insertar | `ScopeManager.declare` | “inserta y recupera símbolos del ámbito activo” |
| Recuperar | `resolveCurrent` y `resolve` | pruebas de ámbito activo y resolución de padres |
| Actualizar | `updateSymbol`, `markInitialized`, `markCaptured` | “actualiza información sin cambiar la identidad” |
| Manejar alcances | `enterScope`, `exitScope`, shadowing | “resuelve padres, permite shadowing y restaura el ámbito” |

El archivo `examples/semantic/symbol_table_demo.cps` permite observar estas operaciones desde la UI o CLI. La suite de ejemplos comprueba que el símbolo `pendiente` cambia a inicializado, que la firma inferida de `incrementar` se actualiza a `integer`, que se registran referencias y que las variables del closure quedan capturadas.

## Diferencia interpretativa de `switch`

El enunciado incluye `switch` en la lista de condiciones booleanas, pero el README oficial muestra `switch (x)` con `case 1`, y la gramática acepta cualquier `expression`. Se adopta el comportamiento del lenguaje mostrado: discriminante escalar y casos comparables. Esta política se valida con `SEM021` y se explica en `DECISIONES_SEMANTICAS.md`.

## Criterio de mantenimiento

Cada cambio futuro de una regla debe actualizar tres elementos en conjunto: implementación, prueba de éxito/fallo y esta matriz. Así se evita declarar cobertura únicamente desde la documentación.
