# 7 - TypeScript

Ejemplos que acompañan la clase **"De JavaScript a TypeScript"**. Se usa el mismo caso mínimo de la unidad 6 (`productos` con `nombre` y `precio`) para que se vea qué agregan los tipos, no un dominio nuevo.

A diferencia de las carpetas 1 a 6, acá **hay paso de compilación**: TypeScript no se ejecuta, se compila a JavaScript y eso es lo que corre Node.

## Recorrido

| Ejemplo | Bloque de la clase | Qué muestra |
| --- | --- | --- |
| [7.1-fundamentos](7.1-fundamentos/) | Bloques 2 a 5 | El lenguaje en cinco archivos: tipos e inferencia, funciones, objetos, clases y genéricos. |
| [7.2-api-capas-ts](7.2-api-capas-ts/) | Bloque 6 | El ejemplo `6.3` migrado a TypeScript, capa por capa — y el agujero de `req.body`. |
| [7.3-validacion-zod](7.3-validacion-zod/) | Bloque 7 | Zod: validación en runtime y el tipo derivado del esquema con `z.infer`. |
| [7.4-migracion-gradual](7.4-migracion-gradual/) | Bloque 8 | Un proyecto a medio migrar: `.js` y `.ts` conviviendo con `allowJs` y `checkJs`. |

La progresión es acumulativa y la idea que la ordena es una sola: **TypeScript chequea lo que escribís vos; Zod chequea lo que te mandan.** El 7.2 y el 7.3 están pensados para abrirse lado a lado — el mismo POST con `"precio": "60000"` (string) responde `201` en uno y `400` en el otro.

## Cómo ejecutar cualquiera

Cada carpeta es un proyecto independiente en **ESM**, igual que los de la unidad 6, más el paso de compilación:

```bash
cd 7-typescript/7.2-api-capas-ts   # o el que quieras
npm install

npm run dev     # desarrollo: tsx ejecuta el .ts directo y recarga al guardar
npm run check   # solo chequea tipos (tsc --noEmit), no emite nada

npm run build   # compila src/ -> dist/
npm start       # producción: node dist/app.js
```

`7.1` no levanta servidor: tiene un script por archivo (`npm run tipos`, `npm run funciones`, …).

Los proyectos con API (`7.2` y `7.3`) levantan en `http://localhost:3000`, ruta base `/api/productos`, y traen un archivo `.http` para probar los endpoints.

## Detalles de configuración

- **`"strict": true`** en todos los proyectos nuevos (`7.4` es la excepción, a propósito: muestra la configuración *de migración*).
- **`"module": "NodeNext"`**: los imports relativos llevan la extensión **`.js`** aunque el archivo sea `.ts`. No es un typo — el import lo resuelve Node en ejecución, cuando ese archivo ya se compiló.
- **`dist/`** es código generado: no se versiona (ya está en el `.gitignore` del repo).
- `typescript`, `tsx` y los `@types/*` van siempre en **`devDependencies`**; `zod` va en `dependencies`, porque corre en producción.
