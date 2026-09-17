// Demuestra inserción, recuperación, actualización y manejo de alcances.
let globalBase: integer = 10;
let pendiente: integer;
pendiente = 5;

function crearContador(delta: integer): integer {
  let acumulado: integer = globalBase;

  function siguiente(): integer {
    acumulado = acumulado + delta;
    return acumulado;
  }

  return siguiente();
}

class Contador {
  let valor = 0;

  function constructor(inicial: integer) {
    this.valor = inicial;
  }

  // El retorno y la firma del método se actualizan a integer.
  function incrementar() {
    this.valor = this.valor + 1;
    return this.valor;
  }
}

{
  let globalBase: integer = 20;

  class Local {
    let dato: integer = globalBase;
  }

  let local: Local = new Local();
  print(local.dato);
}

let contador: Contador = new Contador(pendiente);
print(contador.incrementar());
print(crearContador(2));
print(globalBase);
