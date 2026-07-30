# 7.3 - Validación en runtime con Zod

> Clase "De JavaScript a TypeScript" · **Bloque 7**

El mismo proyecto de [7.2](../7.2-api-capas-ts/) con el agujero tapado. La división del trabajo, en una línea:

> **TypeScript chequea lo que escribís vos; Zod chequea lo que te mandan.**

|  | TypeScript | Zod |
| --- | --- | --- |
| Cuándo actúa | Al compilar | Al ejecutar |
| Qué controla | El código que escribís vos | Los datos que te mandan |
| Después de compilar | Desaparece | Sigue ahí: es código JavaScript |
| Sirve para | Que las capas encajen entre sí | Bodies, params, variables de entorno, respuestas de otras APIs |

## Qué cambió respecto de 7.2

| Archivo | Cambio |
| --- | --- |
| `schemas/producto.schema.ts` | **Nuevo.** Reemplaza a `types/producto.ts`: define el esquema y **deriva los tipos** con `z.infer`. |
| `shared/validar.ts` | **Nuevo.** Middleware genérico: recibe un esquema y devuelve el middleware que valida el body. |
| `routes/` | El POST pasa por `validar(productoNuevoSchema)` antes del controller. |
| `services/` | **Ya no valida formato.** Le queda la regla de negocio: no repetir el nombre. |
| `repositories/` | Suma `findByNombre`, que la regla de negocio necesita. |

## La idea central: `z.infer`

```ts
export const productoNuevoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  precio: z.number().positive('El precio debe ser mayor a 0'),
});

export type ProductoNuevo = z.infer<typeof productoNuevoSchema>;
// ProductoNuevo === { nombre: string; precio: number }
```

El esquema es un **valor** de JavaScript: existe en tiempo de ejecución y valida datos reales. `z.infer` extrae de ese valor el **tipo** de TypeScript. Se escribe una sola vez: el tipo y la validación no se pueden desincronizar.

Sin Zod son dos verdades separadas —la `interface` por un lado, el `if` de validación por el otro— que hay que acordarse de mantener a la par cuando cambia el modelo.

## Formato vs. reglas de negocio

Después de sumar Zod, cada cosa queda en su lugar:

- **Zod (middleware)**: que `nombre` sea un string no vacío y `precio` un número positivo. Es formato, no depende del estado del sistema, y se corta antes del controller.
- **Service**: que no exista ya un producto con ese nombre. Es una regla de negocio: necesita mirar los datos, y por eso no puede vivir en el esquema.

## Probarlo

```bash
npm install
npm run dev
```

En [productos.http](productos.http) están los casos, incluido el request que contra 7.2 responde `201` y acá responde `400`:

```json
{ "nombre": "Webcam", "precio": "60000" }
```

```json
{
  "error": "Datos inválidos",
  "detalle": [
    { "campo": "precio", "mensaje": "Expected number, received string" }
  ]
}
```

## Un poco más lejos

- `parse()` lanza una excepción en vez de devolver un resultado: cómodo cuando ya hay un `errorHandler` centralizado que la traduzca.
- `safeParse()` devuelve una **unión discriminada** (`success: true | false`): adentro de cada rama TypeScript sabe si hay `data` o `error`. Es el mismo *narrowing* del ejemplo [7.1.3](../7.1-fundamentos/src/7.1.3-objetos.ts).
- `z.coerce.number()` convierte el string a número en vez de rechazarlo — muy útil para query params, que siempre llegan como texto.
- El mismo esquema sirve para validar `process.env` al arrancar la app: evita el clásico "andaba en mi máquina" por una variable que en el servidor no estaba.
