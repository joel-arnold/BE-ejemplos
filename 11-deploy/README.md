# 11 - Deploy

Ejemplos que acompañan la clase **"Deploy"**, la última de la materia. Siguen el mismo caso mínimo de las unidades 6 a 10 (`productos` con `nombre` y `precio`), ahora con lo único que le falta a la API: **que exista fuera de tu máquina**.

Hasta acá todo corrió en `localhost:3000`. Funciona perfecto y no lo puede usar nadie más que vos.

El hilo de las seis unidades, en una línea cada una:

- **6** separó la API en capas.
- **7** escribió los contratos como tipos.
- **8** le puso una base de datos abajo.
- **9** le puso una puerta.
- **10** le puso una red de seguridad.
- **11** la saca de tu máquina — y ahí se cobra todo lo anterior de golpe.

Eso último no es una frase de cierre: es literal. El `.env` de la unidad 9 existe porque en producción la configuración no puede estar en el código. Las migraciones de la 8.4 existen porque contra una base con datos no se puede sincronizar el esquema a lo bruto. Los tests de la 10 existen para que un servidor pueda negarse a publicar una versión rota. Cada una de esas decisiones se justificó con "esto se va a necesitar cuando la API esté en internet". Esta unidad es ese momento.

## Recorrido

| Ejemplo | Bloque de la clase | Qué muestra |
| --- | --- | --- |
| [11.1-build-produccion](11.1-build-produccion/) | Bloques 2 y 3 | De `tsx` a `dist/`: el build, qué se sube al servidor, y las tres cosas del arranque que en tu máquina daban igual |
| [11.2-api-lista-para-produccion](11.2-api-lista-para-produccion/) | Bloques 4 a 7 | La API de la unidad 9 pasada por el checklist de producción, contra una base gestionada y publicada en Render — con la guía paso a paso |
| [11.3-ci-github-actions](11.3-ci-github-actions/) | Bloque 8 | El servidor que corre `npm test` antes de publicar y se niega a subir una versión rota |

Son **tres y no cuatro** como en las unidades anteriores, a propósito: el tema es ancho pero no profundo, y entra en una clase.

## Antes de correr

El `11.1` y el `11.3` no necesitan nada: `npm install` y listo. Ninguno de los tres necesita una cuenta en ningún lado para leerse y correrse local.

| Ejemplo | Necesita | Cómo se corre |
| --- | --- | --- |
| 11.1 | nada | `npm run dev`, `npm run build`, `npm start` |
| 11.2 | MySQL local y `.env` (o una base en la nube) | `npm run dev`, `npm run build`, `npm start` |
| 11.3 | nada | `npm test`, `npm run check`, `npm run build` |

El `11.2` usa su propia base, `dsw_deploy`, y el `.env.example` apunta a `localhost` — se corre igual que el `9.3` de la unidad 9. Para publicarlo de verdad hacen falta dos cuentas gratuitas ([Aiven](https://aiven.io/) y [Render](https://render.com/)), **ninguna de las dos pide tarjeta**, y el paso a paso está en su README.

## El código de negocio no cambia

Vale decirlo antes de abrir nada, porque es lo que más sorprende: entre el `9.3` y el `11.2` **los services, controllers, repositories, entidades y schemas son idénticos**. Ni una línea.

Lo que cambia es todo lo que rodea al negocio: de dónde sale la configuración, cómo arranca el proceso, cómo se apaga, cómo se conecta a la base y qué cuenta cuando algo sale mal. Deployar no es reescribir la aplicación — es terminar de resolver lo que la aplicación daba por sentado.

## Las ocho cosas que hay que arreglar

Todas están comentadas en su archivo del `11.2`. Lo que las hace difíciles de encontrar es que **las ocho funcionan igual en tu máquina**: no hay manera de darse cuenta de que faltan hasta que el deploy falla.

| # | Qué | Qué pasa si falta |
| --- | --- | --- |
| 1 | El puerto sale de `process.env.PORT` | *"No open ports detected"* |
| 2 | Escuchar en `0.0.0.0`, no en `localhost` | Igual: el proxy de la plataforma queda afuera |
| 3 | `SIGTERM` y cierre ordenado | Cada deploy corta los requests en curso |
| 4 | Healthcheck barato y sin token | La plataforma no sabe si estás vivo |
| 5 | TLS contra la base | La base gestionada rechaza la conexión |
| 6 | Migraciones en vez de `schema.update()` | Un renombre de campo borra una columna con datos |
| 7 | `"declaration": true` en el `tsconfig` | El ORM no arranca desde `dist/` |
| 8 | El 500 no cuenta nada | El stack trace se lo lleva quien pegue a la API |

La 7 es la específica de nuestro stack y no aparece en ningún tutorial de deploy: `TsMorphMetadataProvider` lee los **tipos** de los archivos TypeScript para armar el esquema, y en `dist/` hay JavaScript. Con `declaration: true`, `tsc` emite los `.d.ts` al lado de cada `.js` y ahí están los tipos que el ORM necesita.

## Las cuatro ideas

**1. Deployar es resolver lo que la aplicación daba por sentado.** El puerto, la dirección, cuánto vive el proceso, quién le pasa la configuración, qué pasa cuando lo apagan. En tu máquina esas preguntas tienen respuestas obvias, y por eso nunca las hiciste.

**2. Lo que cambia entre ambientes es configuración, no código.** Un solo build, muchas configuraciones. En el momento en que aparece un `if (estoyEnProduccion)` alrededor de lógica de negocio, lo que corre en el servidor dejó de ser lo que probaste.

**3. Fallá al arrancar y en voz alta.** El `env.ts` valida la configuración y mata el proceso si falta algo. En producción eso vale el doble: el log del deploy dice exactamente qué falta, en vez de dejarte una API que levanta y explota en el primer login.

**4. El primer deploy siempre falla.** No es una posibilidad, es el trámite. La habilidad que hay que llevarse de esta unidad no es acertar de una: es **leer el log y saber qué mirar**.

## Las plataformas

Las dos tienen plan gratuito indefinido y ninguna pide tarjeta.

| | Para qué | El detalle |
| --- | --- | --- |
| [Render](https://render.com/) | correr la API | El plan gratis **duerme el servicio a los 15 minutos** sin tráfico; el primer request tarda entre 30 y 60 segundos en despertarlo |
| [Aiven](https://aiven.io/) | la base MySQL | 1 CPU, 1 GB de RAM, 1 GB de disco, un servicio gratis por tipo y por cuenta |

Render también ofrece bases de datos, pero las gratuitas **se borran a los 30 días**. Para algo que tiene que sobrevivir hasta la defensa del TP, conviene la base afuera.

Si el proyecto usa PostgreSQL en vez de MySQL, [Neon](https://neon.tech/) es la equivalente de Aiven y tiene un plan gratuito muy bueno.

Lo de los 15 minutos vale saberlo antes de la defensa: **entrar a la URL diez minutos antes** de mostrarla es todo el truco.

## Lo que estos ejemplos no hacen

A propósito, para que la unidad entre en una clase:

- **No hay Docker.** Es la herramienta que hace que el "anda en mi máquina" deje de ser un problema del todo, y es su propia clase. La cátedra tiene diapositivas.
- **No hay dominio propio, ni CDN, ni monitoreo, ni alertas.** Todo eso existe y es lo que sigue.
- **No se deploya el front.** Un front de Angular o React es otra cosa: archivos estáticos, sin proceso Node corriendo. Vercel, Netlify o Cloudflare Pages lo hacen en dos clics.
- **No hay escalado, ni balanceo, ni réplicas.** Una instancia de 512 MB aguanta un TP y bastante más.
