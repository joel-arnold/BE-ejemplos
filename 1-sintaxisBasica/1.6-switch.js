// ============================================================
// switch : elegir entre varios casos
// ============================================================
// El `switch` compara un valor contra varios `case` y ejecuta el
// que coincida. Detalles importantes:
// - La comparación es ESTRICTA (como ===), por eso el número 1 no
//   coincide con el texto '1'. Acá `a` es '1', así que entra por
//   el case '1'.
// - Cada `case` necesita un `break`; si falta, la ejecución "cae"
//   al siguiente case (fall-through).
// - `default` se ejecuta cuando ningún case coincide.

let a = '1';

switch (a) {
  case 1:
    console.log(`a es 1`);
    break;
  case 2:
    console.log(`a es 2`);
    break;
  case '1':
    console.log(`a es '1'`);
    break;
  default:
    console.log('sin coincidencias');
    break;
}
