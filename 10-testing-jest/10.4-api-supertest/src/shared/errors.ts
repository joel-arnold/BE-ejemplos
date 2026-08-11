// Los errores de dominio de la unidad 6. El service los lanza sin saber nada de
// HTTP; el errorHandler los traduce a códigos.

export class NotFoundError extends Error {}
export class ValidationError extends Error {}
export class ForbiddenError extends Error {}
export class UnauthorizedError extends Error {}
