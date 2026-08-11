import { z } from 'zod';

// El esquema de Zod SIGUE HACIENDO FALTA, y esta es la pregunta que aparece
// sola en cuanto entra el ORM: "si la entidad ya dice que precio es number,
// ¿para qué el esquema?".
//
// Porque son dos controles distintos, en dos momentos distintos:
//
//   Entidad  -> cómo se GUARDA el producto (columna, tipo SQL, largo, índices).
//               Actúa cuando el dato ya entró al sistema.
//   Zod      -> qué se ACEPTA en el body de un request. Actúa en el borde,
//               antes de que el dato entre.
//
// Sin Zod, un body con precio "60000" (string) llegaría hasta el ORM, que lo
// rechazaría con un error de driver de MySQL: un 500 feo en vez de un 400 que
// explica qué campo está mal. Y encima, MySQL en modo no estricto podría
// aceptarlo convertido — peor todavía.
//
// Comparar con 7.3: acá el esquema YA NO define el tipo `Producto`. De eso se
// ocupa ahora la entidad. Zod se queda solo con la forma de lo que entra.

export const productoNuevoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').max(100, 'Máximo 100 caracteres'),
  precio: z.number().positive('El precio debe ser mayor a 0'),
  descripcion: z.string().optional(),
});

export type ProductoNuevo = z.infer<typeof productoNuevoSchema>;
// ProductoNuevo === { nombre: string; precio: number; descripcion?: string }

// El max(100) no está de adorno: la columna es varchar(100). Si el esquema
// dejara pasar 200 caracteres, el que cortaría sería MySQL, con un error de
// driver. Cuando la entidad y el esquema se contradicen, el que pierde es
// siempre el usuario de la API, que recibe un 500 en vez de un 400.
