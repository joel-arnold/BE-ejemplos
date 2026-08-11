# 5 - Clases

Ejemplos que acompañan la clase **"Clases en JavaScript"**. Retoman donde quedó la unidad 4: `class` es azúcar sintáctico sobre los prototipos que se vieron ahí, y estos archivos lo comprueban.

Desde acá el dominio pasa de `Persona` a **`Producto`** (con `nombre` y `precio`), que es el mismo caso mínimo que usan las unidades 6, 7 y 8. La clase `Producto` que se escribe en el `5.2` es, casi sin cambios, la entidad que después se guarda en la base de datos.

## Recorrido

| Ejemplo | Bloque de la clase | Qué muestra |
| --- | --- | --- |
| [5.1-definicionClase.js](5.1-definicionClase.js) | Bloque 1 | La misma clase escrita como función constructora y como `class`, y la prueba de que por debajo son lo mismo. Las cuatro reglas que `class` sí agrega. |
| [5.2-anatomiaClase.js](5.2-anatomiaClase.js) | Bloque 2 | Campos de instancia, constructor y métodos. Dónde vive cada cosa: los datos en la instancia, los métodos en el prototipo. Métodos `async`. |
| [5.3-gettersSetters.js](5.3-gettersSetters.js) | Bloque 3 | `get` y `set`, la validación que evita el `NaN` tres archivos más adelante, y el setter que se llama a sí mismo. |
| [5.4-propiedadPrivada.js](5.4-propiedadPrivada.js) | Bloque 4 | Campos y métodos privados con `#`: la regla de negocio que no se puede esquivar. |
| [5.5-miembrosEstaticos.js](5.5-miembrosEstaticos.js) | Bloque 4 | `static`: constantes, contadores y métodos fábrica. Por qué `Math.random()` se llama así. |
| [5.6-herencia.js](5.6-herencia.js) | Bloque 5 | `extends` y los dos usos de `super`. Por qué `super()` va primero. La cadena de prototipos e `instanceof`. |
| [5.7-polimorfismo.js](5.7-polimorfismo.js) | Bloque 5 | El mismo mensaje con distinta respuesta, y el `if` por tipo que evita. |
| [5.8-thisPerdido.js](5.8-thisPerdido.js) | Bloque 6 | El bug del TP: un método pasado como callback pierde `this`. Las tres soluciones. |
| [5.9-composicionVsHerencia.js](5.9-composicionVsHerencia.js) | Bloque 6 | Heredá cuando *es*, componé cuando *tiene*. |
| [5.10-claseYJson.js](5.10-claseYJson.js) | Bloque 4 (cierre) | `JSON.parse` devuelve objetos planos, no instancias: el método fábrica y `toJSON()`. |

Varios ejemplos **rompen a propósito** y atrapan el error para imprimirlo: el mensaje que tira Node es parte de la explicación. Los que no se pueden ni siquiera ejecutar (acceder a un `#privado` desde afuera es un error de sintaxis) están comentados con el error que producen.

## Cómo ejecutar

Igual que las carpetas 1 a 4: JavaScript puro, sin instalar nada.

```bash
node 5-clases/5.1-definicionClase.js
```

## Conexiones con el resto del material

- **Unidad 2 (funciones)**: la arrow function no tiene `this` propio — es el motivo por el que no sirve como método de un objeto literal y sí sirve como campo de una clase (`5.8`).
- **Unidad 4 (objetos)**: `4.6` y `4.7` hacen con funciones constructoras lo mismo que `5.1` y `5.6` con `class`. Abrirlos lado a lado es la mejor forma de ver qué simplifica la sintaxis nueva.
- **Unidad 6 (Express)**: los *services* y *controllers* son clases, y `router.get('/', controller.getAll)` es exactamente el error de `5.8`.
- **Unidad 7 (TypeScript)**: la misma sintaxis suma `private`, `readonly` y tipos.
- **Unidad 8 (persistencia)**: la entidad de MikroORM es una clase con decoradores.
