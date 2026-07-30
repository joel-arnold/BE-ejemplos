// Error de dominio: el service lo lanza cuando se rompe una REGLA DE NEGOCIO
// (un nombre repetido, por ejemplo). Los errores de formato ya no llegan hasta
// acá: los corta antes el middleware de validación con Zod.
export class ValidationError extends Error {}
