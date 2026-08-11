# 9.2 - JWT por dentro

> Clase "Autenticación y autorización" · **Bloque 5**

Tres archivos sin servidor y sin base de datos, para abrir un JWT y mirarlo. La idea es que cuando aparezca en la API del [9.3](../9.3-api-auth/) no sea magia.

## Correrlo

```bash
npm install
npm run anatomia     # 9.2.1 - las tres partes, y por qué el payload NO es secreto
npm run firma        # 9.2.2 - tres intentos de falsificar un token, y por qué fallan
npm run expiracion   # 9.2.3 - iat, exp, claims estándar y cuánto debería durar
```

## Recorrido

| Archivo | Qué muestra |
| --- | --- |
| [9.2.1-anatomiaDelToken.ts](src/9.2.1-anatomiaDelToken.ts) | `sign()`, las tres partes separadas por punto, el payload decodificado **sin el secret**, y `decode()` vs `verify()`. |
| [9.2.2-firmaYManipulacion.ts](src/9.2.2-firmaYManipulacion.ts) | Editar el payload para ponerse admin, firmar con otro secret y el ataque `alg: none`. Los tres fallan, cada uno por su motivo. |
| [9.2.3-expiracionYClaims.ts](src/9.2.3-expiracionYClaims.ts) | `iat`/`exp`, `TokenExpiredError` vs `JsonWebTokenError`, los claims reservados y el problema de elegir la duración. |

## El problema que resuelve

**HTTP no tiene memoria.** Cada request llega solo, sin ninguna relación con el anterior. El servidor verificó la contraseña de Ana en el `POST /login`, y en el siguiente request no tiene idea de quién es.

Un JWT es la prueba que el cliente vuelve a presentar en cada request. El servidor no guarda nada: le alcanza con verificar la firma.

## Las dos frases que hay que llevarse

**1. El payload se lee sin el secret.** Es JSON en base64url, y base64 no es encriptación. Cualquiera con el token lo lee: el usuario, una extensión del navegador, jwt.io. Por eso **nunca** va nada privado en el payload — ni contraseñas, ni hashes, ni datos personales. Va el id del usuario, el rol y la expiración: cosas que el propio usuario ya sabe de sí mismo.

**2. El payload no se puede falsificar.** La firma es `HMAC-SHA256(header.payload, SECRET)`. Cambiar una letra del payload invalida la firma, y recalcularla requiere el secret del servidor.

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicm9sIjoidXN1YXJpbyJ9.xR7f...
└──────────── header ───────────────┘ └────────── payload ──────────────┘ └ firma ┘
       {"alg":"HS256","typ":"JWT"}      {"sub":"1","rol":"usuario",...}    HMAC con
              base64url                        base64url                  el SECRET
```

Un JWT no es **secreto**. Es **auténtico**. Son dos propiedades distintas y confundirlas es el error más caro de la unidad.

## `decode()` nunca, `verify()` siempre

| | Chequea la firma | Chequea `exp` | Necesita el secret |
| --- | --- | --- | --- |
| `jwt.decode()` | No | No | No |
| `jwt.verify()` | Sí | Sí | Sí |

En el servidor, cualquier decisión se toma con `verify()`. `decode()` sirve del lado del cliente, para mostrar el nombre del usuario en la barra sin volver a pedirlo — ahí no se está autorizando nada.

## El secret

Todo el esquema se apoya en una sola pieza secreta:

- **Largo y aleatorio**, 32 bytes o más. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
- **Fuera del código**, en una variable de entorno. Es lo que se hace en el [9.3](../9.3-api-auth/).
- **Distinto** en desarrollo y en producción.
- Si se filtra, cualquiera emite tokens válidos para cualquier usuario. Cambiarlo invalida todos los tokens vigentes de una — que es exactamente lo que se quiere en ese caso.

## Lo que la firma no resuelve

Un token copiado del navegador de otra persona **funciona igual de bien**: es válido, la firma cierra y no venció. La firma prueba que el token lo emitió el servidor, no que lo esté usando su dueño.

De ahí las tres precauciones reales:

1. **HTTPS siempre**, para que no se pueda leer en tránsito.
2. **Expiración corta.** Un token robado sirve hasta que vence.
3. No dejarlo donde cualquier script de la página lo pueda leer, si se puede evitar.

El punto 2 es la contra grande del enfoque: los JWT son **autocontenidos**, el servidor no guarda nada y por lo tanto **no tiene dónde tachar un token**. El "cerrar sesión" borra el token del cliente, pero una copia sigue sirviendo hasta el `exp`. La alternativa clásica son las **sesiones en el servidor**, donde el logout es borrar una fila; el precio es perder el "sin estado" que hace fácil escalar la API a varias instancias.

Los **refresh tokens** son la solución de compromiso: un access token de minutos más un refresh token de días guardado en la base (donde sí se puede revocar). Quedan fuera de esta unidad a propósito: agregan una máquina de estados completa y el concepto se entiende igual sin ellos.

## Un detalle de ESM que muerde

`jsonwebtoken` es un paquete **CommonJS** y nuestros proyectos son **ESM** (unidad 7). Solo funciona el import por default:

```ts
import jwt from 'jsonwebtoken';           // ✔
import { TokenExpiredError } from 'jsonwebtoken';   // ✘ compila, explota al correr
```

El segundo pasa el chequeo de tipos —los `@types` declaran los named exports— y falla en runtime con `does not provide an export named 'TokenExpiredError'`. Las clases de error se sacan del default: `jwt.TokenExpiredError`. Es un recordatorio útil de que **los tipos no son el runtime**.
