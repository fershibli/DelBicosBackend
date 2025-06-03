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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.connectDatabase = void 0;
const sequelize_1 = require("sequelize");
const sequelizeInstance = new sequelize_1.Sequelize('dougl947_Delbicos', 'dougl947_ScrumMaster', '[orAH(EiSHC9', {
    host: '162.241.2.230',
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
        connectTimeout: 60000,
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: console.log
});
const connectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelizeInstance.authenticate();
        console.log('Conexão estabelecida com sucesso!');
        yield sequelizeInstance.sync({ alter: true });
        return sequelizeInstance;
    }
    catch (error) {
        console.error('Erro na conexão:', error);
        process.exit(1);
    }
});
exports.connectDatabase = connectDatabase;
exports.sequelize = sequelizeInstance;
