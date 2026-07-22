# 6.1 - HTTP nativo (sin Express)

> Clase "Arquitecturas en APIs de Node.js" · **Bloque 1** (primera parte)

La misma API de productos (`GET` + `POST`) escrita **solo con el módulo `http`** del core de Node, sin instalar nada. Funciona idéntico a la versión con Express, pero muestra **todo lo que hay que hacer a mano**:

- Rutear comparando `req.method` y `req.url` con `if`.
- Juntar el body _chunk por chunk_ escuchando eventos `data`/`end`.
- Parsear el JSON con su propio `try/catch`.
- Escribir `Content-Type` y el status en cada respuesta.
- Devolver el 404 uno mismo.

Y eso con **un solo recurso**: con diez, esa cadena de `if` se vuelve inmanejable. Ese es el "problema" que resuelve Express (ver [6.2](../6.2-express-un-archivo/)).

## Idea para remarcar

Express **no agrega poder** que Node no tenga: por debajo sigue usando este mismo módulo `http`. Lo que aporta es una capa fina que se lleva puesta la plomería repetitiva.

## Cómo ejecutar

```bash
npm install       # solo para tener nodemon; no usa dependencias de producción
npm run dev       # con recarga automática (nodemon)
# o bien:
npm start         # node a secas
```

La API queda en `http://localhost:3000`. Probá los endpoints con `productos.http`.
