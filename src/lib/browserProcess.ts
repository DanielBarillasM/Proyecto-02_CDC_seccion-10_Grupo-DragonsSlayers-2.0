import browserProcess from "process";

/**
 * antlr4ts depende de los paquetes `assert` y `util`, cuyos polyfills para
 * navegador consultan la variable global de Node `process`. Vite no la crea
 * automáticamente durante el desarrollo, así que debe instalarse antes de
 * evaluar los módulos generados por ANTLR.
 */
if (typeof globalThis.process === "undefined") {
  globalThis.process = browserProcess;
}
