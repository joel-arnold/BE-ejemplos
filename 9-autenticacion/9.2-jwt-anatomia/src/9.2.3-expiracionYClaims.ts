// ============================================================================
// EXPIRACIÓN Y CLAIMS ESTÁNDAR
// ============================================================================
// Correr con: npm run expiracion
//
// Las propiedades del payload se llaman CLAIMS ("afirmaciones"): cada una es
// algo que el servidor afirma sobre el portador del token. Algunas tienen
// nombre reservado por el estándar (RFC 7519) y las librerías las entienden
// solas.
// ============================================================================

// Ojo con el import: `jsonwebtoken` es un paquete CommonJS y nuestros proyectos
// son ESM (unidad 7). Solo funciona el import por default; un
// `import { TokenExpiredError } from 'jsonwebtoken'` COMPILA pero explota al
// correr con "does not provide an export named". Las clases de error se sacan
// del default: jwt.TokenExpiredError.
import jwt from 'jsonwebtoken';

console.clear();

const SECRET = 'un-secreto-largo-que-en-el-9.3-va-a-vivir-en-el-.env';

// ============================================================================
// NIVEL 1: iat y exp
// ============================================================================

console.log('=== NIVEL 1: iat y exp ===\n');

const token = jwt.sign({ sub: '1', rol: 'usuario' }, SECRET, { expiresIn: '1h' });
const payload = jwt.verify(token, SECRET) as jwt.JwtPayload;

console.log('payload completo:', payload);

// `expiresIn: '1h'` no guarda el string "1h": lo traduce a un timestamp exacto.
const emitido = new Date(payload.iat! * 1000);
const vence = new Date(payload.exp! * 1000);

console.log('\niat (emitido):', emitido.toLocaleTimeString('es-AR'));
console.log('exp (vence):  ', vence.toLocaleTimeString('es-AR'));
console.log('duración:     ', (payload.exp! - payload.iat!) / 60, 'minutos');

// Detalle que confunde: iat y exp están en SEGUNDOS desde 1970, mientras que
// Date.now() de JavaScript está en MILISEGUNDOS. De ahí el * 1000.

// ============================================================================
// NIVEL 2: un token vencido
// ============================================================================

console.log('\n=== NIVEL 2: cuando vence ===\n');

// Un token que vive un segundo, para no esperar una hora.
const tokenCorto = jwt.sign({ sub: '1' }, SECRET, { expiresIn: '1s' });

console.log('recién emitido:', !!jwt.verify(tokenCorto, SECRET));

await new Promise((resolve) => setTimeout(resolve, 1500));

try {
  jwt.verify(tokenCorto, SECRET);
} catch (error) {
  console.log('un segundo y medio después:', (error as Error).name);
  // TokenExpiredError

  // Vale distinguir los dos errores, porque significan cosas distintas y el
  // front reacciona distinto a cada uno:
  if (error instanceof jwt.TokenExpiredError) {
    console.log('  -> venció el', error.expiredAt.toLocaleTimeString('es-AR'));
    console.log('  -> el front debería mandar al login, no romperse');
  }
}

// TokenExpiredError    -> el token era legítimo pero caducó. Pedir login de nuevo.
// JsonWebTokenError    -> la firma no cierra, o el token está mal formado.
//                         Acá no hay nada que renovar: alguien lo tocó.
//
// Los dos terminan en un 401, pero el mensaje al usuario no es el mismo:
// "tu sesión expiró" no es lo mismo que "token inválido".

// ============================================================================
// NIVEL 3: los claims estándar
// ============================================================================

console.log('\n=== NIVEL 3: claims con nombre reservado ===\n');

const tokenCompleto = jwt.sign(
  { rol: 'admin', nombre: 'Ana' }, // ← claims propios, cualquier nombre
  SECRET,
  {
    subject: '42', // sub  - de quién habla el token (el id del usuario)
    issuer: 'dsw-api', // iss  - quién lo emitió
    audience: 'dsw-front', // aud  - para quién es
    expiresIn: '15m', // exp  - hasta cuándo vale
  },
);

console.log(jwt.decode(tokenCompleto));

// Los claims reservados son cortos por diseño: el token viaja en un header
// HTTP en CADA request, así que cada byte se paga muchas veces. Por eso `sub`
// y no `subject`, y por eso no conviene meter medio perfil de usuario adentro.

// verify() también los CHEQUEA si se los pedís:
try {
  jwt.verify(tokenCompleto, SECRET, { issuer: 'otra-api' });
} catch (error) {
  console.log('\ncon issuer equivocado:', (error as Error).message);
  // jwt issuer invalid. expected: otra-api
}

// ============================================================================
// NIVEL 4: cuánto debería durar
// ============================================================================

console.log('\n=== NIVEL 4: elegir la duración ===\n');

// No hay número mágico. Hay una tensión entre dos cosas:
//
//   Corto (15 min)  -> un token robado sirve poco. El usuario relogea seguido.
//   Largo (30 días) -> cómodo. Un token robado sirve un mes.
//
// La forma real de resolverla son los REFRESH TOKENS: un access token de
// minutos, y un refresh token de días guardado del lado del servidor (donde SÍ
// se puede revocar). Cuando el access vence, el front lo renueva sin pedir
// contraseña.
//
// En esta unidad NO los usamos: agregan una máquina de estados completa y el
// concepto de autenticación se entiende igual sin ellos. Para el TP, un token
// de 1-2 horas está bien.

const duraciones = ['15m', '1h', '7d'];

for (const d of duraciones) {
  const t = jwt.sign({ sub: '1' }, SECRET, { expiresIn: d as jwt.SignOptions['expiresIn'] });
  const p = jwt.decode(t) as jwt.JwtPayload;
  console.log(`${d.padEnd(4)} -> vence el ${new Date(p.exp! * 1000).toLocaleString('es-AR')}`);
}

// ============================================================================
// RESUMEN
// ============================================================================
// iat / exp    -> segundos desde 1970 (no milisegundos)
// exp          -> lo chequea verify() solo; no hay que compararlo a mano
// sub          -> el id del usuario, el claim que más se usa
// TokenExpiredError vs JsonWebTokenError -> vencido no es lo mismo que inválido
//
// Todo esto se usa junto y de una sola vez en el 9.3, dentro de tres archivos:
// shared/jwt.ts (emitir y verificar), auth.service.ts (login) y
// middlewares/autenticar.ts (proteger las rutas).
