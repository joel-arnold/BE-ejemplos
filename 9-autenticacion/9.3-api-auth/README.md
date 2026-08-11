# 9.3 - La API con login, rutas protegidas y permisos

> Clase "Autenticación y autorización" · **Bloques 2, 4, 6, 7 y 8**

El ejemplo [8.2](../../8-persistencia-mikroorm/8.2-api-mikroorm/) con usuarios. Está pensado para abrirse **lado a lado con el 8.2**: todo lo que hay de nuevo es autenticación, autorización y configuración.

## Qué cambió respecto de 8.2

| Archivo | Cambio |
| --- | --- |
| `config/env.ts` | **Nuevo.** `dotenv` + validación con Zod. Cierra la deuda que dejó la unidad 8. |
| `.env.example` | **Nuevo.** La plantilla que sí se versiona. |
| `entities/usuario.entity.ts` | **Nuevo.** `email`, `passwordHash`, `rol`. |
| `entities/producto.entity.ts` | Suma `creadoPor` — sin dueño no hay autorización que mostrar. |
| `shared/jwt.ts` | **Nuevo.** Emitir y verificar. El único archivo que importa `jsonwebtoken`. |
| `middlewares/autenticar.ts` | **Nuevo.** Saca el token del header, lo verifica, lo deja en `req.usuario`. |
| `middlewares/autorizar.ts` | **Nuevo.** `requiereRol('admin')`, una fábrica de middlewares. |
| `types/express.d.ts` | **Nuevo.** Le agrega `usuario?` al `Request` de Express, sin `any`. |
| `services/auth.service.ts` | **Nuevo.** Registro, login y emisión del token. |
| `mikro-orm.config.ts` | Las credenciales salen de `env`, no del código. |
| `shared/errors.ts` | Suma `UnauthorizedError` (401) y `ForbiddenError` (403). |
| `shared/errorHandler.ts` | Los traduce a sus códigos. |
| `routes/` | Cada ruta declara su nivel de protección. |
| `app.ts` | Suma `cors()` como primer middleware. |
| `services/productos.service.ts`, `repositories/`, `controllers/` | El dueño sale del token; aparece el `DELETE`. |

## Antes de correr

**1. Copiar la plantilla de configuración.** Este paso es nuevo y es el punto del bloque 2: el proyecto no arranca sin un `.env`.

```bash
cp .env.example .env      # Windows: copy .env.example .env
```

**2. Ajustar el `.env`** con tu usuario y contraseña de MySQL, y generar un secret propio:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**3. Levantar.** Hace falta un MySQL andando; la base `dsw_auth` la crea `ensureDatabase()`.

```bash
npm install
npm run dev
```

Si falta una variable o el secret es corto, la API **no arranca** y dice cuál es el problema. Es a propósito: una API que levanta con la configuración incompleta y explota en el primer login es mucho peor de depurar.

Después, en orden: [auth.http](auth.http) y [productos.http](productos.http).

## Las dos preguntas

Toda la unidad se ordena con dos preguntas que **no son la misma**:

| | Pregunta | Cuándo falla | Dónde se responde |
| --- | --- | --- | --- |
| **Autenticación** | ¿Quién sos? | **401** | `middlewares/autenticar.ts` |
| **Autorización** | ¿Podés hacer esto? | **403** | `middlewares/autorizar.ts` **y** el service |

El 401 dice "no sé quién sos": falta el token, venció o la firma no cierra. La respuesta correcta del cliente es ir a loguearse.

El 403 dice "sé perfectamente quién sos, y no podés". Volver a loguearse no cambia nada.

> El nombre del 401 en el estándar es *Unauthorized*, pero significa **no autenticado**. El de autorización es el 403. El nombre quedó mal desde 1997 y ya no se cambia.

## Las tres clases de ruta

```ts
productosRouter.get('/', listar);                                        // pública
productosRouter.post('/', autenticar, validar(schema), crear);           // autenticada
productosRouter.delete('/:id', autenticar, eliminar);                    // + autorizada
```

Leyendo el archivo de rutas se sabe quién puede hacer qué. Esa legibilidad es el argumento para poner la autenticación ahí y no adentro de cada controller: **un permiso olvidado se ve como una línea que falta**.

Dos detalles de orden que sí importan:

- `autenticar` **antes** que `validar`. Si un anónimo manda un body inválido, la respuesta correcta es 401, no 400: no tiene por qué enterarse del formato de una ruta que no puede usar.
- `autenticar` **antes** que `requiereRol`. El segundo lee `req.usuario`, que lo pone el primero.

## La autorización que no entra en un middleware

Hay dos clases, y solo una es un middleware:

**a) La que depende solo del token.** *"Tenés que ser admin."* Se resuelve con lo que trae el request, sin tocar la base. Eso es `requiereRol`.

**b) La que depende del recurso.** *"Podés borrar este producto si lo creaste vos."* No se puede contestar sin ir a buscar el producto. Si la pusiéramos en un middleware, ese middleware consultaría la base y el service la consultaría de nuevo: dos veces la misma query, y una regla de negocio escrita en la capa equivocada.

La (b) vive en el **service**:

```ts
export async function eliminarProducto(id: number, quienPide: PayloadToken): Promise<void> {
  const producto = await repo.findByIdOrFail(id);          // 1. ¿existe? -> 404

  const esAdmin = quienPide.rol === 'admin';
  const esDueno = producto.creadoPor.id === Number(quienPide.sub);

  if (!esAdmin && !esDueno) {                              // 2. ¿podés? -> 403
    throw new ForbiddenError('Solo podés borrar los productos que creaste');
  }

  await repo.eliminar(producto);                           // 3. borrar
}
```

**La regla para decidir dónde va cada una: si para contestar hay que ir a la base, es del service.**

## Lo que decide permisos no se le pregunta al cliente

Tres decisiones del código que son la misma decisión:

1. El **dueño** del producto no se acepta del body: sale del `sub` del token. Si viniera del body, cualquiera crearía productos a nombre de otro.
2. El **rol** no se acepta en el registro: todos los registros públicos crean usuarios comunes. Si se aceptara, cualquiera se registraría como admin. Un admin se crea a mano o con un script de seed.
3. El **algoritmo** de verificación no se lee del header del token: se fija con `{ algorithms: ['HS256'] }`. Ver [9.2.2](../9.2-jwt-anatomia/src/9.2.2-firmaYManipulacion.ts).

Todas son casos de lo mismo: **nunca dejes que el dato que estás validando decida cómo se valida**.

## `req.usuario` sin `any`

`Request` es un tipo de Express y no tiene la propiedad `usuario`. La salida fácil es `(req as any).usuario`, y es una mentira que se paga después. La correcta es **declaration merging** ([types/express.d.ts](src/types/express.d.ts)):

```ts
declare global {
  namespace Express {
    interface Request {
      usuario?: PayloadToken;
    }
  }
}
```

El `?` no es un detalle: en una ruta pública el middleware no corrió y `req.usuario` es `undefined`. El tipo lo dice y el compilador obliga a contemplarlo. Si fuera obligatorio, el tipo estaría mintiendo.

## El `.env`

Tres razones para sacar la configuración del código, en orden de gravedad:

1. **Secretos.** El secret del JWT en un repo público es publicar la llave de tu casa. Y borrarlo después no alcanza: queda en el historial de git.
2. **Ambientes.** El mismo código corre contra tu MySQL local y contra la base de producción. Lo único que cambia es la configuración.
3. **Equipo.** Cada uno tiene su MySQL con su contraseña. Sin `.env`, esa línea se cambia en cada pull y se commitea sin querer una vez por semana.

Qué se versiona y qué no:

| Archivo | ¿Va a git? | Qué tiene |
| --- | --- | --- |
| `.env` | **No** (está en el `.gitignore`) | Los valores reales de tu máquina |
| `.env.example` | **Sí** | Los nombres de las variables y valores de ejemplo |

Y la configuración **se valida al arrancar**, con Zod. `process.env` es un objeto de `string | undefined`: sin validar, un `PORT` mal escrito aparece como `NaN` tres capas más abajo y un `JWT_SECRET` faltante recién cuando alguien intenta loguearse. Es la misma idea que validar el body de un request — la configuración también es una entrada que viene de afuera.

## Lo que este ejemplo no hace

- **No hay logout en el servidor.** Con JWT no hay nada que cerrar: el servidor no guardó nada. El logout es que el cliente borre su token, y una copia hecha antes sigue sirviendo hasta el `exp`.
- **No hay refresh tokens.** Agregan una máquina de estados completa y el concepto se entiende igual sin ellos.
- **No hay recuperación de contraseña.** Necesita mandar mails, que es otra unidad.
- **El token viaja en el body y después en el header `Authorization`.** La alternativa es una cookie `httpOnly`, más segura contra XSS y más incómoda con CORS. La cátedra usa el header porque es lo que va a usar el front.
- **No hay rate limiting.** Sin él, probar contraseñas contra el login es gratis. En producción va `express-rate-limit` o algo equivalente delante del login.
