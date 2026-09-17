# Casos oficiales de la rubrica

Esta carpeta contiene una matriz reproducible de los ocho casos solicitados en la
rubrica del Laboratorio 01. Los cuatro archivos de `low` incluyen tres tipos de
variables, una constante, operaciones con operadores distintos, un condicional, un
ciclo `while` y un `foreach`.

Los cuatro archivos de `medium` contienen lo anterior y agregan un arreglo usado,
dos clases, dos objetos instanciados, dos funciones declaradas y dos llamadas a
funciones.

| Caso | Archivo | Resultado esperado |
| --- | --- | --- |
| 1 | `low/valid.cps` | 0 errores |
| 2 | `low/lexer_errors.cps` | 3 o mas errores lexicos |
| 3 | `low/parser_errors.cps` | 3 o mas errores sintacticos |
| 4 | `low/lexer_parser_errors.cps` | 2 o mas errores de cada fase |
| 5 | `medium/valid.cps` | 0 errores |
| 6 | `medium/lexer_errors.cps` | 3 o mas errores lexicos |
| 7 | `medium/parser_errors.cps` | 3 o mas errores sintacticos |
| 8 | `medium/lexer_parser_errors.cps` | 2 o mas errores de cada fase |

Ejecute cualquier caso desde la raiz, por ejemplo:

```bash
npm run cli -- examples/rubric/low/valid.cps
npm run cli -- examples/rubric/medium/lexer_parser_errors.cps
```

Los casos validos finalizan con codigo `0`; los casos con errores finalizan con
codigo `1`, que representa un rechazo esperado del analizador.
