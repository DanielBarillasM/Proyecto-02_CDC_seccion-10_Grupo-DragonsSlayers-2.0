// Esperados: SEM003, SEM006, SEM007, SEM012, SEM013, SEM014 y SEM020.
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

let sinArgumento: Persona = new Persona();
let argumentoIncorrecto: Persona = new Persona(10);
let inexistente = new NoExiste();
print(this);

class Hija : PadreInexistente {}
class CircularA : CircularB {}
class CircularB : CircularA {}
