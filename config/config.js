const dotenv = require("dotenv");
const result = dotenv.config();
if (result.error) {
  throw result.error;
}

console.log("Variáveis de ambiente carregadas com sucesso");
console.log("Ambiente:", process.env.ENVIRONMENT);
console.log({
  username: process.env.SEQUELIZE_DB_USER,
  password: process.env.SEQUELIZE_DB_PASS,
  database: process.env.SEQUELIZE_DB_NAME,
  host: process.env.SEQUELIZE_HOST,
  port: process.env.SEQUELIZE_PORT,
  dialect: process.env.SEQUELIZE_DIALECT || "mysql",
});

module.exports = {
  development: {
    username: process.env.SEQUELIZE_DB_USER,
    password: process.env.SEQUELIZE_DB_PASS,
    database: process.env.SEQUELIZE_DB_NAME,
    host: process.env.SEQUELIZE_HOST,
    port: process.env.SEQUELIZE_PORT,
    dialect: process.env.SEQUELIZE_DIALECT || "mysql",
  },
  test: {
    username: process.env.SEQUELIZE_DB_USER,
    password: process.env.SEQUELIZE_DB_PASS,
    database: process.env.SEQUELIZE_DB_NAME,
    host: process.env.SEQUELIZE_HOST,
    port: process.env.SEQUELIZE_PORT,
    dialect: process.env.SEQUELIZE_DIALECT || "mysql",
  },
  production: {
    username: process.env.SEQUELIZE_DB_USER,
    password: process.env.SEQUELIZE_DB_PASS,
    database: process.env.SEQUELIZE_DB_NAME,
    host: process.env.SEQUELIZE_HOST,
    port: process.env.SEQUELIZE_PORT,
    dialect: process.env.SEQUELIZE_DIALECT || "mysql",
  },
};
