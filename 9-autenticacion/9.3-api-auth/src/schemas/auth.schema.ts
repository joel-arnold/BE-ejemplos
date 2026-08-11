import { z } from 'zod';

// Mismo esquema para registro y login: los dos reciben email y password.
//
// Un detalle que parece menor y no lo es: el mínimo de 8 caracteres se valida
// SOLO en el registro. En el login no hay que validar largo de contraseña —
// si alguien tiene una vieja de 6, tiene que poder entrar igual, y encima el
// mensaje "la contraseña debe tener 8 caracteres" en un login le confirma al
// atacante que ese no es el formato correcto.

export const registroSchema = z.object({
  email: z.string().email('Email inválido').max(120, 'Máximo 120 caracteres'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(72, 'Máximo 72 caracteres'),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export type Registro = z.infer<typeof registroSchema>;
export type Login = z.infer<typeof loginSchema>;

// El max(72) del registro tampoco es arbitrario: bcrypt ignora todo lo que
// pase de 72 bytes (ejemplo 9.1.2). Sin ese tope, alguien podría registrarse
// con una contraseña de 200 caracteres y entrar después con los primeros 72,
// que es un comportamiento imposible de explicar.
//
// Mismo criterio que el max(100) del nombre de producto en la unidad 8: el
// esquema tiene que conocer el límite real de lo que hay abajo.
