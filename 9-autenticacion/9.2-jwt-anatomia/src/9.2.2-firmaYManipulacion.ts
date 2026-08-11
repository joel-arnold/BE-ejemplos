// ============================================================================
// LA FIRMA: QUÉ PASA SI ALGUIEN TOCA EL TOKEN
// ============================================================================
// Correr con: npm run firma
//
// En el 9.2.1 quedó claro que el payload se lee sin secret. La pregunta que
// sigue sola es: "entonces, ¿me lo edito y me pongo admin?".
//
// Este archivo lo intenta.
// ============================================================================

import jwt from 'jsonwebtoken';

console.clear();

const SECRET = 'un-secreto-largo-que-en-el-9.3-va-a-vivir-en-el-.env';

const token = jwt.sign({ sub: '1', email: 'ana@dsw.com', rol: 'usuario' }, SECRET, {
  expiresIn: '1h',
});

// ============================================================================
// NIVEL 1: el ataque obvio — editar el payload
// ============================================================================

console.log('=== NIVEL 1: me pongo admin ===\n');

const [header, payload, firmaOriginal] = token.split('.');

// Leo el payload, le cambio el rol y lo vuelvo a codificar. Todo esto se hace
// sin el secret, con las herramientas que ya vimos.
const payloadOriginal = JSON.parse(Buffer.from(payload, 'base64url').toString());
const payloadTrucho = { ...payloadOriginal, rol: 'admin' };

const payloadTruchoB64 = Buffer.from(JSON.stringify(payloadTrucho)).toString('base64url');
const tokenTrucho = `${header}.${payloadTruchoB64}.${firmaOriginal}`;

console.log('payload editado:', jwt.decode(tokenTrucho));
// { sub: '1', email: 'ana@dsw.com', rol: 'admin', ... }  ← dice admin

// El decode lo muestra como admin. Pero decode no valida nada (9.2.1).
try {
  jwt.verify(tokenTrucho, SECRET);
  console.log('\n¡pasó! (esto no debería imprimirse)');
} catch (error) {
  console.log('\nverify falló:', (error as Error).name, '-', (error as Error).message);
  // JsonWebTokenError - invalid signature
}

// Por qué falla: la firma se calculó sobre el payload VIEJO. Al cambiar una
// letra del payload, la firma que corresponde es otra — y calcularla requiere
// el secret. Editar el payload es fácil; hacer que la firma cierre, no.

// ============================================================================
// NIVEL 2: firmar con otro secret
// ============================================================================

console.log('\n=== NIVEL 2: me armo el token entero ===\n');

// Segundo intento: en vez de editar, firmo uno nuevo con el secret que yo
// invente.
const tokenAtacante = jwt.sign({ sub: '1', rol: 'admin' }, 'secreto-que-invente-yo');

try {
  jwt.verify(tokenAtacante, SECRET);
  console.log('¡pasó! (esto no debería imprimirse)');
} catch (error) {
  console.log('verify falló:', (error as Error).name, '-', (error as Error).message);
  // JsonWebTokenError - invalid signature
}

// Mismo resultado. La firma sale de un HMAC con el secret del servidor: sin
// ese secret no hay forma de producir una que verifique.
//
// DE ACÁ SALE LA REGLA DEL SECRET:
//   - Largo y aleatorio (32 bytes o más). No "secreto123", no el nombre del TP.
//   - Fuera del código: en una variable de entorno (bloque 2 de la clase).
//   - Distinto en desarrollo y en producción.
//   - Si se filtra, cualquiera emite tokens válidos para cualquier usuario.
//     Cambiarlo invalida TODOS los tokens vigentes de una — que es justo lo
//     que querés en ese caso.

// ============================================================================
// NIVEL 3: el ataque "alg: none"
// ============================================================================

console.log('\n=== NIVEL 3: alg none ===\n');

// Un clásico histórico. El header dice qué algoritmo se usó, y el header lo
// controla quien manda el token. ¿Y si dice que no hay algoritmo?
const headerNone = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
const tokenNone = `${headerNone}.${payloadTruchoB64}.`;

console.log('token sin firma:', tokenNone.slice(0, 60) + '...');

try {
  jwt.verify(tokenNone, SECRET);
  console.log('¡pasó! (esto no debería imprimirse)');
} catch (error) {
  console.log('verify falló:', (error as Error).name, '-', (error as Error).message);
  // JsonWebTokenError - jwt signature is required
}

// Las librerías serias ya no caen en esto, pero en 2015 varias sí, y era
// exactamente esto: aceptar el algoritmo que propone el atacante.
//
// La defensa explícita es decirle a verify() qué algoritmos aceptás:
try {
  jwt.verify(tokenNone, SECRET, { algorithms: ['HS256'] });
} catch (error) {
  console.log('con algorithms:', (error as Error).message);
}

// La moraleja general vale más que el caso: NUNCA dejes que el dato que estás
// validando decida CÓMO se valida.

// ============================================================================
// NIVEL 4: lo que la firma NO resuelve
// ============================================================================

console.log('\n=== NIVEL 4: el token robado ===\n');

// La firma garantiza que el token lo emitió el servidor y que no lo tocaron.
// No garantiza que lo esté usando la persona correcta.
//
// Un token copiado de la consola del navegador de otro funciona igual de bien:
// es válido, tiene firma correcta y no venció.
const tokenRobado = token; // mismo string, otras manos

console.log('el token copiado verifica igual:', !!jwt.verify(tokenRobado, SECRET));

// De ahí salen las tres precauciones que sí se usan en producción:
//   1. HTTPS siempre, para que no se pueda leer en tránsito.
//   2. Expiración corta (minutos u horas, no meses). Un token robado sirve
//      hasta que vence, y no hay forma barata de cancelarlo antes.
//   3. No guardarlo en un lugar donde cualquier script de la página lo pueda
//      leer, si se puede evitar.
//
// El punto 2 es la contra grande de los JWT: son AUTOCONTENIDOS. El servidor
// no guarda nada, así que tampoco tiene dónde tachar un token. Un "cerrar
// sesión" real borra el token del cliente, pero si alguien ya se lo copió,
// ese token sigue siendo válido hasta el exp.
//
// La alternativa clásica son las SESIONES en el servidor: ahí el logout es
// borrar una fila. Se pierde el "sin estado", que es justo lo que hace fácil
// escalar la API a varias instancias.

// ============================================================================
// RESUMEN
// ============================================================================
// El payload se LEE sin secret.        -> no pongas nada privado ahí
// El payload no se puede FALSIFICAR.   -> por la firma HMAC con el secret
// El secret es la única pieza secreta. -> largo, en el .env, distinto por ambiente
// Un token válido en manos ajenas      -> sigue siendo válido: HTTPS y exp corto
