// El mismo caso mínimo de las unidades 6 a 9: productos con nombre y precio,
// más el dueño que se agregó en la 9.

export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  creadoPorId: number;
};

export type ProductoNuevo = {
  nombre: string;
  precio: number;
};

// Lo que el middleware de autenticación de la unidad 9 dejó en `req.usuario`
// después de verificar el token.
export type PayloadToken = {
  sub: string;
  email: string;
  rol: 'usuario' | 'admin';
};
