// Caso 7 de la rubrica: complejidad media y tres errores sintacticos.
const LIMITE: integer = 3;

let contador: integer = 0
let curso: string = "Compiladores"
let activo: boolean = true
let suma: integer = contador + LIMITE;
let producto: integer = suma * 2;

function sumar(a: integer, b: integer): integer {
  return a + b;
}

function mostrarCurso(nombre: string) {
  print(nombre);
}

class Estudiante {
  let nombre: string;
  function constructor(nombre: string) {
    this.nombre = nombre;
  }
}

class Profesor {
  let nombre: string;
  function constructor(nombre: string) {
    this.nombre = nombre;
  }
}

let estudiante: Estudiante = new Estudiante("Hugo");
let profesor: Profesor = new Profesor("Ernesto");
let notas: integer[] = [90, 85, 100];
let total: integer = sumar(notas[0], notas[1]);
mostrarCurso(curso);

if (activo) {
  print(estudiante.nombre);
} else {
  print(profesor.nombre);
}

for (let i: integer = 0; i < LIMITE; i = i + 1) {
  print(notas[i]);
}

foreach (nota in notas) {
  print(nota);
}

print(producto);
print(total);
