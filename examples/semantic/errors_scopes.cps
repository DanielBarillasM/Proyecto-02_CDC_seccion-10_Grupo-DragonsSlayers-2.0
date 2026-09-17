// Esperados: SEM001, SEM002, SEM019 y SEM023.
let pendiente: integer;
print(pendiente);
print(noDeclarada);

let repetida: integer = 1;
let repetida: integer = 2;

function parametrosDuplicados(valor: integer, valor: integer): integer {
  return valor;
}

{
  let soloLocal: string = "visible dentro";

  class ClaseLocal {
    let dato: integer = 1;
  }

  let instancia: ClaseLocal = new ClaseLocal();
  print(instancia.dato);
}

print(soloLocal);
let invalida = new ClaseLocal();
