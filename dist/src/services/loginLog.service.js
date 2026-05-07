"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveLoginLog = saveLoginLog;
const LoginLog_1 = require("../models/LoginLog");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Salva um log de login no MongoDB de forma assíncrona (fire-and-forget).
 * Não bloqueia a resposta ao cliente e não propaga erros.
 *
 * @param req - Express Request (para extrair IP e User-Agent)
 * @param data - Dados do login (userId, username, jwt)
 */
function saveLoginLog(req, data) {
    // Fire-and-forget: não usamos await, a Promise roda em background
    LoginLog_1.LoginLog.create({
        userId: String(data.userId),
        username: data.username,
        loginDate: new Date(),
        jwt: data.jwt,
        ip: req.ip || req.headers["x-forwarded-for"] || "unknown",
        userAgent: req.headers["user-agent"] || "unknown",
        status: "SUCCESS",
    }).catch((error) => {
        // Log do erro sem derrubar a API
        logger_1.default.error("Falha ao salvar log de login no MongoDB", {
            error: error instanceof Error ? error.message : String(error),
            userId: data.userId,
            username: data.username,
        });
    });
}
