import { z } from 'zod';

// Igual que en el 8.2. Vale notar lo que NO está: `creadoPor`.
//
// El dueño del producto NO se acepta del body. Sale del token, que el
// middleware ya verificó. Si viniera del body, cualquiera podría crear
// productos a nombre de otro con solo mandar {"creadoPor": 7}.
//
// Es la regla general de la unidad: lo que decide permisos no se le pregunta
// al cliente.

export const productoNuevoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').max(100, 'Máximo 100 caracteres'),
  precio: z.number().positive('El precio debe ser mayor a 0'),
  descripcion: z.string().optional(),
});

export type ProductoNuevo = z.infer<typeof productoNuevoSchema>;
