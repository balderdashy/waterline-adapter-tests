module.exports = {
  host: process.env.REDIS_PORT_6379_TCP_ADDR || 'localhost',
  port: 6379,
  schema: true,
  poolSize: 1,
  returnZeroOnError: false
}
