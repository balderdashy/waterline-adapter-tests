module.exports = {
  host: process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost',
  database: 'sails-mongo',
  port: 27017,
  schema: true,
  poolSize: 1
}
