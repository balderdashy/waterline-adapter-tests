module.exports = {
  host: process.env.POSTGRES_PORT_5432_TCP_ADDR || 'localhost',
  user: process.env.POSTGRES_ENV_POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_ENV_POSTGRES_PASSWORD || '',
  database: process.env.POSTGRES_ENV_POSTGRES_DB || 'sailspg',
  port: process.env.POSTGRES_PORT_5432_TCP_PORT || 5432,
  schema: true,
  ssl: false
}
