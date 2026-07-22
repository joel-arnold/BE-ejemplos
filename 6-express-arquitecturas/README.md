# 6 - Express y arquitecturas de API

Ejemplos que acompañan la clase **"Arquitecturas en APIs de Node.js"**. Cada carpeta muestra **brevemente** uno de los bloques de la clase, usando siempre el mismo caso mínimo (`productos` con `nombre` y `precio`) para que se vea qué cambia de una estructura a la siguiente y no el dominio.

## Recorrido

| Ejemplo | Bloque de la clase | Qué muestra |
| --- | --- | --- |
| [6.1-http-nativo](6.1-http-nativo/) | Bloque 1 | La API con el módulo `http` nativo: toda la plomería a mano. |
| [6.2-express-un-archivo](6.2-express-un-archivo/) | Bloques 1 y 2 | La misma API con Express, todo en un archivo — y por qué eso es un problema al crecer. |
| [6.3-arquitectura-capas](6.3-arquitectura-capas/) | Bloques 3 y 4 | Routes, controllers, services, repositories + middleware, agrupados **por rol técnico**. |
| [6.4-arquitectura-feature](6.4-arquitectura-feature/) | Bloque 4 | Las mismas capas, agrupadas **por feature** (dos recursos: productos y usuarios). |
| [6.5-arquitectura-hexagonal](6.5-arquitectura-hexagonal/) | Bloque 5 | Puertos y adaptadores con inversión de dependencias (versión light de Hexagonal / Clean). |

La progresión es acumulativa: cada ejemplo resuelve un dolor del anterior. La idea que ordena todo es la misma en los cinco: **separar responsabilidades** y que **las dependencias apunten en una sola dirección** (HTTP arriba, datos abajo, la lógica de negocio sin depender de Express).

## Bloques 6 y 7 (sin código)

Estos dos bloques de la clase son conceptuales y no tienen un ejemplo propio:

- **Bloque 6 — Monolito, monolito modular, microservicios**: responde otra pregunta, *¿cuántas aplicaciones desplegables tenés?*, no cómo ordenar el código adentro. Todos estos ejemplos son **monolitos**; el 6.4 (por feature) es la antesala natural de un **monolito modular**. La recomendación por defecto es *monolith first*.
- **Bloque 7 — Cómo elegir**: la arquitectura se elige por el problema y el equipo, no por prestigio. Test rápido: si tu lógica de negocio no importa nada de Express ni sabe qué base de datos hay debajo, elegiste bien — se llame como se llame.

## Cómo ejecutar cualquiera

Cada carpeta es un proyecto independiente en **JavaScript puro** (ESM). No hay paso de compilación: se corren con Node directamente.

```bash
cd 6-express-arquitecturas/6.3-arquitectura-capas   # o el que quieras
npm install
npm run dev       # con recarga automática (nodemon)
# o bien: npm start
```

Todos levantan en `http://localhost:3000`. Para probar los endpoints hay un archivo `.http` en cada carpeta.
