import dotenv from "dotenv";
import mongoose from "mongoose";
import { Sequelize } from "sequelize";

dotenv.config();

const environment = process.env.ENVIRONMENT || "development";
const databaseUrl = process.env.DATABASE_URL;

/**
 * Determina o dialect do banco de dados
 * Prioridade: SEQUELIZE_DIALECT > RDS_DIALECT > dialect padrão por ambiente
 */
const getDialect = (): "mysql" | "postgres" => {
  if (process.env.SEQUELIZE_DIALECT) {
    return process.env.SEQUELIZE_DIALECT as "mysql" | "postgres";
  }
  if (process.env.RDS_DIALECT) {
    return process.env.RDS_DIALECT as "mysql" | "postgres";
  }
  // Padrão: MySQL em prod (RDS), MySQL em dev (Docker)
  return "mysql";
};

/**
 * Retorna as opções de SSL apropriadas para o dialect
 */
const getSSLOptions = (dialect: "mysql" | "postgres") => {
  if (dialect === "postgres") {
    return {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    };
  }
  // MySQL RDS com SSL (opcional mas recomendado)
  if (environment !== "development") {
    return {
      ssl: "Amazon RDS",
    };
  }
  return undefined;
};

/**
 * Cria a conexão com o Sequelize
 */
const generateSequelizeConnection = (): Sequelize => {
  const dialect = getDialect();
  const isProduction = environment !== "development";

  if (environment === "development") {
    // Desenvolvimento: conexão individual com variáveis
    return new Sequelize(
      process.env.SEQUELIZE_DB_NAME || "my_database",
      process.env.SEQUELIZE_DB_USER || "root",
      process.env.SEQUELIZE_DB_PASS || "password",
      {
        host: process.env.SEQUELIZE_HOST || "localhost",
        port: Number(process.env.SEQUELIZE_PORT) || 3306,
        dialect,
        logging: process.env.DB_LOGGING === "true" ? console.log : false,
      },
    );
  }

  // Produção: usar DATABASE_URL ou variáveis individuais
  if (databaseUrl) {
    // Se DATABASE_URL está definida (Neon Postgres)
    return new Sequelize(databaseUrl, {
      dialect,
      dialectOptions: getSSLOptions(dialect),
      logging: process.env.DB_LOGGING === "true" ? console.log : false,
    });
  }

  // Produção com variáveis individuais (RDS MySQL)
  if (
    !process.env.SEQUELIZE_HOST ||
    !process.env.SEQUELIZE_DB_NAME ||
    !process.env.SEQUELIZE_DB_USER
  ) {
    throw new Error(
      `
      ❌ Configuração de banco de dados incompleta para ambiente: ${environment}
      
      Para desenvolvimento local com Docker:
        - SEQUELIZE_DB_NAME, SEQUELIZE_DB_USER, SEQUELIZE_DB_PASS, SEQUELIZE_HOST, SEQUELIZE_PORT, SEQUELIZE_DIALECT
      
      Para produção com AWS RDS (MySQL):
        - SEQUELIZE_HOST (RDS endpoint)
        - SEQUELIZE_DB_NAME (database)
        - SEQUELIZE_DB_USER (username)
        - SEQUELIZE_DB_PASS (password)
        - SEQUELIZE_PORT (usually 3306)
        - SEQUELIZE_DIALECT=mysql
      
      OU para produção com Neon (Postgres):
        - DATABASE_URL (connection string)
      `,
    );
  }

  return new Sequelize(
    process.env.SEQUELIZE_DB_NAME,
    process.env.SEQUELIZE_DB_USER,
    process.env.SEQUELIZE_DB_PASS,
    {
      host: process.env.SEQUELIZE_HOST,
      port: Number(process.env.SEQUELIZE_PORT) || 3306,
      dialect,
      dialectOptions: getSSLOptions(dialect),
      logging: process.env.DB_LOGGING === "true" ? console.log : false,
    },
  );
};

export const sequelize = generateSequelizeConnection();

/**
 * Testa e autentica a conexão com o banco de dados
 */
async function connectDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();

    const dialect = getDialect();
    const dbType =
      dialect === "mysql"
        ? environment === "development"
          ? "MySQL (Docker)"
          : "MySQL (AWS RDS)"
        : environment === "development"
          ? "Postgres (Docker)"
          : "Postgres (Neon)";

    console.log(`✅ Database connection established successfully [${dbType}]`);
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
}

export async function connectMongo() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI não definida");

    await mongoose.connect(uri);
    console.log("Conectado ao MongoDB (EC2) para logs com sucesso.");
  } catch (error) {
    console.error("Erro ao conectar no MongoDB da EC2:", error);
  }
}

// Test the database connection
connectMongo();
connectDatabase();
