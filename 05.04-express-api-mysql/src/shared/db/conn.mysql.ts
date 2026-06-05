import mysql from 'mysql2/promise'

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'dsw',
  password: process.env.DB_PASSWORD || 'dsw',
  database: process.env.DB_NAME || 'heroclash4geeks',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // máximo de conexiones inactivas, por defecto es igual a `connectionLimit`
  idleTimeout: 60000, // timeout de conexiones inactivas en milisegundos, por defecto 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
})
