# 6.2 - Express, todo en un archivo

> Clase "Arquitecturas en APIs de Node.js" · **Bloque 1** (segunda parte) y **Bloque 2**

La misma API de [6.1](../6.1-http-nativo/), ahora con **Express**. Menos de la mitad de líneas, y casi todas dicen _qué_ hace la API en vez de _cómo_ hablar HTTP: el ruteo, el parseo del body (`express.json()`), los headers y el 404 los resuelve el framework.

## El problema

Mirá el handler del `POST`: en pocas líneas conviven **cuatro responsabilidades distintas** — hablar HTTP, validar, aplicar reglas de negocio y guardar datos. Con dos endpoints no molesta. El problema aparece al crecer:

- **Más recursos** → un archivo enorme donde nadie encuentra nada.
- **Cambiar el array por una base de datos** → hay que tocar todos los handlers.
- **Testear la lógica de negocio** → imposible sin levantar el servidor.
- **Trabajar en equipo** → todos editan el mismo archivo.

La arquitectura **no se nota cuando el código funciona**: se nota cuando hay que cambiarlo. La respuesta a este problema es separar responsabilidades en capas (ver [6.3](../6.3-arquitectura-capas/)).

## Cómo ejecutar

```bash
npm install
npm run dev       # con recarga automática (nodemon)
# o bien: npm start
```

La API queda en `http://localhost:3000`. Probá los endpoints con `productos.http`.
