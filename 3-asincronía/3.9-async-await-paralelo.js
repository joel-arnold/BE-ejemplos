'use strict';
console.clear();

// ============================================================
// SECUENCIAL vs PARALELO con async/await
// ============================================================
// await "pausa" la función hasta que la promesa termina. Si
// encadenás varios await, cada uno espera al anterior. Eso está
// bien cuando un paso DEPENDE del resultado del anterior... pero
// es un desperdicio de tiempo cuando las tareas son
// INDEPENDIENTES entre sí.

function tarea(nombre, ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`${nombre} lista (tardó ${ms}ms)`);
      resolve(nombre);
    }, ms);
  });
}

// ------------------------------------------------------------
// SECUENCIAL: un await tras otro. Los tiempos se SUMAN.
// Total ≈ 1000 + 1000 + 1000 = 3000ms
// (Cada tarea recién arranca cuando termina la anterior.)
// ------------------------------------------------------------
async function secuencial() {
  console.time("secuencial");
  await tarea("🍕 Pizza", 1000);
  await tarea("🥤 Bebida", 1000);
  await tarea("🍰 Postre", 1000);
  console.timeEnd("secuencial");
}

// ------------------------------------------------------------
// PARALELO: lanzamos las tres a la vez y esperamos a todas
// juntas con Promise.all. Como corren al mismo tiempo, el total
// ≈ el de la MÁS lenta = 1000ms
// ------------------------------------------------------------
async function paralelo() {
  console.time("paralelo");
  // Clave: primero se LANZAN las promesas (se crean acá mismo),
  // y con un solo await esperamos a que terminen todas.
  const resultados = await Promise.all([
    tarea("🍕 Pizza", 1000),
    tarea("🥤 Bebida", 1000),
    tarea("🍰 Postre", 1000),
  ]);
  console.log("Resultados:", resultados);
  console.timeEnd("paralelo");
}

// Corremos primero el secuencial y después el paralelo para
// comparar los tiempos sin que se mezclen las salidas.
(async () => {
  console.log("--- SECUENCIAL ---");
  await secuencial();

  console.log("--- PARALELO ---");
  await paralelo();
})();
