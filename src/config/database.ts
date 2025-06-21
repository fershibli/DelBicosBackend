import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.SEQUELIZE_DB_NAME || "my_database",
  process.env.SEQUELIZE_DB_USER || "root",
  process.env.SEQUELIZE_DB_PASS || "password",
  {
    host: process.env.SEQUELIZE_HOST || "localhost",
    port: Number(process.env.SEQUELIZE_PORT) || 3306,
    // @ts-ignore
    dialect: `${process.env.SEQUELIZE_DIALECT}` || "mysql",
    logging: false, // opcional: desativa logs SQL no console
  }
);

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
