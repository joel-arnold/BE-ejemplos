# 9.4 - CORS, visto desde el navegador

> Clase "Autenticación y autorización" · **Bloque 8**

Dos servidores y un HTML, para ver el error de CORS de verdad — con la consola del navegador abierta y el log de la API al lado.

Es el único ejemplo de la materia que necesita un navegador, y no es capricho: **CORS no existe fuera del navegador**. Los `.http` de las otras carpetas, Postman y `curl` nunca van a mostrar este error, y esa es exactamente la razón por la que aparece recién cuando el front se conecta.

## Correrlo

Hacen falta **dos terminales**. No hay base de datos: los productos son un array y el login acepta cualquier cosa.

```bash
npm install

# Terminal 1 - la API en :3000
npm run api

# Terminal 2 - el front en :5173
npm run front
```

Y después abrir **http://localhost:5173** con la consola del navegador (F12) ya abierta.

## Los cuatro modos

El modo se cambia con una variable de entorno, sin tocar código. En PowerShell: `$env:CORS='estricto'; npm run api`.

| Modo | Configuración | Qué pasa en el front |
| --- | --- | --- |
| `npm run api` | sin CORS | Falla **todo**, hasta el GET |
| `CORS=abierto` | `cors()` | Anda todo, y **está mal** |
| `CORS=sin-auth` | `origin` ok, `allowedHeaders: ['Content-Type']` | El GET anda, el POST con token **no** |
| `CORS=estricto` | origen y headers declarados | Anda todo, y está bien |

El interesante es el tercero.

## Qué es CORS, en dos frases

El navegador tiene una regla vieja llamada **same-origin policy**: el JavaScript de una página solo puede leer respuestas de su mismo origen. Un **origen** es la terna esquema + host + puerto, y los tres tienen que coincidir — `localhost:5173` y `localhost:3000` son orígenes distintos.

**CORS** es el mecanismo por el cual el servidor puede levantar esa restricción para orígenes específicos, mandando unos headers en la respuesta.

Dos consecuencias que ordenan todo lo demás:

- **La restricción la aplica el navegador, no el servidor.** Por eso `curl`, Postman y los `.http` nunca dan error de CORS: no son navegadores y no tienen por qué proteger a nadie.
- **CORS no protege tu API.** Protege al *usuario* de que una página cualquiera use su sesión sin que se entere. Cualquiera puede pegarle a tu API desde una terminal, con o sin CORS. Confundir CORS con seguridad de la API es un error común: la seguridad la dan la autenticación y la autorización.

## El error que hay que ver

Con la API sin CORS, el botón 1 falla y la consola del navegador dice algo así:

```
Access to fetch at 'http://localhost:3000/api/productos' from origin
'http://localhost:5173' has been blocked by CORS policy: No
'Access-Control-Allow-Origin' header is present on the requested resource.
```

Y ahora **mirá el log de la API**:

```
GET     /api/productos       origin: http://localhost:5173
```

El request **llegó**. El servidor **contestó 200**. Lo que el navegador bloqueó es que esta página *lea* la respuesta.

Eso explica dos cosas que desconciertan:

1. Un `POST` bloqueado por CORS **igual puede haber creado el registro**. El navegador no cancela nada, solo esconde la respuesta.
2. Del lado del JavaScript, `fetch` rechaza con un `TypeError: Failed to fetch` sin ningún detalle. El motivo real solo aparece en la consola. Es a propósito: si el error contara qué respondió el servidor, sería una forma de leer la respuesta.

## El preflight

El botón 3 manda un POST con el header `Authorization`. Antes de mandarlo, el navegador manda **solo** un request que nadie escribió:

```
OPTIONS /api/productos
Origin: http://localhost:5173
Access-Control-Request-Method: POST
Access-Control-Request-Headers: authorization, content-type
```

Es el **preflight**: "che, ¿me dejás mandar un POST con estos headers?". Si la respuesta no autoriza, **el POST no se manda nunca**. En el log de la API se ve el `OPTIONS` y no se ve el `POST`.

No todos los requests lo disparan. Los que el estándar considera **simples** —un `GET`, o un `POST` de formulario— salen directo, porque son cosas que una página ya podía hacer con un `<form>` desde antes de que existiera `fetch`. Un request se vuelve *no simple*, y dispara preflight, en cuanto lleva:

- un método que no sea `GET`, `HEAD` o `POST`, o
- un `Content-Type: application/json`, o
- un header propio como `Authorization`.

Es decir: **casi cualquier request de una API REST con login dispara preflight**.

## El modo `sin-auth`: el error de esta clase

Este es el que más tiempo hace perder, porque parece que CORS ya está resuelto:

```ts
app.use(cors({ origin: 'http://localhost:5173', allowedHeaders: ['Content-Type'] }));
```

El origen está bien. El GET público anda perfecto. Y el POST con token falla, con un mensaje sobre `Access-Control-Allow-Headers` que nadie lee entero.

Falta `Authorization` en la lista. El preflight contesta que solo autoriza `Content-Type`, el navegador ve que no alcanza y corta.

Y hay un detalle que sorprende: **si no se pasa `allowedHeaders`, el paquete `cors` copia en la respuesta los headers que el preflight pidió**, y entonces `Authorization` pasa sin problema. O sea que declarar la lista a medias es *peor* que no declararla. Por eso este error aparece justo cuando alguien "se puso a configurar CORS bien".

## `origin: '*'` no es la solución

Es lo primero que aparece buscando el error, y "arregla" el problema al instante:

```ts
app.use(cors());   // origin: '*'
```

Con eso, **cualquier página del mundo** puede llamar a tu API desde el navegador de tu usuario. Para una API pública de solo lectura puede estar bien. Para una con login, no.

Hay además un límite técnico: `origin: '*'` es **incompatible con `credentials: true`**. Si en algún momento el front manda cookies, el navegador rechaza la combinación y hay que declarar el origen exacto igual.

La versión correcta es la del modo `estricto`, con el origen leído de una variable de entorno porque cambia por ambiente — como en el [9.3](../9.3-api-auth/).

## Checklist para cuando falle

En este orden, que es el de más frecuente a menos:

1. ¿El middleware de CORS está **antes** que las rutas? Si un error se produce después y la respuesta sale sin headers de CORS, el front ve un error de CORS en vez del 500 real.
2. ¿El `origin` configurado es **exactamente** el del front? Con el puerto, y **sin barra al final**: `http://localhost:4200`, no `http://localhost:4200/`.
3. Si declaraste `allowedHeaders`, ¿está `Authorization`?
4. Si declaraste `methods`, ¿está el que estás usando? El `DELETE` se olvida seguido.
5. ¿Estás mirando el error en la **consola del navegador**? El mensaje de `fetch` no dice nada.
6. ¿El request llegó al servidor? Si llegó, el problema es de headers de respuesta, no de red.

## Un poco más lejos

- El `Origin` lo pone el navegador y **no se puede falsificar desde JavaScript**: es una de las pocas cosas que la página no controla. Por eso el servidor puede confiar en él para esta decisión.
- `Access-Control-Max-Age` le dice al navegador cuántos segundos puede cachear la respuesta del preflight. Sin eso, cada POST son dos viajes de ida y vuelta.
- Si el front necesita **leer un header** de la respuesta que no sea de los estándar (por ejemplo `X-Total-Count` para paginar), hay que declararlo en `exposedHeaders`. Es el mismo tipo de olvido que el de `allowedHeaders`, del lado de la respuesta.
