# 7.2 - La API en capas, en TypeScript

> Clase "De JavaScript a TypeScript" · **Bloque 6**

El ejemplo [6.3](../../6-express-arquitecturas/6.3-arquitectura-capas/) —routes, controllers, services, repositories— migrado a TypeScript, sin cambiar la arquitectura. Sirve para comparar los dos proyectos archivo por archivo.

## Qué cambió respecto de 6.3

| Archivo | Cambio |
| --- | --- |
| `types/producto.ts` | **Nuevo.** El tipo del dominio (`Producto`) y el derivado para el alta (`ProductoNuevo = Omit<Producto, 'id'>`). |
| `repositories/` | El array pasa a ser `Producto[]` y las firmas devuelven `Promise<Producto>`. |
| `services/` | Recibe `ProductoNuevo`, devuelve `Promise<Producto>`: el contrato del negocio, explícito. |
| `controllers/` | Tipan `Request`, `Response` y `NextFunction` de `@types/express`. |
| `shared/errorHandler.ts` | Se tipa con `ErrorRequestHandler`, que obliga a los cuatro parámetros en el orden correcto. |
| `routes/` | Prácticamente igual: solo la extensión `.js` en los imports. |
| `tsconfig.json` | **Nuevo.** `strict: true`, `module: NodeNext`, `src/` → `dist/`. |

La estructura de carpetas es la misma. Lo único que aparece es `dist/` (generada, ignorada por git).

## El punto de la clase: `req.body` es `any`

Toda la cadena quedó tipada y **el agujero sigue abierto**. Express no puede saber qué te van a mandar, así que este request:

```json
{ "nombre": "Webcam", "precio": "60000" }
```

responde **201** y guarda un precio que es un string. Los tipos son una promesa sobre el código que escribís vos, no sobre los datos que te mandan — y además se borran al compilar, así que en ejecución no queda nada que chequee.

Está en el archivo [productos.http](productos.http) para probarlo. El mismo request contra [7.3](../7.3-validacion-zod/) responde **400** con el detalle del campo.

## Lo que sí se gana

- Agregar `stock: number` a `Producto` hace que el compilador marque **qué quedó incompleto**, y no compile hasta que esté resuelto:

  ```
  src/repositories/productos.repository.ts(10,32): error TS2741: Property 'stock'
  is missing in type '{ id: number; nombre: string; precio: number; }' but
  required in type 'Producto'.
  ```

  En un proyecto mínimo como este es un solo archivo; en uno real, la lista completa. La refactorización deja de ser una búsqueda de texto con la esperanza de no haberse olvidado ninguno.
- El contrato entre capas es **verificable**: si el service devuelve otra cosa, el controller no compila.
- El `await` olvidado pasa a ser error de compilación (*"Property 'map' does not exist on type 'Promise&lt;Producto[]&gt;'"*).
- Cuando el repository pase a MikroORM, la firma `Promise<Producto>` ya está: el service no se toca.

## Cómo ejecutar

```bash
npm install

npm run dev     # desarrollo: tsx ejecuta el .ts y recarga al guardar
npm run check   # solo chequea tipos (tsc --noEmit)

npm run build   # compila src/ -> dist/
npm start       # producción: node dist/app.js
```

Levanta en `http://localhost:3000`, ruta base `/api/productos`. Para probar los endpoints está [productos.http](productos.http).
