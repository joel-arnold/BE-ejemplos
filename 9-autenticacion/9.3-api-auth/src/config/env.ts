// ============================================================================
// LAS VARIABLES DE ENTORNO, EN UN SOLO LUGAR Y VALIDADAS
// ============================================================================
// Hasta la unidad 8 las credenciales de MySQL estaban escritas en
// mikro-orm.config.ts, con un comentario que decía "esto se arregla en la 9".
// Es acá.
//
// Tres razones para sacar la configuración del código, en orden de gravedad:
//
//   1. SECRETOS. El secret del JWT en un repo público es el equivalente a
//      publicar la llave de tu casa. Y borrarlo después no alcanza: queda en
//      el historial de git para siempre.
//   2. AMBIENTES. El mismo código tiene que correr contra tu MySQL local y
//      contra la base de producción. Lo único que cambia es la configuración.
//   3. EQUIPO. Cada uno tiene su MySQL con su propia contraseña. Sin .env, esa
//      línea se cambia en cada pull y se commitea sin querer una vez por
//      semana.
// ============================================================================

import { config } from 'dotenv';
import { z } from 'zod';

// Lee el archivo .env y mete lo que encuentra en process.env. Si no existe el
// archivo, no falla: sigue de largo con lo que ya haya en el ambiente — que es
// justo lo que pasa en producción, donde no hay .env y las variables las pone
// el servidor (Render, Docker, systemd).
config({ quiet: true });

// ============================================================================
// VALIDAR LA CONFIGURACIÓN AL ARRANCAR
// ============================================================================
// process.env es un objeto de `string | undefined`. Sin validar, un
// PORT mal escrito se descubre como NaN tres capas más abajo, y un JWT_SECRET
// faltante recién cuando alguien intenta loguearse.
//
// Con Zod (unidad 7) se valida una vez, al arrancar, y el resto de la
// aplicación importa un objeto TIPADO. Es la misma idea que validar el body de
// un request: la configuración también es una entrada que viene de afuera.
// ============================================================================

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),

  DB_HOST: z.string().min(1).default('localhost'),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_NAME: z.string().min(1).default('dsw_auth'),
  DB_USER: z.string().min(1).default('root'),
  DB_PASSWORD: z.string().default(''),

  // El único de la lista que no tiene default a propósito: si falta, la API no
  // arranca. Un secret por defecto es peor que no tener secret, porque nadie
  // se entera de que quedó el de ejemplo.
  JWT_SECRET: z.string().min(32, 'El secret tiene que tener al menos 32 caracteres'),
  JWT_EXPIRES_IN: z.string().default('1h'),

  CORS_ORIGIN: z.string().url().default('http://localhost:5173'),
});

const resultado = envSchema.safeParse(process.env);

if (!resultado.success) {
  console.error('\n✖ Falta configuración o está mal:\n');

  for (const issue of resultado.error.issues) {
    console.error(`  ${issue.path.join('.')}: ${issue.message}`);
  }

  console.error('\nRevisá tu archivo .env (hay una plantilla en .env.example)\n');

  // Fallar RUIDOSAMENTE y al arrancar. Una API que levanta con la
  // configuración incompleta y explota en el primer login es mucho peor de
  // depurar que una que no levanta.
  process.exit(1);
}

// A partir de acá, `env` está tipado: env.PORT es number, no string|undefined.
export const env = resultado.data;

// `z.coerce.number()` convierte: en el .env todo es texto ("3000"), y del otro
// lado sale un number de verdad. Sin eso, PORT sería el string '3000' y
// cualquier cuenta con él daría cualquier cosa.
