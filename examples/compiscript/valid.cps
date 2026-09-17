const PI: integer = 314;

function factorial(n: integer): integer {
  if (n <= 1) { return 1; }
  return n * factorial(n - 1);
}

class Animal {
  let nombre: string;

  function constructor(nombre: string) {
    this.nombre = nombre;
  }
}

class Perro : Animal {
  function hablar(): string {
    return this.nombre + " ladra.";
  }
}

let notas: integer[] = [90, 85, 100];
let perro: Perro = new Perro("Toby");

foreach (nota in notas) {
  if (nota < 60) { continue; }
  print(nota);
}

try {
  print(perro.nombre);
} catch (err) {
  print("Error: " + err);
}
