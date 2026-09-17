# Documentación del Proyecto 1

Esta carpeta contiene únicamente documentos vigentes de la fase de análisis semántico.

| Documento | Uso recomendado |
| --- | --- |
| `ARQUITECTURA_PROYECTO_1.md` | Comprender módulos, pipeline, identidades de clase y tabla de símbolos |
| `DECISIONES_SEMANTICAS.md` | Justificar `float`, `switch`, ámbitos, inferencia y otras políticas |
| `AUDITORIA_PROYECTO_1.md` | Revisar bugs encontrados, correcciones y evidencia final |
| `MATRIZ_REQUISITOS.md` | Relacionar cada regla del enunciado con implementación y pruebas |
| `informe/INFORME_PROYECTO_01.tex` | Fuente editable del informe académico |
| `informe/INFORME_PROYECTO_01.pdf` | Informe compilado listo para entregar |
| `../presentation/compiscript-proyecto-1.html` | Presentación interactiva para la exposición |
| [Release V1.2.0](https://github.com/DanielBarillasM/Proyecto-01_CDC_seccion-10_Grupo-DragonsSlayers-2.0/releases/tag/Compiscript-Semantic-IDE-V1.2.0) | Último corte portable publicado para Windows |

Los documentos del Laboratorio 1, copias del enunciado y resúmenes históricos se retiraron para evitar que se confundan con el alcance actual.

Para casos ejecutables y trazables consulte `../examples/semantic/README.md`.

## Estado documental verificado

La documentación toma como base funcional el commit `4d93279` de `main`, verificado el 30 de agosto de 2026. En ese estado, TypeScript y el build terminan correctamente, Vite transforma **3368 módulos** y Vitest ejecuta **115 pruebas en 7 suites**. Un commit documental posterior no invalida esta referencia mientras no cambie la implementación; si cambia el código, las cifras de la auditoría, el informe, la presentación y el README deben actualizarse en conjunto.

El [release V1.2.0](https://github.com/DanielBarillasM/Proyecto-01_CDC_seccion-10_Grupo-DragonsSlayers-2.0/releases/tag/Compiscript-Semantic-IDE-V1.2.0) es el corte portable más reciente publicado. `main` incluye cambios posteriores al tag, específicamente el panel de pruebas del IDE, testers separados de lexer y parser, casos configurables y empaquetado para macOS/Linux.

## Recursos visuales vigentes

Las ilustraciones de referencia adaptadas al estilo neobrutalista actual se encuentran en:

- `../presentation/assets/compiler-pipeline-neobrutalist.png`;
- `../presentation/assets/scopes-symbol-table-neobrutalist.png`.

Son diagramas conceptuales para documentación y exposición, no capturas de pantalla ni evidencia de ejecución. Las imágenes anteriores se conservan como material histórico y respaldo.
