"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggingMiddleware = void 0;
const logger_1 = require("../utils/logger");
/**
 * Middleware para logging automático de todas as requisições HTTP
 * Captura método, URL, status code, tempo de resposta e usuário autenticado
 */
const loggingMiddleware = (req, res, next) => {
    const startTime = Date.now();
    const { method, originalUrl } = req;
    // Capturar quando a resposta for finalizada
    res.on("finish", () => {
        var _a;
        const duration = Date.now() - startTime;
        const { statusCode } = res;
        // Tentar obter ID do usuário se estiver autenticado
        const authReq = req;
        const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a.id;
        // Logar a requisição
        (0, logger_1.logRequest)(method, originalUrl, statusCode, duration, userId);
    });
    next();
};
exports.loggingMiddleware = loggingMiddleware;
