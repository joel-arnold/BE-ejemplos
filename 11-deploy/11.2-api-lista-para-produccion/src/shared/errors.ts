// Errores de dominio. El service los lanza sin saber nada de HTTP; el
// errorHandler es el único que traduce cada uno a su código de estado.

// 400 - los datos están mal o rompen una regla de negocio.
export class ValidationError extends Error {}

// ============================================================================
// 401 vs 403: LA DISTINCIÓN QUE ORDENA TODA LA UNIDAD
// ============================================================================

// 401 Unauthorized -> "no sé quién sos".
// Falta el token, está vencido o la firma no cierra. La respuesta correcta del
// cliente es ir a loguearse.
//
// Nota histórica que confunde a todo el mundo: el nombre del 401 en el
// estándar es "Unauthorized", pero significa NO AUTENTICADO. El de
// autorización es el 403. El nombre quedó mal desde 1997 y ya no se cambia.
export class UnauthorizedError extends Error {}

// 403 Forbidden -> "sé perfectamente quién sos, y no podés".
// El token es válido, el usuario está identificado, pero no tiene permiso para
// esta operación. Volver a loguearse no cambia nada.
export class ForbiddenError extends Error {}
