// Esperados: SEM005, SEM010, SEM011, SEM018 y SEM021.
if (1) {
  print("condición inválida");
}

while ("texto") {
  break;
}

function terminar(): integer {
  return 1;
  print("inalcanzable");
}

while (true) {
  break;
  print("también inalcanzable");
}

switch ([1, 2]) {
  case 1:
    break;
}

break;
continue;
