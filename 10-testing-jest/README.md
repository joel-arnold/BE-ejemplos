# 10 - Testing con Jest

Ejemplos que acompañan la clase **"Testing con Jest"**. Siguen el mismo caso mínimo de las unidades 6 a 9 (`productos` con `nombre` y `precio`), ahora con la pregunta que veníamos esquivando: **¿cómo sabemos que esto anda?**

Hasta la unidad 9 la respuesta fue *"corro el `.http` y miro"*. Funciona hasta que el proyecto tiene cuarenta endpoints y tres personas tocándolo.

El hilo de las cinco unidades, en una línea cada una:

- **6** separó la API en capas.
- **7** escribió los contratos como tipos.
- **8** le puso una base de datos abajo.
- **9** le puso una puerta.
- **10** cobra por primera vez lo que la 6 dejó preparado: **el service se testea sin nada de eso**.

## Recorrido

| Ejemplo | Bloque de la clase | Qué muestra |
| --- | --- | --- |
| [10.1-primeros-tests](10.1-primeros-tests/) | Bloques 2 y 3 | `describe`/`it`/`expect`, AAA, `toBe` vs `toEqual`, `it.each`, y la configuración de Jest con ESM + TypeScript |
| [10.2-service-inyeccion](10.2-service-inyeccion/) | Bloques 4, 5 y 7 | El service del `9.3` con el repository inyectado: nueve tests sin base de datos |
| [10.3-mock-de-modulos](10.3-mock-de-modulos/) | Bloque 6 | El mismo service **sin tocar una línea**, interceptando el import con `jest.unstable_mockModule` |
| [10.4-api-supertest](10.4-api-supertest/) | Bloque 8 | La API entera con requests de verdad: rutas, tokens, códigos HTTP y cobertura |

El **10.2 y el 10.3 están pensados para abrirse lado a lado**: tienen los mismos tests y resuelven el mismo problema por caminos opuestos.

## Antes de correr

Nada. Es la unidad más liviana desde la 7: **ninguno de los cuatro ejemplos necesita MySQL, ni `.env`, ni servidor levantado**.

```bash
cd 10.1-primeros-tests
npm install
npm test
```

| Ejemplo | Necesita | Cómo se corre |
| --- | --- | --- |
| 10.1 | nada | `npm test` |
| 10.2 | nada | `npm test` y `npm start` |
| 10.3 | nada | `npm test` |
| 10.4 | nada | `npm test`, `npm run test:cobertura`, `npm run dev` |

Todos tienen además `npm run test:watch` (vuelve a correr al guardar) y `npm run check` (solo tipos).

Que no haga falta una base **es el punto de la unidad**, no una comodidad del ejemplo. Un test que necesita MySQL andando es un test que nadie corre.

## La configuración, que es el peaje

Jest nació en el mundo CommonJS y nosotros venimos escribiendo ESM + TypeScript desde la unidad 7. Hay que decirle tres cosas, iguales en los cuatro ejemplos:

| Pieza | Dónde | Por qué |
| --- | --- | --- |
| `preset: 'ts-jest/presets/default-esm'` | `jest.config.js` | Jest no entiende TypeScript; la variante `-esm` respeta `"type": "module"` |
| `moduleNameMapper` del `.js` | `jest.config.js` | Nuestros imports dicen `'./repo.js'` y el archivo es `.ts` |
| `--experimental-vm-modules` | `package.json` | El soporte de ESM en Jest sigue detrás de una bandera de Node |
| `isolatedModules: true` | `tsconfig.json` | ts-jest transpila archivo por archivo; sin esto avisa en cada corrida |

Está comentada línea por línea en [10.1-primeros-tests/jest.config.js](10.1-primeros-tests/jest.config.js). Se lee una vez y se copia sin culpa.

Un detalle de Windows: el script es

```json
"test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"
```

y no `NODE_OPTIONS=--experimental-vm-modules jest`, que es lo que dice la documentación. Esa forma es sintaxis de shell de Unix y **falla en la terminal de Windows**.

## Las cuatro ideas

**1. Lo difícil de testear no es el test: es el código.** Una función pura se testea en tres líneas. Un service que agarra su repository solo, no. Cuando un test es imposible de escribir, casi siempre el problema está del otro lado.

**2. Inyectar la dependencia es todo el truco.** Que el service reciba el repository en vez de importarlo permite pasarle uno de mentira. Es una línea de cambio y es la diferencia entre necesitar MySQL y no necesitarlo.

**3. Los tests son la documentación que no puede mentir.** *"Solo el dueño o un admin pueden borrar"* escrito en un comentario envejece. Escrito como test, se pone rojo el día que deja de ser cierto.

**4. La cobertura mide lo que se ejecutó, no lo que se verificó.** Sirve para encontrar lo que no probaste, leyendo qué líneas quedaron afuera. Como nota, se manipula sin esfuerzo.

## Versiones y decisiones

| Paquete | Versión | Por qué |
| --- | --- | --- |
| `jest` | 30.4.2 | El framework. Trae corredor, afirmaciones, mocks y cobertura en uno. |
| `ts-jest` | 29.4.12 | Transforma los `.ts` antes de ejecutarlos, y chequea tipos. |
| `@jest/globals` | 30.4.1 | Importar `describe`/`it`/`expect` explícitamente. Evita `@types/jest` y hace que TypeScript los conozca. |
| `supertest` | 7.2.2 | Requests de verdad contra la app de Express, sin ocupar un puerto (solo el 10.4). |

Se usa **`@jest/globals` en vez de las variables globales** que Jest inyecta. Los tutoriales no lo importan y funciona igual en JavaScript; en TypeScript, sin ese import hace falta `@types/jest` para que el compilador conozca `describe`. Un import explícito es una dependencia menos y se lee mejor.

El resto del stack lo heredan de las unidades 7, 8 y 9: **ESM** con `"module": "NodeNext"`, **tsx** para correr, TypeScript 5.4.5.

## Lo que estos ejemplos no hacen

A propósito, para que la unidad entre en una clase:

- **No hay tests contra una base real.** El escalón que sigue —un MySQL de prueba con Docker, limpiado entre test y test— existe y es útil, pero es otra clase.
- **No hay TDD.** Escribir el test antes es una disciplina que se aprende mejor una vez que testear no cuesta.
- **No hay tests de front ni end-to-end.** Playwright y compañía manejan el navegador entero; son otra herramienta y otro costo de mantenimiento.
- **No hay `jest.spyOn` sobre módulos propios.** Con ESM tiene sus asteriscos, y entre inyectar (10.2) y `unstable_mockModule` (10.3) los casos del TP están cubiertos.
