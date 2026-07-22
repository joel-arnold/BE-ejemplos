// Error de dominio: el service lo lanza cuando los datos no cumplen las reglas
// de negocio. El middleware de errores lo traduce a un HTTP 400.
export class ValidationError extends Error {}
