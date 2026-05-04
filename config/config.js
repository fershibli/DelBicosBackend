require("dotenv").config();

/**
 * Determina o dialect do banco de dados
 * Prioridade: SEQUELIZE_DIALECT > RDS_DIALECT > "mysql"
 */
const getDialect = () => {
  if (process.env.SEQUELIZE_DIALECT) {
    return process.env.SEQUELIZE_DIALECT;
  }
  if (process.env.RDS_DIALECT) {
    return process.env.RDS_DIALECT;
  }
  return "postgres";
};

/**
 * Retorna as opções de SSL apropriadas para o dialect
 */
// No seu src/config/config.js
const getSSLOptions = (dialect) => {
  if (dialect === "postgres") {
    return {
      require: true,               // Mudança sutil aqui
      rejectUnauthorized: false,
    };
  }
  return undefined;
};

const env = process.env.ENVIRONMENT || process.env.NODE_ENV || "development";
const dialect = getDialect();

if (process.env.__DEV__) {
  console.log("🔧 Sequelize Configuration:");
  console.log("Environment:", env);
  console.log("Dialect:", dialect);
  console.log({
    username: process.env.SEQUELIZE_DB_USER,
    password: process.env.SEQUELIZE_DB_PASS ? "***" : undefined,
    database: process.env.SEQUELIZE_DB_NAME,
    host: process.env.SEQUELIZE_HOST,
    port: process.env.SEQUELIZE_PORT,
  });
}

const config = {
  development: {
    username: process.env.SEQUELIZE_DB_USER || "root",
    password: process.env.SEQUELIZE_DB_PASS || "password",
    database: process.env.SEQUELIZE_DB_NAME || "my_database",
    host: process.env.SEQUELIZE_HOST || "localhost",
    port: Number(process.env.SEQUELIZE_PORT) || 3306,
    dialect,
    dialect,
    dialectOptions: getSSLOptions(dialect, "development"), 
    logging: process.env.DB_LOGGING === "true" ? console.log : false,
  },
  production: {
    // Opção 1: DATABASE_URL (Neon Postgres)
    use_env_variable: process.env.DATABASE_URL ? "DATABASE_URL" : undefined,
    // Opção 2: Variáveis individuais (AWS RDS MySQL)
    username: process.env.SEQUELIZE_DB_USER,
    password: process.env.SEQUELIZE_DB_PASS,
    database: process.env.SEQUELIZE_DB_NAME,
    host: process.env.SEQUELIZE_HOST,
    port: Number(process.env.SEQUELIZE_PORT) || 3306,
    dialect,
    dialectOptions: getSSLOptions(dialect, env),
    logging: process.env.DB_LOGGING === "true" ? console.log : false,
  },
};

// Se use_env_variable é undefined, remover a propriedade
if (config.production.use_env_variable === undefined) {
  delete config.production.use_env_variable;
}

module.exports = config[env];
