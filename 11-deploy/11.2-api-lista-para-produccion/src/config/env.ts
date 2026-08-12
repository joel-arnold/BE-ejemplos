// ============================================================================
// LAS VARIABLES DE ENTORNO, EN UN SOLO LUGAR Y VALIDADAS
// ============================================================================
// Es el env.ts de la unidad 9 con lo que hace falta para que el mismo código
// corra en tu máquina y en un servidor de internet. Tres agregados:
//
//   NODE_ENV     para poder preguntar "¿estoy en producción?".
//   DB_SSL_CA    el certificado de la base gestionada (en local no existe).
//   CORS_ORIGIN  ahora es una LISTA: en producción hay más de un front.
//
// Lo importante es lo que NO cambió: sigue habiendo un solo archivo que lee
// configuración, sigue validándose al arrancar, y el resto de la aplicación
// sigue importando un objeto tipado sin enterarse de dónde salió.
// ============================================================================

import { config } from 'dotenv';
import { z } from 'zod';

// En producción no hay archivo .env: las variables las pone la plataforma
// (Render, Docker, systemd) directamente en el ambiente del proceso. dotenv no
// encuentra el archivo, no falla, y sigue de largo con lo que ya esté puesto.
// Por eso el mismo código sirve en los dos lados sin un solo `if`.
config({ quiet: true });

const envSchema = z.object({
  // ── Ambiente ──────────────────────────────────────────────────────────────
  // No es una variable de Node: es una convención que respetan casi todas las
  // librerías del ecosistema. Express, con 'production', deja de mandar el
  // stack trace en las respuestas de error y cachea las vistas.
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // ── Servidor ──────────────────────────────────────────────────────────────
  // El default de 3000 es para tu máquina. En la nube esta variable la pone la
  // plataforma y hay que usar la que te da: es el error número uno del primer
  // deploy. Ver el comentario largo en server.ts.
  PORT: z.coerce.number().int().positive().default(3000),

  // ── Base de datos ─────────────────────────────────────────────────────────
  // Los defaults apuntan a un MySQL local. En producción los cinco valores los
  // da el proveedor de la base y ninguno se parece a estos.
  DB_HOST: z.string().min(1).default('localhost'),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_NAME: z.string().min(1).default('dsw_deploy'),
  DB_USER: z.string().min(1).default('root'),
  DB_PASSWORD: z.string().default(''),

  // El certificado de la autoridad que firmó el certificado del servidor de
  // base de datos, en texto plano (el contenido del ca.pem, con sus saltos de
  // línea). Va como variable y no como archivo porque el repositorio no tiene
  // por qué llevar los certificados de nadie.
  //
  // Es opcional: un MySQL en localhost no usa TLS y no lo necesita. Uno
  // gestionado (Aiven, Neon, PlanetScale) lo exige.
  DB_SSL_CA: z.string().optional(),

  // ── JWT ───────────────────────────────────────────────────────────────────
  // El único sin default: si falta, la API no arranca. En producción, además,
  // tiene que ser DISTINTO al de desarrollo — si son el mismo, un token
  // firmado en tu máquina abre la puerta del servidor de verdad.
  JWT_SECRET: z.string().min(32, 'El secret tiene que tener al menos 32 caracteres'),
  JWT_EXPIRES_IN: z.string().default('1h'),

  // ── CORS ──────────────────────────────────────────────────────────────────
  // En la unidad 9 era un origen solo. En producción suelen ser varios: el
  // dominio del front, el de la preview de cada rama, y localhost para poder
  // desarrollar el front contra la API de verdad.
  //
  // Se escribe separado por comas y se parte acá:
  //   CORS_ORIGIN=https://mi-front.vercel.app,http://localhost:4200
  CORS_ORIGIN: z
    .string()
    .default('http://localhost:4200')
    .transform((valor) =>
      valor
        .split(',')
        .map((origen) => origen.trim())
        .filter(Boolean),
    ),
});

const resultado = envSchema.safeParse(process.env);

if (!resultado.success) {
  console.error('\n✖ Falta configuración o está mal:\n');

  for (const issue of resultado.error.issues) {
    console.error(`  ${issue.path.join('.')}: ${issue.message}`);
  }

  console.error('\nEn desarrollo: revisá tu .env (hay plantilla en .env.example)');
  console.error('En producción: revisá las variables del panel de la plataforma\n');

  // Fallar al arrancar y en voz alta. En la nube esto es todavía más
  // importante que en tu máquina: el log del deploy va a decir exactamente qué
  // variable falta, en vez de dejarte una API que levanta y explota en el
  // primer login.
  process.exit(1);
}

export const env = resultado.data;

// Un par de atajos, para no comparar strings sueltos por toda la aplicación.
export const esProduccion = env.NODE_ENV === 'production';
export const esDesarrollo = env.NODE_ENV === 'development';
