# 7.1 - Fundamentos de TypeScript

> Clase "De JavaScript a TypeScript" · **Bloques 2 a 5**

El lenguaje, en cinco archivos progresivos. Cada uno se ejecuta solo y muestra una parte: tipos, funciones, objetos, clases y genéricos.

## Los archivos

| Archivo | Bloque | Qué muestra |
| --- | --- | --- |
| [7.1.1-tiposBasicos.ts](src/7.1.1-tiposBasicos.ts) | Bloque 3 | Anotación e inferencia, arrays, uniones y literales, narrowing con `typeof`, `any` vs `unknown`, qué cambia con `strict`. |
| [7.1.2-funciones.ts](src/7.1.2-funciones.ts) | Bloque 4 | Parámetros y retorno, opcionales, `void`, tipos de función, orden superior (los ejemplos 2.7 y 2.8 tipados) y `Promise<T>`. |
| [7.1.3-objetos.ts](src/7.1.3-objetos.ts) | Bloque 5 | `interface` vs `type`, opcionales y `readonly`, `extends`, uniones discriminadas, la interface como contrato. |
| [7.1.4-clases.ts](src/7.1.4-clases.ts) | Bloque 5 | Modificadores de acceso, *parameter properties*, `private` vs `#privado`, `implements` y herencia. |
| [7.1.5-genericosYUtilityTypes.ts](src/7.1.5-genericosYUtilityTypes.ts) | Bloque 5 | `<T>`, restricciones con `extends`, interfaces genéricas y `Omit` / `Pick` / `Partial`. |

Las líneas que **darían error de compilación están comentadas**, con el mensaje que muestra TypeScript. Descomentalas en el editor para ver el subrayado rojo: es la mejor forma de leer estos archivos.

## Cómo ejecutar

```bash
npm install

npm run tipos       # 7.1.1
npm run funciones   # 7.1.2
npm run objetos     # 7.1.3
npm run clases      # 7.1.4
npm run genericos   # 7.1.5
```

Cada script usa `tsx`, que ejecuta el `.ts` directo (lo compila en memoria). Para ver el flujo real de compilación:

```bash
npm run build                       # compila src/ -> dist/
node dist/7.1.1-tiposBasicos.js     # corre el JavaScript generado

npm run check                       # solo chequea tipos, no emite nada
```

Abrir un archivo de `dist/` al lado de su fuente muestra el **borrado de tipos**: es el mismo código, sin una sola anotación. Eso es lo que corre.

## Configuración

`tsconfig.json` con lo mínimo que hay que entender: `strict: true` (todas las verificaciones), `module: NodeNext` (ESM de Node, el mismo de la unidad 6) y `rootDir` / `outDir` para separar fuente de compilado.

Con `NodeNext`, los imports relativos llevan la extensión **`.js`** aunque el archivo sea `.ts` — el import lo resuelve Node en ejecución, cuando ese archivo ya está compilado. En esta carpeta casi no se nota porque cada ejemplo es independiente; en [7.2](../7.2-api-capas-ts/) aparece en todos los archivos.
