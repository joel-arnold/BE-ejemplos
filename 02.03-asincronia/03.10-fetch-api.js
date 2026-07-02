'use strict';
console.clear();

// ============================================================
// CONSUMO DE UNA API REAL con fetch + async/await
// ============================================================
// fetch() hace una petición HTTP y devuelve una Promise. Está
// disponible de forma global en el navegador y en Node.js 18+.
// Es el caso real más común de asincronía: pedir datos a un
// servidor y esperar la respuesta.
//
// Usamos la API pública del Banco Mundial (World Bank): es
// gratuita y NO requiere API key. Con el prefijo /es/ devuelve
// los datos en español.
//
// OJO: fetch SOLO rechaza la promesa si falla la RED. Un status
// HTTP de error (404, 500...) NO la rechaza: hay que revisar
// response.ok a mano. Y encima esta API devuelve status 200
// aunque el país no exista (manda el error DENTRO del cuerpo),
// así que también validamos la respuesta.

// /es/ -> datos en español. {codigo} = código ISO de 2 letras.
const API = "https://api.worldbank.org/v2/es/country";

async function obtenerPais(codigo) {
  const response = await fetch(`${API}/${codigo}?format=json`);

  // 1) Errores de red / HTTP: fetch no los lanza por nosotros.
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} al pedir el país "${codigo}"`);
  }

  // 2) El Banco Mundial responde con un array de 2 posiciones:
  //    [ metadatos, [ datosDelPais ] ]
  const [meta, paises] = await response.json();

  // 3) Si el código no existe, igual responde 200, pero sin el
  //    array de países y con un mensaje de error en los metadatos.
  if (!paises || paises.length === 0) {
    const detalle = meta?.message?.[0]?.value ?? "país no encontrado";
    throw new Error(`No se pudo obtener "${codigo}": ${detalle}`);
  }

  return paises[0];
}

// Arma un texto legible con los datos del país.
function describirPais(pais) {
  return [
    `${pais.name} (${pais.iso2Code})`,
    `   Capital:      ${pais.capitalCity || "—"}`,
    `   Región:       ${pais.region.value.trim()}`,
    `   Ingresos:     ${pais.incomeLevel.value}`,
    `   Coordenadas:  ${pais.latitude}, ${pais.longitude}`,
  ].join("\n");
}

async function main() {
  try {
    // --- Un solo país ---
    const argentina = await obtenerPais("AR");
    console.log("País obtenido:");
    console.log(describirPais(argentina));

    // --- Varios en PARALELO con Promise.all (ver 03.09) ---
    const codigos = ["BR", "CL", "UY", "PE"];
    const paises = await Promise.all(codigos.map((c) => obtenerPais(c)));
    console.log(`\nSe obtuvieron ${paises.length} países en paralelo:\n`);
    paises.forEach((p) => console.log(describirPais(p) + "\n"));

    // --- Caso de error: un código que no existe ---
    await obtenerPais("XX");
  } catch (error) {
    // Acá caen tanto los errores de red como los que lanzamos.
    console.log("\nOcurrió un error:", error.message);
  }
}

main();
