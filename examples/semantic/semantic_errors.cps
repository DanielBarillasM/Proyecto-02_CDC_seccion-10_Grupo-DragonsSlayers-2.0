// Programa sintácticamente válido con errores semánticos intencionales.
let total: integer = "texto";
let activo: boolean = true;
let calculo: integer = activo - 1;

if (total) {
  print(total);
}

function sumar(a: integer, b: integer): integer {
  return a + b;
}

sumar(1);
sumar(1, "dos");
print(noExiste);

function retornoIncorrecto(): integer {
  return "texto";
  print("inalcanzable");
}

class Persona {
  let nombre: string;
  const codigo: integer = 1;

  function constructor(nombre: string) {
    this.nombre = nombre;
  }
}

let persona: Persona = new Persona("Ana");
print(persona.edad);
persona.codigo = 2;

let numeros: integer[] = [1, 2, 3];
print(numeros["cero"]);
print(total[0]);
let mezcla = [1, "dos", true];

print(this);
let fantasma = new NoExiste();

for (let i: integer = "cero"; 1; i = i + 1) {
  print(i);
}

break;
continue;
return 1;
