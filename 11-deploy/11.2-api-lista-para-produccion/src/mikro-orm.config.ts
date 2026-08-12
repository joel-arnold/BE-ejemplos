import { defineConfig } from '@mikro-orm/mysql';
import { Migrator } from '@mikro-orm/migrations';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { env, esProduccion } from './config/env.js';
import { Usuario } from './entities/usuario.entity.js';
import { Producto } from './entities/producto.entity.js';

// ============================================================================
// LA CONFIGURACIÓN DEL ORM, CON DOS AMBIENTES
// ============================================================================
// Es la del 9.3 con tres cambios, y los tres se notan solo en producción.
// ============================================================================

export default defineConfig({
  entities: [Usuario, Producto],

  dbName: env.DB_NAME,
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,

  // ── CAMBIO 1: TLS contra la base gestionada ───────────────────────────────
  // Un MySQL en localhost habla en texto plano por la red local de tu máquina
  // y no pasa nada. Uno en internet lleva las contraseñas y los datos de tus
  // usuarios a través de la red de otros: si no va cifrado, cualquiera en el
  // camino lo lee.
  //
  // Por eso las bases gestionadas rechazan la conexión sin TLS. El `ca` es el
  // certificado de la autoridad que firmó el del servidor, y sirve para
  // verificar que del otro lado está tu base y no alguien haciéndose pasar por
  // ella. Se descarga del panel del proveedor y va en DB_SSL_CA.
  //
  // Lo que se ve en la mitad de los tutoriales:
  //
  //     ssl: { rejectUnauthorized: false }
  //
  // "Arregla" el error en un segundo y desactiva justo la parte que importa:
  // cifra, pero deja de verificar con quién está hablando. Es TLS sin la
  // garantía de TLS.
  driverOptions: env.DB_SSL_CA
    ? { connection: { ssl: { ca: env.DB_SSL_CA, rejectUnauthorized: true } } }
    : undefined,

  metadataProvider: TsMorphMetadataProvider,

  extensions: [Migrator],

  // ── CAMBIO 2: migraciones, no schema.update() ─────────────────────────────
  // Las dos rutas son a propósito: en desarrollo la CLI lee los .ts de src/, y
  // en producción no hay .ts — hay los .js compilados en dist/.
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
    tableName: 'mikro_orm_migrations',
    transactional: true,
  },

  // ── CAMBIO 3: el log de consultas, solo en desarrollo ─────────────────────
  // `debug: true` imprime cada consulta que genera el ORM. Durante la unidad 8
  // eso era la mitad del ejercicio; en producción es una mala idea por dos
  // motivos: llena el log de ruido (y en los planes gratis el log tiene un
  // límite) y deja escritos en texto plano los valores de cada consulta,
  // incluidos mails y hashes.
  debug: !esProduccion,
});

// La CLI encuentra este archivo por la sección "mikro-orm" del package.json.
