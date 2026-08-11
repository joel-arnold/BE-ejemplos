// ============================================================================
// CONEXIÓN Y ESQUEMA - de la clase TypeScript a la tabla de MySQL
// ============================================================================
// Correr con: npm run conexion
//
// Este archivo no guarda ni lee nada todavía. Hace algo más básico y más
// importante: conectarse, y mostrar QUÉ TABLA generó el ORM a partir de la
// clase Producto. Toda la unidad se apoya en entender ese salto.
// ============================================================================

import { MikroORM } from '@mikro-orm/mysql';
import config from './mikro-orm.config.js';

console.clear();

// ============================================================================
// NIVEL 1: Inicializar el ORM
// ============================================================================

console.log('=== NIVEL 1: init ===\n');

// MikroORM.init() hace dos cosas y conviene no confundirlas:
//   1. DESCUBRE las entidades (lee los decoradores y arma el modelo interno).
//   2. Se CONECTA a la base.
// Si un decorador está mal, falla en el paso 1 y ni siquiera intenta conectar.
const orm = await MikroORM.init(config);

console.log('ORM inicializado\n');

// Crea la base de datos si todavía no existe, así el ejemplo corre sin tener
// que entrar a MySQL a hacer un CREATE DATABASE a mano.
await orm.schema.ensureDatabase();

// ============================================================================
// NIVEL 2: Ver el SQL antes de ejecutarlo
// ============================================================================

console.log('=== NIVEL 2: el DDL que sale de la clase ===\n');

// getCreateSchemaSQL() DEVUELVE el SQL sin ejecutarlo. Es la forma más directa
// de responder "¿en qué se convirtió mi clase?".
const ddl = await orm.schema.getCreateSchemaSQL();
console.log(ddl);

// Salida (recortada):
//
// create table `producto` (
//   `id` int unsigned not null auto_increment primary key,
//   `nombre` varchar(100) not null,
//   `precio` int not null,
//   `descripcion` varchar(255) null,
//   `creado_en` datetime not null
// ) default character set utf8mb4 engine = InnoDB;
//
// Tres cosas para mirar con atención:
//   - `creadoEn` (camelCase en TS) pasó a `creado_en` (snake_case en SQL). Esa
//     traducción la hace el ORM por convención; es configurable.
//   - `nombre` quedó varchar(100) porque se lo pedimos con length: 100. Sin
//     eso, el default es varchar(255).
//   - `precio` quedó como `int`. Nadie lo decidió: es el default para `number`.
//     Para plata eso es una mala idea (no hay centavos). Se arregla pidiendo el
//     tipo de columna: @Property({ columnType: 'decimal(10,2)' }).
//     El ORM elige por vos cuando no elegís vos.

// ============================================================================
// NIVEL 3: Aplicar el esquema
// ============================================================================

console.log('=== NIVEL 3: crear las tablas ===\n');

// refresh() = drop + create. Deja la base igual que el modelo, borrando todo lo
// que hubiera. En desarrollo es cómodo; en producción es una catástrofe.
// Para eso están las migraciones (ejemplo 8.4).
await orm.schema.refresh();

console.log('Tablas creadas. Mirá la base con: SHOW TABLES; DESCRIBE producto;\n');

// Cerrar la conexión: si no, el proceso queda colgado esperando.
await orm.close();
