import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SEMANTIC_CODE_CATALOG } from "../../semantic/diagnostics";

const SECTIONS = ["flujo", "arquitectura", "tabla", "catalogo", "cobertura", "comandos", "decisiones"];

export function DocumentationPanel() {
  return (
    <Accordion type="multiple" defaultValue={SECTIONS} className="p-3">
      <AccordionItem value="flujo">
        <AccordionTrigger>Flujo de ejecución</AccordionTrigger>
        <AccordionContent>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            <li>
              Abre <strong>IDE semántico</strong> y selecciona un caso o carga un archivo <code>.cps</code>.
            </li>
            <li>El lexer generado por ANTLR tokeniza toda la entrada y recolecta diagnósticos léxicos.</li>
            <li>
              Si la tokenización permite continuar, el parser construye el CST desde <code>program()</code>.
            </li>
            <li>Si no hay errores léxicos ni sintácticos, el visitor semántico valida tipos y nombres.</li>
            <li>La aplicación muestra diagnósticos, símbolos, ámbitos, referencias, closures y árboles.</li>
          </ol>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="arquitectura">
        <AccordionTrigger>Arquitectura de la fase semántica</AccordionTrigger>
        <AccordionContent>
          <p className="text-sm">
            <code>declarationVisitor.ts</code> realiza la recolección inicial de clases, herencia, campos y firmas de
            métodos. <code>semanticVisitor.ts</code> recorre el CST válido, consulta <code>ScopeManager</code>, aplica{" "}
            <code>typeSystem.ts</code>, produce diagnósticos estables y construye el árbol semántico anotado.{" "}
            <code>flowAnalysis.ts</code> cubre retornos y código inalcanzable.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="tabla">
        <AccordionTrigger>Tabla de símbolos y ámbitos</AccordionTrigger>
        <AccordionContent>
          <p className="text-sm">
            La tabla registra variables, constantes, parámetros, funciones, clases, campos, métodos y variables de{" "}
            <code>catch</code>. Cada símbolo conserva tipo, mutabilidad, inicialización, ámbito, ubicación de
            declaración, referencias y si fue capturado por un closure. Los ámbitos forman un árbol global con nodos
            de función, clase, bloque, ciclo, switch y catch.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="catalogo">
        <AccordionTrigger>Catálogo de diagnósticos semánticos</AccordionTrigger>
        <AccordionContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Regla</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(SEMANTIC_CODE_CATALOG).map(([code, description]) => (
                <TableRow key={code}>
                  <TableCell>
                    <code className="text-xs">{code}</code>
                  </TableCell>
                  <TableCell>{description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="cobertura">
        <AccordionTrigger>Cobertura principal</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>Operadores aritméticos, lógicos, relacionales, igualdad y ternarios.</li>
            <li>Compatibilidad de asignaciones, constantes e inferencia básica de variables/arreglos.</li>
            <li>Resolución de identificadores, shadowing entre ámbitos y redeclaración local.</li>
            <li>Firmas de funciones, cantidad/tipo de argumentos, retornos, recursión y closures.</li>
            <li>
              <code>break</code>, <code>continue</code>, <code>return</code> y detección de código inalcanzable.
            </li>
            <li>Clases, herencia, constructores, <code>this</code>, campos y métodos heredados.</li>
            <li>
              Arreglos homogéneos, acceso por índice y <code>foreach</code>.
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="comandos">
        <AccordionTrigger>Comandos</AccordionTrigger>
        <AccordionContent>
          <pre className="overflow-auto rounded border-2 bg-card p-2 text-xs">{`npm install
npm run generate
npm run check
npm test
npm run build
npm run dev

# CLI semántica (modo por defecto)
npm run cli -- examples/semantic/valid_complete.cps --mode semantic
npm run cli -- examples/semantic/semantic_errors.cps --mode semantic

# Solo fases anteriores
npm run cli -- examples/compiscript/valid.cps --mode parser
npm run cli -- examples/compiscript/valid.cps --mode lexer`}</pre>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="decisiones">
        <AccordionTrigger>Decisiones de diseño</AccordionTrigger>
        <AccordionContent>
          <p className="text-sm">
            Consulta <code>docs/DECISIONES_SEMANTICAS.md</code> para las diferencias entre la gramática base y los
            requerimientos semánticos, incluida la incorporación de <code>float</code> y la política de{" "}
            <code>switch</code>.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
