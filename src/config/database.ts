import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const environment = process.env.ENVIRONMENT;

const databaseUrl = process.env.DATABASE_URL;

if (environment !== "development" && !databaseUrl) {
  throw new Error("DATABASE_URL não está definida no arquivo .env");
}

const generateSequelizeConnection = () => {
  if (environment === "development") {
    return new Sequelize(
      process.env.SEQUELIZE_DB_NAME || "my_database",
      process.env.SEQUELIZE_DB_USER || "root",
      process.env.SEQUELIZE_DB_PASS || "password",
      {
        host: process.env.SEQUELIZE_HOST || "localhost",
        port: Number(process.env.SEQUELIZE_PORT) || 3306,
        // @ts-ignore
        dialect: `${process.env.SEQUELIZE_DIALECT}` || "mysql",
        logging: false,
      }
    );
  } else {
    if (!databaseUrl) {
      throw new Error(
        "DATABASE_URL é necessária para ambientes de produção/staging, mas não foi encontrada."
      );
    }

    return new Sequelize(databaseUrl, {
      dialect: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: false,
    });
  }
};

export const sequelize = generateSequelizeConnection();

async function connectDatabase() {
  try {
    await sequelize.authenticate();
    if (environment == "development") {
      console.log(
        "Connection to the database (Development) established successfully."
      );
    } else {
      console.log(
        "Connection to the database (Neon) established successfully."
      );
    }
  } catch (error) {
    console.error("Unable to connect to the database (Neon):", error);
  }
}

// Test the database connection
connectDatabase();
