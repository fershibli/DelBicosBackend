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
exports.connectDatabase = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
const date_fns_1 = require("date-fns");
const date_fns_tz_1 = require("date-fns-tz");
// Carregar variáveis de ambiente
dotenv_1.default.config();
// Definir o fuso horário de São Paulo (-03:00)
const timeZone = 'America/Sao_Paulo';
const currentDateTime = (0, date_fns_tz_1.toZonedTime)(new Date(), timeZone);
const formattedDateTime = (0, date_fns_1.format)(currentDateTime, "yyyy-MM-dd 'at' HH:mm:ss 'BRT'");
// Configurar a conexão com o banco de dados
const sequelize = process.env.DATABASE_URL
    ? new sequelize_1.Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            timezone: timeZone,
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    })
    : new sequelize_1.Sequelize('delbicos', 'username', 'password', {
        host: 'localhost',
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            timezone: timeZone,
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    });
// Função para conectar ao banco de dados
const connectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log(`Connection to the database has been established successfully at ${formattedDateTime}.`);
    }
    catch (error) {
        console.error(`Unable to connect to the database at ${formattedDateTime}:`, error);
        process.exit(1); // Encerrar o processo em caso de falha na conexão
    }
});
exports.connectDatabase = connectDatabase;
// Executar a conexão ao carregar o arquivo
(0, exports.connectDatabase)();
exports.default = sequelize;
