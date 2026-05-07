"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
exports.connectMongo = connectMongo;
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const sequelize_1 = require("sequelize");
const pg_1 = __importDefault(require("pg")); // Importação essencial da POC
dotenv_1.default.config();
const environment = process.env.ENVIRONMENT || "development";
const databaseUrl = process.env.DATABASE_URL;
/**
 * Determina o dialect do banco de dados
 */
const getDialect = () => {
    if (process.env.SEQUELIZE_DIALECT) {
        return process.env.SEQUELIZE_DIALECT;
    }
    return (databaseUrl === null || databaseUrl === void 0 ? void 0 : databaseUrl.includes("postgres")) ? "postgres" : "mysql";
};
/**
 * Retorna as opções de SSL apropriadas (Aprimorado com a lógica da POC)
 */
const getSSLOptions = (dialect) => {
    if (dialect === "postgres") {
        if (!process.env.DATABASE_URL && environment === "development") {
            return false; // Docker local Postgres does not support SSL
        }
        // SSL only when there's an external DATABASE_URL (e.g. Neon) or non-development env
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
const generateSequelizeConnection = () => {
    const dialect = getDialect();
    // Se existir DATABASE_URL (Caso do seu Neon)
    if (databaseUrl) {
        return new sequelize_1.Sequelize(databaseUrl, {
            dialect,
            dialectModule: pg_1.default, // Injetando o driver pg como na POC
            dialectOptions: {
                ssl: getSSLOptions(dialect),
            },
            logging: process.env.DB_LOGGING === "true" ? console.log : false,
        });
    }
    // Fallback para variáveis individuais (Docker/RDS)
    return new sequelize_1.Sequelize(process.env.SEQUELIZE_DB_NAME || "neondb", process.env.SEQUELIZE_DB_USER || "neondb_owner", process.env.SEQUELIZE_DB_PASS, {
        host: process.env.SEQUELIZE_HOST,
        port: Number(process.env.SEQUELIZE_PORT) || 5432,
        dialect,
        dialectModule: dialect === "postgres" ? pg_1.default : undefined,
        dialectOptions: {
            ssl: getSSLOptions(dialect),
        },
        logging: process.env.DB_LOGGING === "true" ? console.log : false,
    });
};
exports.sequelize = generateSequelizeConnection();
/**
 * Autentica e Sincroniza o banco
 */
function connectDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.sequelize.authenticate();
            // Lógica da POC: Sincronização automática de tabelas
            // O 'alter: true' atualiza o banco sem apagar dados se você mudar o Model
            if (environment === "development" || process.env.DB_SYNC === "true") {
                yield exports.sequelize.sync({ alter: true });
                if (databaseUrl === null || databaseUrl === void 0 ? void 0 : databaseUrl.includes("aws")) {
                    console.log("✅ Tabelas sincronizadas no RDS.");
                }
                else if (databaseUrl === null || databaseUrl === void 0 ? void 0 : databaseUrl.includes("neon")) {
                    console.log("✅ Tabelas sincronizadas no Neon.");
                }
                else {
                    console.log("✅ Tabelas sincronizadas no banco local.");
                }
            }
            const dialect = getDialect();
            console.log(`✅ Database connection established [${dialect.toUpperCase()}]`);
        }
        catch (error) {
            console.error("❌ Unable to connect to the database:", error);
            // process.exit(1); // Opcional: encerra se o banco falhar
        }
    });
}
function connectMongo() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const uri = process.env.MONGODB_URI;
            if (!uri)
                return console.warn("⚠️ MONGODB_URI não definida. Logs salvos apenas localmente.");
            yield mongoose_1.default.connect(uri);
            console.log("✅ Conectado ao MongoDB.");
        }
        catch (error) {
            console.error("❌ Erro MongoDB:", error);
        }
    });
}
// Inicialização
connectMongo();
connectDatabase();
