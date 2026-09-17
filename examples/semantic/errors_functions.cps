// Esperados: SEM002, SEM006, SEM007, SEM008, SEM009 y SEM014.
function sumar(a: integer, b: integer): integer {
  return a + b;
}

sumar(1);
sumar(1, "dos");

function retornoIncorrecto(): integer {
  return "texto";
}

function duplicada(): integer {
  return 1;
}

function duplicada(): integer {
  return 2;
}

let numero: integer = 4;
numero();
return 1;
