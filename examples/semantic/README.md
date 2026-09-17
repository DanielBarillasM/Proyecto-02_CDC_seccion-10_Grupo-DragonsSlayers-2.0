# Ejemplos verificables del Proyecto 1

Estos programas están diseñados para la fase de análisis semántico. Todos poseen sintaxis válida: los archivos `errors_*.cps` fallan únicamente por las reglas indicadas y no por errores del lexer o parser.

## Casos de demostración

| Archivo | Propósito | Resultado esperado |
| --- | --- | --- |
| `valid_complete.cps` | Lenguaje completo: tipos, inferencia, recursión, closure, clases, herencia, arreglos y todo el flujo de control | Aceptado, sin diagnósticos |
| `symbol_table_demo.cps` | Inserción, recuperación, actualización, shadowing, referencias, ámbitos y variables capturadas | Aceptado, con tabla poblada |
| `semantic_errors.cps` | Demostración rápida con errores variados en un único archivo | Rechazado semánticamente |

## Casos por categoría de la rúbrica

| Archivo | Reglas comprobadas | Códigos mínimos esperados |
| --- | --- | --- |
| `errors_types.cps` | Asignación, constantes, operadores, condiciones y arreglos homogéneos | `SEM003`, `SEM004`, `SEM005`, `SEM017` |
| `errors_scopes.cps` | Nombre inexistente, redeclaración, parámetros y uso antes de inicialización | `SEM001`, `SEM002`, `SEM019`, `SEM023` |
| `errors_functions.cps` | Sobrecarga no soportada, aridad, argumentos, retorno, invocación y `return` contextual | `SEM002`, `SEM006`, `SEM007`, `SEM008`, `SEM009`, `SEM014` |
| `errors_flow.cps` | Condiciones, `break`, `continue`, código muerto y `switch` | `SEM005`, `SEM010`, `SEM011`, `SEM018`, `SEM021` |
| `errors_classes.cps` | Miembros, `this`, constructor, clases inexistentes, constantes y herencia | `SEM003`, `SEM006`, `SEM007`, `SEM012`, `SEM013`, `SEM014`, `SEM020` |
| `errors_arrays.cps` | Homogeneidad, tipo del índice y receptor indexable | `SEM015`, `SEM016`, `SEM017` |

`SEM022` está reservado por diseño y no representa una regla activa del enunciado. Por ello no se fabrica un ejemplo artificial para producirlo.

## Ejecución manual

Desde `compiscript-ide-work`:

```bash
npm run cli -- examples/semantic/valid_complete.cps --mode semantic
npm run cli -- examples/semantic/symbol_table_demo.cps --mode semantic
npm run cli -- examples/semantic/errors_types.cps --mode semantic
npm run cli -- examples/semantic/errors_scopes.cps --mode semantic
npm run cli -- examples/semantic/errors_functions.cps --mode semantic
npm run cli -- examples/semantic/errors_flow.cps --mode semantic
npm run cli -- examples/semantic/errors_classes.cps --mode semantic
npm run cli -- examples/semantic/errors_arrays.cps --mode semantic
```

También existen los atajos:

```bash
npm run cli:semantic-valid
npm run cli:semantic-errors
npm run cli:semantic-symbols
```

## Validación automatizada

La suite `src/__tests__/semantic/projectExamples.test.ts` comprueba que:

1. los dos ejemplos válidos terminan sin diagnósticos;
2. los seis casos fallidos no contienen errores léxicos ni sintácticos;
3. cada archivo produce los códigos semánticos declarados en esta tabla;
4. el caso de tabla de símbolos genera referencias, ámbitos, actualización de tipo y al menos dos capturas de closure.

Ejecutar únicamente esta suite:

```bash
npm run test:examples
```

Esta distribución permite presentar una regla aislada sin buscarla dentro de un archivo masivo y, a la vez, conserva un programa integral para la demostración general del IDE.
