# Diseño del TAC de Compiscript

## Objetivo

El módulo `src/tac` transforma el resultado semántico validado en código de tres direcciones determinista. La generación se bloquea cuando existen errores léxicos, sintácticos o semánticos para evitar producir código engañoso.

## Pipeline

1. `analyzeInput()` ejecuta lexer y parser.
2. El visitante semántico construye símbolos, ámbitos y diagnósticos.
3. `generateTac()` recibe únicamente un árbol aceptado y emite instrucciones tipadas.
4. El resultado expone código formateado, instrucciones, métricas y marcos de activación.
5. La interfaz permite inspeccionar, filtrar y exportar TAC.

## Modelo de instrucciones

Cada instrucción contiene `index`, `op`, operandos opcionales, ámbito y posición de origen. Los operandos distinguen literales, símbolos, temporales y etiquetas. Las operaciones de control usan `LABEL`, `GOTO`, `IF_FALSE` e `IF_TRUE`; las operaciones de datos usan `MOV`, `ADD`, `SUB`, `MUL`, `DIV`, `MOD`, comparaciones y operaciones unarias. El generador también representa arrays, objetos, propiedades, `switch`, `try/catch`, llamadas y cortocircuito lógico.

Las llamadas siguen la convención `PARAM` → `CALL` → `RETURN`. Las funciones se delimitan con `FUNC_BEGIN` y `FUNC_END`. Los arreglos y accesos indexados conservan operandos separados para que una etapa posterior pueda seleccionar la representación final.

## Temporales y etiquetas

`TemporaryAllocator` asigna nombres estables (`t0`, `t1`, ...), permite liberar temporales y registra reutilización. `LabelFactory` produce etiquetas deterministas por categoría y se reinicia por generación para que dos ejecuciones sobre el mismo programa sean comparables.

## Marcos de activación

Cada función tiene un `ActivationRecord` con identificador, ámbito, slots, offsets y tamaño total. Los símbolos locales y parámetros pueden asociarse a un slot con `frameId` y `offset`; esta información queda disponible para backend y exportaciones.

## Inspección y exportación

La pestaña TAC muestra métricas, búsqueda textual y filtro por opcode. Las acciones de exportación producen:

- `.tac`: código formateado legible.
- `.csv`: instrucciones con operandos, ámbito, frame y ubicación fuente.
- reporte `.txt`: métricas, código y resumen de marcos.

## Garantías

- Determinismo entre ejecuciones.
- Ningún TAC si la fase semántica fue omitida.
- Tipos estrictos para instrucciones, operandos y frames.
- Pruebas de generación, bloqueo, reutilización y exportación.

## Alcance actual y límites

El resultado TAC incluye metadatos de almacenamiento abstracto para símbolos (`frameId`, `offset`, tamaño y alineación), slots capturados para funciones anidadas y layouts iniciales de clases con offsets deterministas. La representación permanece independiente de máquina: no asigna direcciones físicas ni ejecuta el programa.

Las operaciones complejas se conservan como instrucciones intermedias (`ARRAY_GET`, `ARRAY_SET`, `GET_FIELD`, `SET_FIELD`, `NEW_OBJECT`, `TRY_BEGIN`, `CATCH_BEGIN`) para que el backend pueda aplicar posteriormente reglas específicas del runtime sin modificar el frontend del compilador.
