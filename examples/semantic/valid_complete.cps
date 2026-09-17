// Demostración integral: todas las fases deben finalizar sin diagnósticos.
const LIMITE: integer = 4;
let curso: string = "Construcción de Compiladores";
let habilitado: boolean = true;
let promedio: float = 91;

function sumar(a: integer, b: integer): integer {
  return a + b;
}

function factorial(n: integer): integer {
  if (n <= 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

function crearAcumulador(inicio: integer): integer {
  let total: integer = inicio;

  function incrementar(): integer {
    total = total + 1;
    return total;
  }

  return incrementar();
}

// El retorno se infiere como integer.
function duplicar(valor: integer) {
  return valor * 2;
}

class Recurso {
  let nombre: string;
  const categoria: string = "material";

  function constructor(nombre: string) {
    this.nombre = nombre;
  }

  function etiqueta(): string {
    return this.nombre + " - " + this.categoria;
  }
}

class Documento : Recurso {
  let paginas = 1;

  function resumen(): string {
    return this.etiqueta();
  }
}

let notas: integer[] = [90, 85, 100];
let matriz: integer[][] = [[1, 2], [3, 4]];
let documento: Documento = new Documento("Informe");
let contador: integer = 0;

// Shadowing válido: la declaración externa no se reemplaza.
{
  let curso: string = "Compiscript";
  print(curso);
}

if (habilitado) {
  print(documento.resumen());
} else {
  print("curso deshabilitado");
}

while (contador < 1) {
  contador = contador + 1;
}

do {
  contador = contador - 1;
} while (contador > 0);

for (let i: integer = 0; i < LIMITE; i = i + 1) {
  print(i);
}

foreach (nota in notas) {
  if (nota < 60) {
    continue;
  }
  print(nota);
}

switch (LIMITE) {
  case 4:
    print("límite esperado");
    break;
  default:
    print("otro límite");
}

try {
  print(matriz[0][1]);
} catch (error) {
  print(error);
}

print(sumar(2, 3));
print(factorial(5));
print(crearAcumulador(0));
print(duplicar(6));
print(promedio);
