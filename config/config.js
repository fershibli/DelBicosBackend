require("dotenv").config();

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

const env = process.env.ENVIRONMENT || process.env.NODE_ENV;

const config = {
  development: {
    username: process.env.SEQUELIZE_DB_USER,
    password: process.env.SEQUELIZE_DB_PASS,
    database: process.env.SEQUELIZE_DB_NAME,
    host: process.env.SEQUELIZE_HOST,
    port: process.env.SEQUELIZE_PORT,
    dialect: process.env.SEQUELIZE_DIALECT || "mysql",
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};

module.exports = config[env];
