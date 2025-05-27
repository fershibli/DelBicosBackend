"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("../config/database"));
const authRoutes_1 = __importDefault(require("../routes/authRoutes"));
const userRoutes_1 = __importDefault(require("../routes/userRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Sincronizar o banco de dados
database_1.default.sync({ force: false }).then(() => {
    console.log(`Banco de dados sincronizado em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}.`);
});
// Rotas
app.use('/api/auth', authRoutes_1.default);
app.use('/api', userRoutes_1.default);
exports.default = app;
