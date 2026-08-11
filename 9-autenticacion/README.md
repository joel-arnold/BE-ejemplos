# 9 - Autenticación y autorización

Ejemplos que acompañan la clase **"Autenticación y autorización"**. Siguen el mismo caso mínimo de las unidades 6, 7 y 8 (`productos` con `nombre` y `precio`), ahora con usuarios: hasta acá cualquiera podía borrar cualquier cosa.

El hilo de las cuatro unidades, en una línea por unidad:

- **6** separó la API en capas.
- **7** escribió los contratos como tipos.
- **8** le puso una base de datos abajo.
- **9** le pone una puerta: quién entra, y qué puede hacer una vez adentro.

## Recorrido

| Ejemplo | Bloque de la clase | Qué muestra |
| --- | --- | --- |
| [9.1-hash-contrasenas](9.1-hash-contrasenas/) | Bloque 3 | Por qué texto plano, cifrado y SHA-256 fallan. Salt, cost factor y `compare()` con bcrypt. |
| [9.2-jwt-anatomia](9.2-jwt-anatomia/) | Bloque 5 | Las tres partes de un JWT, el payload que se lee sin secret, tres intentos de falsificarlo y la expiración. |
| [9.3-api-auth](9.3-api-auth/) | Bloques 2, 4, 6, 7 y 8 | La API del `8.2` con `.env`, registro, login, middleware de auth, autorización por rol y por dueño, y CORS. |
| [9.4-cors](9.4-cors/) | Bloque 8 | CORS desde un navegador de verdad: el error real, el preflight y los cuatro modos de configurarlo. |

El **9.3 está pensado para abrirse al lado del [8.2](../8-persistencia-mikroorm/8.2-api-mikroorm/)**: la mitad de los archivos son idénticos y todo lo nuevo es autenticación, autorización y configuración.

## Antes de correr

Los **9.1, 9.2 y 9.4 no necesitan nada**: `npm install` y listo.

El **9.3 necesita MySQL** en `localhost:3306` (la base `dsw_auth` la crea `ensureDatabase()`) y, a diferencia de todas las unidades anteriores, **un archivo `.env`**:

```bash
cd 9.3-api-auth
cp .env.example .env      # Windows: copy .env.example .env
npm install
npm run dev
```

Que el proyecto no arranque sin `.env` es el punto del bloque 2, no un obstáculo: es la deuda que la unidad 8 dejó abierta a propósito con las credenciales hardcodeadas.

| Ejemplo | Necesita | Cómo se corre |
| --- | --- | --- |
| 9.1 | nada | `npm run plano` / `hash` / `verificar` |
| 9.2 | nada | `npm run anatomia` / `firma` / `expiracion` |
| 9.3 | MySQL + `.env` | `npm run dev`, después los `.http` |
| 9.4 | dos terminales + navegador | `npm run api` y `npm run front` |

## Las dos preguntas

Toda la unidad se ordena con dos preguntas que **no son la misma**:

| | Pregunta | Falla con | Dónde se responde |
| --- | --- | --- | --- |
| **Autenticación** | ¿Quién sos? | **401** | Un middleware, igual para toda la API |
| **Autorización** | ¿Podés hacer esto? | **403** | Depende de la regla: a veces un middleware, a veces el service |

El 401 dice "no sé quién sos" y se arregla yendo a loguearse. El 403 dice "sé quién sos, y no podés" — volver a loguearse no cambia nada.

> El nombre del 401 en el estándar es *Unauthorized*, pero significa **no autenticado**. El de autorización es el 403. El nombre quedó mal desde 1997.

## Las cuatro ideas

**1. La contraseña no se guarda.** Se guarda un hash de bcrypt: 60 caracteres con la versión, el cost, el salt y el hash, todo junto. Ni el sistema puede recuperarla — por eso existe *restablecer contraseña* y no *recordar contraseña*.

**2. El JWT no es secreto, es auténtico.** El payload se lee sin el secret (es base64, no encriptación), pero no se puede falsificar sin él. De ahí la regla: en el payload va el id y el rol, nunca nada privado.

**3. Lo que decide permisos no se le pregunta al cliente.** El dueño de un producto sale del token, no del body. El rol no se acepta en el registro. El algoritmo de verificación no se lee del header del token. Es siempre el mismo principio.

**4. CORS no protege tu API.** Protege al usuario de que una página cualquiera use su sesión. La API se protege con autenticación y autorización; CORS solo decide qué páginas pueden hablarle desde un navegador.

## Versiones y decisiones

| Paquete | Versión | Por qué |
| --- | --- | --- |
| `bcryptjs` | 3.0.3 | Mismo algoritmo que `bcrypt`, en JS puro: no necesita compilador. Detalle en el README de [9.1](9.1-hash-contrasenas/). |
| `jsonwebtoken` | 9.0.3 | Lo que van a encontrar en cualquier tutorial. Es CJS: solo funciona el import por default. |
| `dotenv` | 17.4.2 | Con `{ quiet: true }` para que no imprima su banner al arrancar. |
| `cors` | 2.8.6 | El middleware estándar de Express. |

El resto del stack lo heredan de las unidades 7 y 8: **ESM** con `"module": "NodeNext"`, **tsx** en desarrollo, MikroORM 7.1.11 con decoradores de `@mikro-orm/decorators/es` y `TsMorphMetadataProvider`.

## Lo que estos ejemplos no hacen

A propósito, para que la unidad entre en una clase:

- **No hay refresh tokens.** Un access token de 1 hora alcanza para el TP; los refresh agregan una máquina de estados completa.
- **No hay logout en el servidor.** Con JWT no hay nada que cerrar: el servidor no guardó nada. Ver el README de [9.2](9.2-jwt-anatomia/).
- **No hay recuperación de contraseña** (necesita mandar mails) ni **rate limiting** en el login (en producción va sí o sí).
- **Los roles son un string en la tabla de usuarios.** A partir de cierta complejidad eso se convierte en tablas de roles y permisos.
