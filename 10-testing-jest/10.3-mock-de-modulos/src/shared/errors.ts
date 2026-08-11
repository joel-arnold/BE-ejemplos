// Los errores de dominio de la unidad 6, que el errorHandler traduce a códigos
// HTTP. El service lanza errores con significado; nadie abajo de la capa de
// Express sabe qué es un 404.

export class NotFoundError extends Error {}
export class ValidationError extends Error {}
export class ForbiddenError extends Error {}
