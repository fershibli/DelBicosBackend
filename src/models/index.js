"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const db = {};

// Forçamos a leitura direta do .env para evitar erros de importação do config.js
const sequelize = new Sequelize(
  process.env.SEQUELIZE_DB_NAME,
  process.env.SEQUELIZE_DB_USER,
  process.env.SEQUELIZE_DB_PASS,
  {
    host: process.env.SEQUELIZE_HOST,
    port: process.env.SEQUELIZE_PORT || 5432,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

console.log(`[Sequelize] Conectando ao Neon com SSL Mandatário...`);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      (file.slice(-3) === ".ts" || file.slice(-3) === ".js") &&
      file.indexOf(".test.ts") === -1 &&
      file.toLowerCase() !== "associations.ts"
    );
  })
  .forEach((file) => {
    try {
      const modelModule = require(path.join(__dirname, file));
      const modelDef = modelModule.default ? modelModule.default : modelModule;

      if (typeof modelDef === "function") {
        const model = modelDef(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
      }
    } catch (error) {
      // Silencia erros de arquivos que não são modelos
    }
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Garante que as associações sejam disparadas
try {
  const { initializeAssociations } = require("./Associations");
  if (initializeAssociations) initializeAssociations();
} catch (e) {}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;