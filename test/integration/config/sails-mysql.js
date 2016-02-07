module.exports = {
  host: process.env.MYSQL_PORT_3306_TCP_ADDR || 'localhost',
  port: 3306,
  user: process.env.MYSQL_ENV_MYSQL_USER || 'root',
  password: process.env.MYSQL_ENV_MYSQL_PASSWORD || '',
  database: process.env.MYSQL_ENV_MYSQL_DATABASE || 'sails_mysql',
  pool: true,
  connectionLimit: 10,
  queueLimit: 0,
  waitForConnections: true
}
