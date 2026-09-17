# Auditoría técnica del Proyecto 1

**Última verificación:** 30 de agosto de 2026, sobre `main` en el commit `4d93279`, tras incorporar el panel de pruebas del IDE y el empaquetado macOS/Linux.

## Resultado ejecutivo

La revisión contrastó el proyecto con el README del lenguaje, la gramática ANTLR, los requisitos de análisis semántico y la rúbrica proporcionada. Se conservó la arquitectura real React + Vite + TypeScript + Electron y se corrigieron defectos de semántica, gramática, casos integrados, experiencia de uso y documentación.

Estado final verificado:

- `npm run check`: aprobado;
- `npm test`: 115 de 115 pruebas aprobadas en 7 suites (lexer, parser, casos del panel, semántica x3 y rúbrica);
- `npm run build`: aprobado;
- parser regenerado desde la gramática activa;
- presentación HTML con 17 diapositivas y dos ilustraciones locales;
- informe LaTeX y matriz de requisitos añadidos.
- [release V1.2.0](https://github.com/DanielBarillasM/Proyecto-01_CDC_seccion-10_Grupo-DragonsSlayers-2.0/releases/tag/Compiscript-Semantic-IDE-V1.2.0) enlazado como último corte portable publicado.

## Hallazgos y correcciones

| Prioridad | Área | Hallazgo | Corrección | Evidencia |
| --- | --- | --- | --- | --- |
| Crítica | Clases y ámbitos | Las clases se consultaban desde un registro global por nombre; una clase local podía verse fuera del bloque y nombres iguales colisionaban entre ámbitos hermanos. | Cada declaración recibe `classId`; el nombre se declara y resuelve mediante `ScopeManager`. | Regresiones de clase local y clases homónimas. |
| Alta | Tipos de instancia | La igualdad usaba únicamente el nombre textual de la clase. | Los tipos de clase e instancia conservan la identidad de declaración. | Clases hermanas no se confunden. |
| Alta | Inferencia de campos | Un método podía usar un campo antes de que su inicializador fuera analizado, haciendo el resultado dependiente del orden. | Se procesan campos antes que métodos y se restaura el orden del árbol presentado. | Regresión de campo declarado después del método. |
| Alta | Retornos | Las funciones sin anotación se trataban como `void`. | Se recopilan retornos observados, se calcula un tipo común y se actualiza la firma. | Regresión de retorno `integer` inferido. |
| Alta | Referencias | Accesos a clases, campos y métodos no actualizaban todos los contadores. | Miembros conservan `symbolId` y cada resolución registra la referencia real. | Prueba de referencias de clase/campo/método. |
| Alta | Tabla de símbolos | No existía una operación pública y acotada para demostrar actualización. | Se añadió `updateSymbol` con invariantes de identidad y se reutiliza en inicialización/captura. | Suite directa de `ScopeManager`. |
| Alta | Gramática | La gramática activa aceptaba instrucciones sin bloque en estructuras de control, a diferencia del archivo oficial adjunto. | `if`, ciclos y `foreach` vuelven a requerir `block`; se regeneró ANTLR. | Prueba sintáctica de llaves obligatorias. |
| Alta | Ejemplos | El ejemplo integral y el caso de recursión usaban `if` sin llaves, por lo que fallaron después de alinear la gramática. | Se actualizaron ejemplos, fixture integrado y prueba de recursión. | Suite integral aprobada. |
| Media | UI | Editor, gramática y resultados extensos competían en una pila difícil de leer. | Workbench con guía lateral, gramática plegable, editor dominante y explorador por pestañas. | Build de Vite y revisión de componentes. |
| Media | UI | Faltaban acciones y señales básicas del editor. | Copia con confirmación, indicador de preparación, guía de atajos y estados del pipeline. | `EditorTabs`, `CompilerGuide`, `MenuBar`. |
| Media | Documentación | El README indicaba ejecutar npm desde la raíz, aunque `package.json` está en la subcarpeta. | Comandos y estructura corregidos; se añadieron matriz, informe y presentación. | Documentos vigentes enlazados. |
| Media | Presentación | No existía un material autocontenido para explicar diseño, teoría y demostración. | Presentación HTML navegable, imprimible y con notas del expositor. | `presentation/compiscript-proyecto-1.html`. |
| Baja | Estilo | Había emojis en documentación heredada y elementos decorativos de la UI. | Se eliminan emojis del texto fuente; la UI utiliza iconos vectoriales consistentes. | Búsqueda Unicode final. |

## Decisiones conservadas

### Tipo `float`

El requisito semántico lo exige aunque la gramática base no lo incluya. Se mantiene como extensión explícita con literal decimal y promoción segura `integer -> float`.

### `switch`

Se conserva el discriminante escalar porque el ejemplo oficial utiliza `case 1` y la gramática acepta cualquier expresión. Cada caso debe ser comparable con el discriminante; los valores no escalares producen `SEM021`.

### Cascadas entre fases

Si lexer o parser producen errores, el análisis semántico no se ejecuta. Esta política evita fabricar errores sobre un CST incompleto.

### `break` y `continue`

`break` se permite en ciclos y `switch`; `continue` solo en ciclos. Es coherente con la estructura de control de lenguajes de la familia C/TypeScript.

## Distribución de pruebas

| Archivo | Fase | Cantidad |
| --- | --- | ---: |
| `semantic/semanticAnalyzer.test.ts` | semántico | 68 |
| `semantic/scopeManager.test.ts` | semántico | 4 |
| `semantic/projectExamples.test.ts` | semántico | 8 |
| `lexer.test.ts` | léxico | 5 |
| `parser.test.ts` | sintáctico | 9 |
| `rubric.examples.test.ts` | léxico + sintáctico | 8 |
| `testCases.defaults.test.ts` | los tres + rúbrica | 13 |
| Total | | 115 |

Las pruebas semánticas incluyen programas válidos, diagnósticos `SEM001`–`SEM023`, flujo, arreglos, funciones, closures, herencia, constructores, identidad de clases, inferencia y referencias. La suite de ejemplos garantiza además que los archivos de exposición siguen siendo ejecutables y producen sus códigos documentados. Las pruebas directas de tabla de símbolos demuestran las cuatro operaciones solicitadas en la rúbrica: insertar, recuperar, actualizar y manejar alcances.

## Build

El build de producción transforma 3368 módulos y finaliza correctamente. Vite advierte que el chunk JavaScript principal supera 500 kB; es una recomendación de optimización, no un error funcional. El volumen proviene de Monaco Editor, que se empaqueta localmente para funcionar sin CDN.

## Empaquetado multiplataforma

`npm run exe:portable` genera el portable Windows x64; `npm run exe:mac` genera ZIP y DMG sin firma para Intel y Apple Silicon; `npm run exe:linux` genera AppImage x64. Los paquetes macOS se producen en una Mac o runner macOS. El AppImage puede generarse en Linux, WSL o Docker; el intento directo sobre NTFS puede fallar por permisos de enlaces simbólicos. El arranque de la aplicación fue verificado en macOS arm64 mediante Electron directo y en Linux arm64 dentro de un contenedor con Xvfb. Los avisos de D-Bus en entornos mínimos no afectan el IDE. Si un AppImage ejecutado en un sistema mínimo informa que falta `libz.so`, debe instalarse o exponerse la variante de desarrollo de zlib; los escritorios Linux habituales ya la proporcionan.

El [release V1.2.0](https://github.com/DanielBarillasM/Proyecto-01_CDC_seccion-10_Grupo-DragonsSlayers-2.0/releases/tag/Compiscript-Semantic-IDE-V1.2.0) es el último corte portable publicado. El panel de pruebas y el empaquetado macOS/Linux pertenecen a commits posteriores de `main`, por lo que deben compilarse desde el código fuente vigente si se necesita exactamente esa versión.

## Límite de esta auditoría

La autoría individual solo puede verificarse en el historial real de Git. No se modificaron commits ni se atribuyeron contribuciones desde la documentación. Ese criterio debe revisarse manualmente antes de la entrega, tal como exige el enunciado.
