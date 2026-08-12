# 11.1 - El build: de `tsx` a `dist/`

Una API mínima —tres rutas, un array en memoria, cero dependencias de base de datos— cuyo único tema es **el paso de compilación**. No hay nada de negocio acá: hay `npm run build`, `npm start`, y las tres cosas del arranque que en tu máquina daban igual y en un servidor no.

Se corre entero en treinta segundos y no necesita MySQL, ni `.env`, ni cuenta en ningún lado.

## Correrlo

```bash
npm install

npm run dev      # tsx, como veníamos: recarga al guardar
npm run build    # tsc: compila src/ -> dist/
npm start        # node dist/server.js: lo que va a correr el servidor
```

Los tres levantan la misma API en `http://localhost:3000`. Hay un `productos.http` para probarla.

## Las dos formas de correr lo mismo

| | `npm run dev` | `npm start` |
| --- | --- | --- |
| Quién ejecuta | `tsx` | `node`, pelado |
| Qué archivos lee | los `.ts` de `src/` | los `.js` de `dist/` |
| Compila a disco | no (transpila en memoria) | ya está compilado |
| Recarga al guardar | sí | no |
| Chequea tipos | **no** | ya se chequearon en el build |
| Dónde corre | tu máquina | el servidor |

La fila que sorprende es la de los tipos: **`tsx` no chequea tipos**, los borra y ejecuta. Por eso un proyecto puede venir andando perfecto con `npm run dev` durante semanas y romperse en el primer `npm run build`. Ese es exactamente el motivo del script `npm run check` (`tsc --noEmit`) que arrastramos desde la unidad 7 — y el motivo por el que el build tiene que correr antes de subir nada, no después.

## Qué hay adentro de `dist/`

```
dist/
├── app.js
├── app.js.map
├── server.js
└── server.js.map
```

JavaScript plano, sin tipos, ejecutable por cualquier Node. Los `.map` son los *source maps*: hacen que un stack trace del servidor apunte a la línea del `.ts` original en vez de a la del `.js` compilado. Pesan unos kilobytes y la primera vez que algo explota en producción se pagan solos.

`dist/` **no se versiona** (está en el `.gitignore` del repositorio). Se genera en el servidor, en cada deploy, a partir del código fuente. Un `dist/` commiteado es la forma más rápida de que lo que corre en producción no sea lo que dice el repositorio.

## Qué se sube al servidor

Lo que se sube es el **repositorio**, y el servidor hace el resto:

```bash
npm ci --omit=dev     # instala dependencias, sin las de desarrollo
npm run build         # ...pero build necesita TypeScript, que es de desarrollo
npm start
```

Ese orden tiene una trampa que se ve enseguida. Lo correcto en un hosting que compila por vos es:

```bash
npm ci && npm run build     # build command: instala TODO y compila
npm start                   # start command
```

Y si querés adelgazar la imagen final, `npm prune --omit=dev` **después** del build.

| Comando | Para qué | Cuándo |
| --- | --- | --- |
| `npm install` | instala y **puede modificar** el `package-lock.json` | tu máquina, cuando agregás algo |
| `npm ci` | instala **exactamente** lo del lock, borrando `node_modules` primero | el servidor, siempre |
| `--omit=dev` | saltea las `devDependencies` | producción, una vez compilado |

En este proyecto la diferencia es fácil de medir: `node_modules` completo pesa **49 MB**; sin las dependencias de desarrollo, **3,5 MB**. Ese 93% que sobra es TypeScript, tsx y esbuild — herramientas para escribir código, no para ejecutarlo.

`npm ci` falla si el `package.json` y el `package-lock.json` no coinciden. Eso es una virtud: en el servidor querés que el deploy se niegue antes que instalar una versión distinta de la que probaste.

## Las tres cosas del arranque

Están en [src/server.ts](src/server.ts), comentadas una por una. Son las tres que funcionan igual en tu máquina y fallan en un servidor, que es lo que las hace difíciles de encontrar.

**1. El puerto no lo elegís vos.** La plataforma corre muchas aplicaciones en la misma máquina y le pasa a cada una su puerto por variable de entorno. Si te aferrás al 3000, escuchás donde nadie te habla y el deploy muere con *"no open ports detected"*.

```ts
const PORT = Number(process.env.PORT) || 3000;
```

**2. La interfaz tampoco.** `0.0.0.0` es "aceptá conexiones por cualquier interfaz". `localhost` es "solo desde esta máquina", que dentro de un contenedor significa "solo desde adentro del contenedor" — el proxy de la plataforma queda del lado de afuera.

**3. Apagarse bien.** Para reemplazar tu aplicación por una versión nueva, la plataforma manda `SIGTERM` y espera. Si la ignorás, unos segundos después llega `SIGKILL`, que no se puede ignorar, y los requests que estaban a mitad de camino se cortan. Escuchar `SIGTERM` y cerrar ordenadamente es la diferencia entre un deploy invisible y uno que tira errores.

## El healthcheck

`GET /health` no hace nada y contesta 200. Es la ruta que la plataforma consulta cada pocos segundos para saber si seguís vivo; si deja de contestar, te reinicia. Sin healthcheck, lo único que la plataforma sabe es que **el proceso no se cayó**, que no es lo mismo que que la API esté respondiendo.

Tres reglas, y las tres tienen su motivo:

- **Barata.** Si consulta la base, un pico de carga hace que tarde, la plataforma te da por muerto y te reinicia justo cuando más tráfico tenías.
- **Sin token.** El que pregunta es un robot sin credenciales.
- **Callada.** Ni versiones de librerías ni rutas internas: es una URL pública.

## `NODE_ENV`

Una convención, no una función de Node. Vale `production` o `development`, y muchas librerías la miran solas: Express, por ejemplo, con `NODE_ENV=production` cachea las vistas y deja de mandar el stack trace en las respuestas de error.

```bash
# Windows (PowerShell)
$env:NODE_ENV="production"; npm start

# Linux / Mac
NODE_ENV=production npm start
```

En el hosting se configura desde el panel, junto con el resto de las variables.

## Lo que este ejemplo no tiene

Base de datos, autenticación, tests, y ningún archivo de configuración de ninguna plataforma. Todo eso está en el [11.2](../11.2-api-lista-para-produccion/), que es la API de verdad. Acá el tema es el build y nada más.
