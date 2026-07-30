# 7.4 - Migración gradual de JavaScript a TypeScript

> Clase "De JavaScript a TypeScript" · **Bloque 8**

Un proyecto **a medio migrar**: archivos `.js` y `.ts` conviviendo en el mismo build. Es el escenario real — el TP ya está escrito en JavaScript y no hace falta parar todo para convertirlo de una.

## Los cinco pasos

1. Instalar TypeScript y crear el `tsconfig.json` con **`"allowJs": true`**: `.js` y `.ts` conviven.
2. Renombrar **de a un archivo** `.js` → `.ts`, empezando por las **hojas** del árbol (el repository, los helpers) y subiendo hacia el controller. Las hojas no dependen de nadie, así que migrarlas no arrastra medio proyecto.
3. Arreglar los errores de ese archivo. Si alguno se traba, `any` temporal con un `// TODO`: es deuda, pero acotada y visible.
4. Cuando ya casi todo es `.ts`, prender **`"strict": true`** y hacer la última pasada.
5. Sacar `allowJs` y borrar los `any` que quedaron.

## Cómo está este proyecto

| Archivo | Estado | Qué muestra |
| --- | --- | --- |
| [src/precios.js](src/precios.js) | `.js` con **JSDoc** | Con `checkJs: true`, TypeScript chequea el archivo **sin cambiarle la extensión**. |
| [src/formato.js](src/formato.js) | `.js` sin tipar | Con `strict: false` se tolera; al prender `strict` empieza a fallar. Es el trabajo pendiente. |
| [src/productos.repository.ts](src/productos.repository.ts) | ya migrado | La primera hoja convertida: interface propia y firmas tipadas. |
| [src/main.ts](src/main.ts) | ya migrado | Importa los tres y funciona: eso es lo que habilita `allowJs`. |

## Probarlo

```bash
npm install
npm run dev     # corre main.ts (que importa los .js sin problema)
npm run check   # chequea tipos de todo, .js incluidos
```

Después, los experimentos anotados al final de [src/main.ts](src/main.ts):

1. Descomentar la última línea de [src/precios.js](src/precios.js) y correr `npm run check`. El error se reporta **dentro de un archivo `.js`**, gracias a `checkJs` + JSDoc:

   ```
   src/precios.js(26,8): error TS2345: Argument of type 'string' is not
   assignable to parameter of type 'number'.
   ```

2. Poner `"strict": true` en el `tsconfig.json`: `formato.js` empieza a fallar con *"Parameter 'precio' implicitly has an 'any' type"*. Eso es exactamente lo que falta para terminar la migración.

## Los cuatro errores del primer día

| Mensaje | Qué pasa | Qué hacer |
| --- | --- | --- |
| `Parameter implicitly has an 'any' type` | Un parámetro sin anotar, con `strict` prendido. | Anotarlo. El más frecuente y el más fácil. |
| `Object is possibly 'undefined'` | Un `find`, un `[0]` o un campo opcional que puede no venir. | Contemplar el caso con un `if`. No apagar `strictNullChecks`. |
| `Could not find a declaration file for module 'x'` | La librería está en JavaScript y no trae tipos. | `npm i -D @types/x`. |
| `Relative import paths need explicit file extensions` | Falta el `.js` en un import relativo, con `NodeNext`. | Agregarlo, aunque el archivo sea `.ts`. |

## El tsconfig del final

Cuando la migración termina, la configuración queda como la de [7.1](../7.1-fundamentos/tsconfig.json) o [7.2](../7.2-api-capas-ts/tsconfig.json): sin `allowJs`, sin `checkJs` y con **`"strict": true`**.
