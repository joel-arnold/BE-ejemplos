# 10.1 - Primeros tests con Jest

Jest sobre **funciones puras**: la anatomía de un test, los matchers que importan y por qué los casos borde son los que encuentran bugs.

Acá no hay base de datos, ni servidor, ni mocks. Es a propósito: primero el mecanismo, después la dificultad.

```bash
npm install
npm test
```

| Script | Qué hace |
| --- | --- |
| `npm test` | Corre todos los tests una vez |
| `npm run test:watch` | Se queda mirando y vuelve a correr al guardar |
| `npm run test:cobertura` | Suma el reporte de cobertura |
| `npm run check` | Solo chequea tipos (`tsc --noEmit`) |

## Qué mirar, en orden

| Archivo | Qué muestra |
| --- | --- |
| [src/precios.test.ts](src/precios.test.ts) | `describe`/`it`/`expect`, el patrón AAA, `toThrow`, `it.each` |
| [src/carrito.test.ts](src/carrito.test.ts) | `toBe` vs `toEqual`, `beforeEach`, testear lo que la función promete **no** hacer |

## La configuración, línea por línea

Este es el peaje de la unidad. Jest nació en el mundo CommonJS y nosotros venimos escribiendo **ESM + TypeScript** desde la unidad 7, así que hay que decirle tres cosas. Están comentadas en [jest.config.js](jest.config.js); el resumen:

| Pieza | Dónde | Por qué |
| --- | --- | --- |
| `preset: 'ts-jest/presets/default-esm'` | `jest.config.js` | Jest no entiende TypeScript. La variante `-esm` respeta `"type": "module"`. |
| `moduleNameMapper` del `.js` | `jest.config.js` | Nuestros imports dicen `'./precios.js'` y el archivo es `.ts`. Jest lee sin compilar y no encuentra nada. |
| `--experimental-vm-modules` | `package.json` | El soporte de ESM en Jest sigue detrás de una bandera de Node. |
| `isolatedModules: true` | `tsconfig.json` | ts-jest transpila archivo por archivo; sin esto avisa con un warning en cada corrida. |

Sobre el script de `npm test`: en vez de `NODE_OPTIONS=--experimental-vm-modules jest`, que es lo que aparece en la documentación, usamos

```json
"test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"
```

Es lo mismo y **funciona igual en Windows, Linux y Mac**. La forma con `NODE_OPTIONS=` adelante es sintaxis de shell de Unix: en la terminal de Windows falla, y es la razón por la que a la mitad del curso no le arranca.

## Los cuatro errores de la primera vez

**`Cannot find module './precios.js'`** — falta el `moduleNameMapper`, o lo copiaste con una barra invertida de menos.

**`Cannot use import statement outside a module`** — falta el preset ESM, falta `"type": "module"`, o falta la bandera de Node.

**`ReferenceError: describe is not defined`** — el archivo no importa nada de `@jest/globals`. Muchos tutoriales no importan: usan las variables globales que Jest inyecta, que existen, pero **TypeScript no las conoce** sin `@types/jest`. Importarlas explícitamente es una dependencia menos y un import que se lee.

**El test pasa pero no debería** — casi siempre es un `async` sin `await`. Un test que devuelve una promesa que nadie espera termina antes que la afirmación, y Jest lo da por bueno.

## Para ver un test en rojo

Vale la pena romper uno a propósito la primera vez, porque leer la salida de un fallo es la mitad de la habilidad. En `src/precios.test.ts`, cambiá el `800` por `900` y corré `npm test`:

```
● aplicarDescuento › descuenta el porcentaje indicado

  expect(received).toBe(expected) // Object.is equality

  Expected: 900
  Received: 800

     9 |     const resultado = aplicarDescuento(precio, porcentaje);
    10 |
  > 11 |     expect(resultado).toBe(900);
```

Nombre del test, qué esperaba, qué recibió y la línea exacta. Eso es lo que vas a leer mil veces.

Y probá también el otro clásico: comparar dos objetos con `toBe` en vez de `toEqual`. El mensaje es

```
Expected: {"nombre": "Mate", "precio": 5000}
Received: serializes to the same string
```

*"Se serializa igual"* es Jest diciendo **el contenido es idéntico pero me pediste identidad**. Traducción: querías `toEqual`.

## Lo que sigue

Estas funciones eran fáciles de testear porque no dependen de nada. En el [10.2](../10.2-service-inyeccion/) aparece el problema de verdad: un service que llama a un repository que va a MySQL.
