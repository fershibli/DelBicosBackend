import dotenv from "dotenv";
import mongoose from "mongoose";
import { Sequelize } from "sequelize";
import pg from "pg"; // Importação essencial da POC

dotenv.config();

const environment = process.env.ENVIRONMENT || "development";
const databaseUrl = process.env.DATABASE_URL;

/**
 * Determina o dialect do banco de dados
 */
const getDialect = (): "mysql" | "postgres" => {
  if (process.env.SEQUELIZE_DIALECT) {
    return process.env.SEQUELIZE_DIALECT as "mysql" | "postgres";
  }
  return databaseUrl?.includes("postgres") ? "postgres" : "mysql";
};

/**
 * Retorna as opções de SSL apropriadas (Aprimorado com a lógica da POC)
 */
const getSSLOptions = (dialect: "mysql" | "postgres") => {
  if (dialect === "postgres") {
    if (environment === "development") {
      return false;
    }
    return {
      require: true,
      rejectUnauthorized: false, // Necessário para o Neon
    };
  }
  if (environment !== "development") {
    return { ssl: "Amazon RDS" };
  }
  return undefined;
};

/**
 * Cria a conexão com o Sequelize
 */
const generateSequelizeConnection = (): Sequelize => {
  const dialect = getDialect();

  // Se existir DATABASE_URL (Caso do seu Neon)
  if (databaseUrl) {
    return new Sequelize(databaseUrl, {
      dialect,
      dialectModule: pg, // Injetando o driver pg como na POC
      dialectOptions: {
        ssl: getSSLOptions(dialect),
      },
      logging: process.env.DB_LOGGING === "true" ? console.log : false,
    });
  }

  // Fallback para variáveis individuais (Docker/RDS)
  return new Sequelize(
    process.env.SEQUELIZE_DB_NAME || "neondb",
    process.env.SEQUELIZE_DB_USER || "neondb_owner",
    process.env.SEQUELIZE_DB_PASS,
    {
      host: process.env.SEQUELIZE_HOST,
      port: Number(process.env.SEQUELIZE_PORT) || 5432,
      dialect,
      dialectModule: dialect === "postgres" ? pg : undefined,
      dialectOptions: {
        ssl: getSSLOptions(dialect),
      },
      logging: process.env.DB_LOGGING === "true" ? console.log : false,
    },
  );
};

export const sequelize = generateSequelizeConnection();

/**
 * Autentica e Sincroniza o banco
 */
async function connectDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();

    // Lógica da POC: Sincronização automática de tabelas
    // O 'alter: true' atualiza o banco sem apagar dados se você mudar o Model
    if (environment === "development" || process.env.DB_SYNC === "true") {
      await sequelize.sync({ alter: true });
      console.log("✅ Tabelas sincronizadas no Neon.");
    }

    const dialect = getDialect();
    console.log(
      `✅ Database connection established [${dialect.toUpperCase()}]`,
    );
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    // process.exit(1); // Opcional: encerra se o banco falhar
  }
}

export async function connectMongo() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri)
      return console.warn(
        "⚠️ MONGODB_URI não definida. Logs salvos apenas localmente.",
      );

    await mongoose.connect(uri);
    console.log("✅ Conectado ao MongoDB (EC2).");
  } catch (error) {
    console.error("❌ Erro MongoDB:", error);
  }
}

// Inicialização
connectMongo();
connectDatabase();
