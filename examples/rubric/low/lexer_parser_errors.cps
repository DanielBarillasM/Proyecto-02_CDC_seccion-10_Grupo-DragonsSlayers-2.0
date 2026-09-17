// Caso 4 de la rubrica: complejidad baja con errores de ambas fases.
const LIMITE: integer = 3;
@

let contador: integer = 0
let nombre: string = "Compiscript";
#
let activo: boolean = true
let suma: integer = contador + LIMITE;
let producto: integer = suma * 2;

if (activo) {
  print(nombre);
} else {
  print("inactivo");
}

while (contador < LIMITE) {
  contador = contador + 1;
}

let valores: integer[] = [1, 2, 3];
foreach (valor in valores) {
  print(valor);
}

print(producto);
