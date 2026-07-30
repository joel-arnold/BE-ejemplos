import { z } from 'zod';

// El esquema es un VALOR de JavaScript: existe en tiempo de ejecución y valida
// datos reales. Reemplaza al archivo types/producto.ts del ejemplo 7.2.

export const productoNuevoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  precio: z.number().positive('El precio debe ser mayor a 0'),
});

export const productoSchema = productoNuevoSchema.extend({
  id: z.number().int().positive(),
});

// ── La línea que justifica toda la clase ──
// z.infer EXTRAE el tipo de TypeScript a partir del esquema. No hay que
// escribir la interface por un lado y la validación por el otro: se escribe una
// sola vez y el tipo se deriva. No se pueden desincronizar.

export type ProductoNuevo = z.infer<typeof productoNuevoSchema>;
// ProductoNuevo === { nombre: string; precio: number }

export type Producto = z.infer<typeof productoSchema>;
// Producto === { nombre: string; precio: number; id: number }
