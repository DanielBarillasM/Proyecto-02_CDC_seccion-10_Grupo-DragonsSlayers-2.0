# Decisiones semánticas de Compiscript — Proyecto 1

Este documento registra las decisiones tomadas al evolucionar el Laboratorio 1 hacia la fase de análisis semántico. La intención es que cualquier diferencia entre el enunciado, el README del lenguaje y la gramática quede explícita y sea reproducible.

## 1. Pipeline por fases

El IDE ejecuta las fases en este orden:

1. lexer generado por ANTLR;
2. parser generado por ANTLR;
3. análisis semántico sobre el CST válido.

La fase semántica **no se ejecuta** cuando existen errores léxicos o sintácticos. Esto evita que la recuperación de errores del parser origine diagnósticos semánticos en cascada sobre nodos incompletos.

## 2. Uso de Visitors / recorrido del CST

La implementación semántica recorre los contextos generados por ANTLR desde `semanticVisitor.ts`. El recorrido conserva el CST del parser y construye en paralelo un árbol semántico anotado con tipo inferido, símbolo, ámbito y códigos de diagnóstico.

`SemanticAnalyzer` extiende `AbstractParseTreeVisitor` e implementa el `CompiscriptVisitor` generado. `program` y cada `statement` entran por el despacho `accept(visitor)` de ANTLR; los helpers de expresiones devuelven además el tipo inferido y el nodo semántico para evitar un parser paralelo.

## 3. `float` como extensión explícita

El documento de requisitos de análisis semántico exige verificar operaciones aritméticas con operandos `integer` o `float`. La gramática base entregada no contenía un token/tipo `float` ni literales decimales.

Para poder cumplir esa regla, la gramática del proyecto incorpora de forma mínima:

```antlr
FLOAT_TYPE : 'float';
FloatLiteral : [0-9]+ '.' [0-9]+;
```

Además se permite promoción segura `integer -> float` en asignaciones y operaciones numéricas. No se permite la conversión implícita inversa `float -> integer`.

## 4. Política de `switch`

Los requisitos describen `switch` junto a las estructuras cuyas condiciones deben ser booleanas, pero los ejemplos oficiales del lenguaje utilizan `switch (x)` con casos enteros. Para mantener coherencia con la sintaxis y comportamiento mostrado por Compiscript, el analizador acepta como discriminante de `switch`:

- `integer`;
- `float` cuando sea comparable con el caso;
- `string`;
- `boolean`.

Los valores de `case` deben ser comparables con el tipo del discriminante. Arreglos, funciones, clases y otros valores no escalares generan `SEM021`.

## 5. Operador `+`

`+` acepta:

- `integer + integer`;
- combinaciones numéricas `integer/float`, con resultado `float` si participa un `float`;
- `string + string` para concatenación.

No se convierten implícitamente números, booleanos u objetos a `string`.

## 6. Nulos y asignabilidad

`null` puede asignarse a referencias de instancia y arreglos. Los tipos primitivos (`integer`, `float`, `boolean`, `string`) no reciben `null` implícitamente. En igualdad (`==`/`!=`), `null` solo es comparable con otro `null`, un arreglo o una instancia; no funciona como comodín para primitivos.

## 7. Ámbitos y shadowing

Se crean ámbitos para:

- global;
- funciones/métodos;
- clases;
- bloques;
- ciclos;
- `switch`;
- `catch`.

La redeclaración del mismo identificador en el mismo ámbito está prohibida (`SEM002`). El shadowing en un ámbito hijo se permite porque representa una declaración distinta dentro de un entorno léxico diferente.

## 8. Hoisting de funciones y clases

Las funciones y clases se registran antes de visitar las instrucciones de su ámbito. Esto permite:

- recursión;
- referencias adelantadas a funciones;
- funciones anidadas que se invoquen antes de su declaración dentro del mismo ámbito.

Variables y constantes no se hoistean.

Las clases se hoistean únicamente dentro del entorno que contiene su declaración. No existe un mapa global por nombre: cada declaración obtiene un identificador interno y el nombre se resuelve mediante la tabla de símbolos. Por ello una clase local deja de ser visible al salir del bloque y dos bloques hermanos pueden declarar clases homónimas.

## 9. Closures

Cuando una función anidada referencia una variable declarada en el ámbito de una función externa, el símbolo se marca con `captured: true`. La tabla de símbolos y las métricas de la UI permiten observar estas capturas.

## 10. Clases y miembros

La fase de declaraciones construye información de clases, herencia, campos y métodos. Durante el análisis:

- `this` solo existe dentro de métodos;
- los accesos `obj.miembro` deben existir en la clase o en un ancestro;
- los campos `const` no pueden reasignarse;
- las llamadas a métodos y constructores validan cantidad y tipos de argumentos cuando existe una firma conocida;
- se detecta herencia inválida/circular.

Los tipos de instancia incluyen la identidad de la declaración de clase, no solo su texto. Los campos se infieren antes de validar los métodos, incluso si un campo está escrito después del método que lo usa. Las referencias a clases, campos y métodos incrementan el contador del símbolo correspondiente.

## 11. Arreglos

Los literales deben ser homogéneos bajo las reglas de compatibilidad de tipos. El índice debe ser `integer` y solo los arreglos pueden indexarse. `foreach` obtiene el tipo de su variable de iteración desde el tipo de elemento del arreglo.

## 12. Código inalcanzable

Las instrucciones posteriores a una terminación directa (`return`, `break` o `continue`, según el bloque analizado) se marcan como advertencia `SEM018`. Se utiliza `warning` porque el programa puede seguir siendo estructuralmente analizables y la advertencia resulta útil sin ocultar los errores semánticos principales.

## 13. Inicialización y `SEM023`

Una variable declarada sin inicializador (`let x: integer;`) queda registrada con `initialized: false`. Leerla antes de una asignación produce el warning `SEM023`; una asignación directa como `x = 10` marca el símbolo como inicializado y **no** se considera una lectura previa. `SEM001` se reserva para nombres que realmente no existen en la cadena de ámbitos.

## 14. Constructor implícito

Una clase sin método `constructor` explícito se interpreta con un constructor implícito de aridad cero. Por tanto, `new A()` es válido y `new A(1)` produce `SEM006`. Si existe un constructor (propio o heredado), se valida su firma normal.

## 15. Códigos estables

Los diagnósticos semánticos usan códigos estables `SEM001` a `SEM023`. `SEM022` se conserva reservado para compatibilidad con la versión recibida de V0 y `SEM023` identifica el uso de una variable declarada antes de inicializarse. Los IDs internos (`sem-diag-N`) se reinician en cada ejecución para que los resultados y pruebas sean deterministas.

## 16. Funciones sin tipo de retorno

Una función o método sin anotación no se considera automáticamente `void`. Durante el análisis se recopilan los tipos observados en sus instrucciones `return` y se calcula un tipo común. Si no retorna ningún valor, el resultado es `void`; si los caminos producen tipos incompatibles, se conserva `unknown` y los usos posteriores no inventan una compatibilidad inexistente.

## 17. Bloques de control

Aunque algunos fragmentos del README oficial omiten llaves, la gramática ANTLR entregada define `block` para los cuerpos de `if`, `while`, `do-while`, `for` y `foreach`. La gramática activa sigue esa fuente formal, por lo que estos cuerpos requieren `{ ... }`.

## 18. Actualización de símbolos

Las modificaciones posteriores a una declaración se realizan mediante `ScopeManager.updateSymbol`. Esta operación mantiene invariantes de identidad: no permite reemplazar el ID, nombre, ámbito ni posición declarada. Inicialización, captura, tipo inferido, firma y referencias pueden actualizarse sin reconstruir el símbolo.

## 19. Fuente de verdad

La gramática activa del proyecto está en:

```text
src/grammars/Compiscript.g4
```

Cuando se modifica debe regenerarse el código ANTLR:

```bash
npm run generate
```

Los archivos de `src/generated/` no deben editarse manualmente.
