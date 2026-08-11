// ============================================================================
// LA CONFIGURACIÓN DE JEST — cuatro líneas, y cada una tiene su motivo
// ============================================================================
// Este archivo es idéntico en los cuatro ejemplos de la unidad. Vale leerlo una
// vez con atención acá y después copiarlo sin culpa.
// ============================================================================

export default {
  // 1. El preset de ts-jest en su variante ESM.
  //    Jest no entiende TypeScript: necesita que alguien le transforme los .ts
  //    antes de ejecutarlos. Eso hace ts-jest. La variante "-esm" es la que
  //    respeta `"type": "module"` — sin ella, ts-jest compila a CommonJS y los
  //    `import` se rompen.
  preset: 'ts-jest/presets/default-esm',

  // 2. Node, no navegador.
  //    Jest puede simular un DOM (jsdom) para testear front. Acá se testea una
  //    API: no hay `document` ni `window`, y decirlo explícito arranca más rápido.
  testEnvironment: 'node',

  // 3. El mapeo del `.js` que no existe.
  //    Desde la unidad 7 los imports llevan extensión: `from './repo.js'` aunque
  //    el archivo sea `repo.ts`. Eso es lo que pide "module": "NodeNext" y es
  //    correcto — el `.js` apunta a lo que se va a generar al compilar.
  //    Pero Jest lee el código SIN compilar y busca un `repo.js` que todavía no
  //    existe. Esta línea le dice: cuando veas un import relativo terminado en
  //    `.js`, sacale la extensión y resolvé desde ahí.
  //    Es el error #1 de esta unidad: "Cannot find module './repo.js'".
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
