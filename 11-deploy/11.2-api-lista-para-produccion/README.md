# 11.2 - La API en internet

La API de la unidad 9 —capas, tipos, MySQL, usuarios y JWT— pasada por el checklist de producción y publicada en un servidor de verdad, con una URL que se puede mandar por mensaje.

Es el último eslabón de la cadena que arrancó en la unidad 6:

`6.3` capas → `7.2` tipos → `7.3` validación → `8.2` persistencia → `9.3` autenticación → **`11.2` producción**

**El código de negocio no cambió ni una línea.** Los services, los controllers, los repositories, las entidades y los schemas son exactamente los del `9.3`. Lo que cambió es todo lo que rodea al negocio: de dónde sale la configuración, cómo arranca el proceso, cómo se apaga, cómo se conecta a la base y qué cuenta cuando algo sale mal.

## Correrlo en tu máquina

Igual que el `9.3`, con una base propia (`dsw_deploy`):

```bash
cp .env.example .env      # Windows: copy .env.example .env
npm install
npm run dev
```

Hay `auth.http` y `productos.http` con todos los casos. Son los mismos de la unidad 9, con una línea al principio para apuntarlos a la API publicada en vez de a localhost.

Para verlo como lo va a ver el servidor:

```bash
npm run build             # tsc: src/ -> dist/
npm start                 # node dist/server.js
```

## Los ocho cambios

Ninguno es difícil. Lo que los hace difíciles de encontrar es que **los ocho funcionan igual en tu máquina**: no hay forma de darse cuenta de que faltan hasta que el deploy falla.

| # | Qué | Dónde | Qué pasa si falta |
| --- | --- | --- | --- |
| 1 | El puerto sale de `process.env.PORT` | [src/server.ts](src/server.ts) | *"No open ports detected"*: el deploy no termina nunca |
| 2 | Escuchar en `0.0.0.0` | [src/server.ts](src/server.ts) | Igual que el anterior: el proxy queda afuera |
| 3 | `SIGTERM` y cierre ordenado | [src/server.ts](src/server.ts) | Cada deploy corta los requests en curso |
| 4 | Healthcheck en `/health` | [src/app.ts](src/app.ts) | La plataforma no sabe si estás vivo |
| 5 | TLS contra la base | [src/mikro-orm.config.ts](src/mikro-orm.config.ts) | La base gestionada rechaza la conexión |
| 6 | Migraciones en vez de `schema.update()` | [src/db.ts](src/db.ts) | Un renombre de campo borra una columna con datos |
| 7 | `declaration: true` | [tsconfig.json](tsconfig.json) | El ORM no arranca desde `dist/` (ver abajo) |
| 8 | El error no cuenta de más | [src/shared/errorHandler.ts](src/shared/errorHandler.ts) | El stack trace se lo lleva quien pegue a la API |

Cada uno está comentado en su archivo, con el motivo.

### El 7, que es el específico de nuestro stack

Este no está en ningún tutorial de deploy porque es consecuencia de una decisión de la unidad 8. Usamos `TsMorphMetadataProvider`: para saber que `precio: number` es un decimal, MikroORM **lee los tipos de los archivos TypeScript** al arrancar. En el servidor corre `node dist/server.js`, y en `dist/` hay JavaScript, que no tiene tipos.

Sin `"declaration": true`, la aplicación muere al arrancar:

```
MetadataError: Source file './dist/entities/usuario.entity.ts' not found.
Check your 'entitiesTs' option and verify you have 'compilerOptions.declaration'
enabled in your 'tsconfig.json'.
```

Es de los pocos errores que traen la solución adentro. Con `declaration: true`, `tsc` emite también los `.d.ts` al lado de cada `.js`, y ahí están los tipos que el ORM necesita.

> **Ojo con probarlo en tu máquina.** MikroORM guarda un caché de metadata en `temp/`. Si ya corriste el proyecto en desarrollo, ese caché tapa el problema y `npm start` anda aunque falte la línea. En el servidor, donde se clona limpio, no anda. Para reproducirlo de verdad hay que borrar `temp/` primero.

Para proyectos más grandes existe una salida mejor: generar el caché en el build (`mikro-orm cache:generate --combined`) y dejar de necesitar `ts-morph` en producción. Es un paso más y para el TP no hace falta.

## Publicarlo: la guía paso a paso

Dos servicios, en este orden. **La base primero**, porque la API no arranca sin ella.

Los planes gratuitos alcanzan de sobra para el TP y **ninguno de los dos pide tarjeta**.

### Paso 1 — La base de datos (Aiven)

Render también ofrece bases, pero las gratuitas **se borran a los 30 días**. Para algo que tiene que sobrevivir hasta la defensa del TP, conviene otra cosa.

1. Crear cuenta en [aiven.io](https://aiven.io/) y elegir **Aiven for MySQL**, plan **Free** (1 CPU, 1 GB de RAM, 1 GB de disco, sin límite de tiempo). Se puede tener un servicio gratis por tipo y por cuenta.
2. Elegir región. Cuanto más cerca de la región de la API, menos latencia: si Render va a estar en Oregon, poner la base en un datacenter de Estados Unidos y no en Europa. Cada consulta cruza esa distancia.
3. Esperar a que el servicio pase de *Rebuilding* a **Running** (unos minutos).
4. En **Connection information** están los cinco valores que van al `.env`, y el botón para descargar el `ca.pem`.

| Aiven lo llama | En nuestro `.env` |
| --- | --- |
| Host | `DB_HOST` |
| Port | `DB_PORT` |
| User | `DB_USER` |
| Password | `DB_PASSWORD` |
| Database name (`defaultdb`) | `DB_NAME` |
| CA certificate (`ca.pem`) | `DB_SSL_CA` |

El `ca.pem` se abre con un editor de texto y se copia **entero**, incluidas las líneas `-----BEGIN CERTIFICATE-----` y `-----END CERTIFICATE-----`.

Antes de seguir, conviene probar la base **desde tu máquina**: poner esos valores en tu `.env` local y correr `npm run dev`. Si arranca y aplica las migraciones, la base está bien y el resto de los problemas van a ser del hosting. Separar los dos pasos ahorra mucho tiempo de adivinanza.

> Si preferís PostgreSQL, [Neon](https://neon.tech/) tiene un plan gratuito muy bueno. Para MikroORM el cambio es chico —`@mikro-orm/postgresql` en vez de `@mikro-orm/mysql`— pero hay que regenerar las migraciones, porque el SQL que emiten no es el mismo.

### Paso 2 — La API (Render)

1. Subir el proyecto a un repositorio de GitHub. Verificar que el `.env` **no** esté ahí (`git status` no lo tiene que nombrar; el `.gitignore` del repositorio ya lo cubre).
2. En [render.com](https://render.com/): **New > Web Service**, conectar la cuenta de GitHub y elegir el repositorio.
3. Configurar:

| Campo | Valor |
| --- | --- |
| Language | Node |
| Root Directory | la carpeta del proyecto, si el repositorio tiene varios |
| Build Command | `npm ci && npm run build` |
| Start Command | `npm start` |
| Health Check Path | `/health` |
| Instance Type | Free |

4. En **Environment**, cargar las variables. Todas las del `.env.example` **menos `PORT`**, que la pone Render:

```
NODE_ENV       production
DB_HOST        mysql-xxxx.aivencloud.com
DB_PORT        12345
DB_NAME        defaultdb
DB_USER        avnadmin
DB_PASSWORD    ...
DB_SSL_CA      -----BEGIN CERTIFICATE-----  (el ca.pem entero)
JWT_SECRET     uno nuevo, distinto al de tu .env
JWT_EXPIRES_IN 1h
CORS_ORIGIN    https://tu-front.vercel.app,http://localhost:4200
```

5. **Create Web Service**, y mirar el log.

El `JWT_SECRET` de producción tiene que ser **otro**, no el de tu `.env`. Si son el mismo, cualquiera que vea tu repositorio puede firmar tokens que el servidor de verdad acepta. Se genera con:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Todo eso, escrito

[render.yaml](render.yaml) es exactamente la configuración de arriba, versionada. La primera vez conviene hacerlo a mano para ver qué es cada cosa; después, este archivo es lo que hace que el deploy sea reproducible y revisable en un pull request, en vez de una configuración que solo existe en el panel de alguien.

## Cuando falle

Va a fallar. La primera vez le falla a todo el mundo, y la habilidad que hay que llevarse de esta unidad no es acertar de una: es **leer el log**.

| Lo que dice el log | Qué es |
| --- | --- |
| `No open ports detected` | Te aferraste al 3000, o escuchás en `localhost` en vez de `0.0.0.0` |
| `✖ Falta configuración o está mal: JWT_SECRET` | Falta una variable en el panel. Lo dice porque el `env.ts` la valida al arrancar |
| `Source file './dist/...ts' not found` | Falta `"declaration": true` en el `tsconfig.json` |
| `ETIMEDOUT` / `ECONNREFUSED` al conectar | Host o puerto de la base equivocados, o la base todavía no terminó de crearse |
| `Connections using insecure transport are prohibited` | Falta el `DB_SSL_CA`: la base gestionada no acepta conexiones sin TLS |
| `Cannot find module 'typescript'` | El build corrió con `--omit=dev`. TypeScript es `devDependency` y el build lo necesita |
| Compila y muere sin decir nada | Casi siempre memoria: el plan gratis da 512 MB y `tsc` sobre un proyecto grande se acerca |

El error que más cuesta es el que **no** aparece: el deploy dice *"Live"*, la URL contesta, y el front sigue viendo un error de CORS. Ahí no hay nada roto — falta el dominio del front en `CORS_ORIGIN`, con `https://` y sin barra final.

## Lo que cambia cuando está en internet

**Se duerme.** El plan gratuito de Render apaga el servicio después de **15 minutos sin tráfico**, y el primer request lo despierta: entre 30 y 60 segundos de espera, con la base reconectando encima. No es un bug, es el trato. Vale saberlo antes de la defensa del TP: **entrar a la URL diez minutos antes** de mostrarla es todo el truco.

**No hay consola.** El `console.log` sigue existiendo, pero sale en el panel de la plataforma, mezclado con todo lo demás y con un límite de retención. Por eso el `errorHandler` de acá le pone un identificador a cada 500: el usuario dice "me tiró error 3f9a2b" y eso se busca en el log.

**Cualquiera le pega.** A las pocas horas de estar publicada, el log va a tener requests a `/wp-login.php`, `/.env` y `/admin`. Son robots que barren internet buscando servidores mal configurados. Es normal, y es la mejor manera de entender por qué el `.env` no va al repositorio y por qué el 500 no cuenta nada.

**Cambiar algo implica un deploy.** Se acabó el `npm run dev` que recarga al guardar. Cada cambio es commit, push, build y arranque: dos o tres minutos en los que la versión vieja sigue andando hasta que la nueva pasa el healthcheck.

## Lo que este ejemplo no hace

- **No usa Docker.** Render detecta el proyecto Node y lo construye solo. Docker es la herramienta que hace que el "anda en mi máquina" deje de ser un problema del todo, y es su propia clase.
- **No corre las migraciones en un paso aparte.** Van al arrancar ([src/db.ts](src/db.ts)) porque el plan gratuito no tiene *pre-deploy command*. Lo prolijo es separarlas, para que una migración fallida no deje la aplicación en un bucle de reinicios.
- **No tiene dominio propio, ni CDN, ni monitoreo, ni alertas.** Todo eso existe y es lo que sigue.
- **No deploya el front.** Un front de Angular o React es otra cosa: archivos estáticos, sin proceso Node corriendo. Vercel, Netlify o Cloudflare Pages lo hacen en dos clics.
