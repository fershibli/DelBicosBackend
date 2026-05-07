"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = exports.logDatabase = exports.logAuth = exports.logRequest = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const winston_1 = __importDefault(require("winston"));
const node_1 = require("@logtail/node");
const winston_2 = require("@logtail/winston");
const winston_cloudwatch_1 = __importDefault(require("winston-cloudwatch"));
const os_1 = __importDefault(require("os"));
// Inicializar Logtail se token estiver configurado
const environment = process.env.ENVIRONMENT || "development";
const shouldEnableLogtail = environment !== "development" || process.env.ENABLE_LOGTAIL === "true";
const logtail = shouldEnableLogtail && process.env.LOGTAIL_TOKEN
    ? new node_1.Logtail(process.env.LOGTAIL_TOKEN)
    : null;
// Configuração de formato personalizado
const customFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.metadata({
    fillExcept: ["message", "level", "timestamp", "label"],
}), winston_1.default.format.json());
// Formato para console (desenvolvimento)
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: "HH:mm:ss" }), winston_1.default.format.printf(({ timestamp, level, message, metadata }) => {
    let metaStr = "";
    if (metadata && Object.keys(metadata).length > 0) {
        metaStr = `\n${JSON.stringify(metadata, null, 2)}`;
    }
    return `[${timestamp}] ${level}: ${message}${metaStr}`;
}));
// Configurar transports
const transports = [
    // Console para desenvolvimento
    new winston_1.default.transports.Console({
        format: consoleFormat,
        level: process.env.ENVIRONMENT === "production" ? "info" : "debug",
    }),
];
// Adicionar Logtail transport se configurado
if (logtail) {
    transports.push(new winston_2.LogtailTransport(logtail));
}
/**
 * CloudWatch Logs — ativado fora de development OU com flag ENABLE_CLOUDWATCH=true.
 * Erros críticos são enviados imediatamente (flushOnWrite para level 'error').
 */
const shouldEnableCloudWatch = environment !== "development" || process.env.ENABLE_CLOUDWATCH === "true";
if (shouldEnableCloudWatch && process.env.AWS_ACCESS_KEY_ID_CW) {
    const cloudWatchTransport = new winston_cloudwatch_1.default({
        logGroupName: "/fatec/projeto-pi/backend",
        logStreamName: `${os_1.default.hostname()}-${new Date().toISOString().split("T")[0]}`,
        awsOptions: {
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID_CW,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_CW,
                sessionToken: process.env.AWS_SESSION_TOKEN_CW,
            },
            region: process.env.AWS_REGION_CW || "us-east-1",
        },
        messageFormatter: (_a) => {
            var { level, message } = _a, meta = __rest(_a, ["level", "message"]);
            return JSON.stringify(Object.assign({ level, message }, meta));
        },
        // Envia imediatamente logs de nível 'error' para o CloudWatch
        level: "error",
        uploadRate: 2000,
    });
    // Listener de erro interno para não derrubar a API se o CloudWatch estiver fora
    cloudWatchTransport.on("error", (err) => {
        console.error("⚠️ CloudWatch transport error (non-fatal):", err.message);
    });
    transports.push(cloudWatchTransport);
    // Segundo transporte para logs info+ (upload em batch, não imediato)
    const cloudWatchInfoTransport = new winston_cloudwatch_1.default({
        logGroupName: "/fatec/projeto-pi/backend",
        logStreamName: `${os_1.default.hostname()}-${new Date().toISOString().split("T")[0]}-info`,
        awsOptions: {
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID_CW,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_CW,
                sessionToken: process.env.AWS_SESSION_TOKEN_CW,
            },
            region: process.env.AWS_REGION_CW || "us-east-1",
        },
        messageFormatter: (_a) => {
            var { level, message } = _a, meta = __rest(_a, ["level", "message"]);
            return JSON.stringify(Object.assign({ level, message }, meta));
        },
        level: "info",
        // Upload a cada 10 segundos para não sobrecarregar as chamadas da AWS (produção)
        uploadRate: 10000,
    });
    cloudWatchInfoTransport.on("error", (err) => {
        console.error("⚠️ CloudWatch info transport error (non-fatal):", err.message);
    });
    transports.push(cloudWatchInfoTransport);
    console.log(`✅ CloudWatch Logs habilitado [grupo: /fatec/projeto-pi/backend | região: ${process.env.AWS_REGION_CW || "us-east-1"}]`);
}
// Criar logger
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: customFormat,
    transports,
    exitOnError: false,
});
// Adicionar métodos auxiliares para logging contextual
const logRequest = (method, url, statusCode, duration, userId, error) => {
    const logData = {
        type: "request",
        method,
        url,
        statusCode,
        duration: `${duration}ms`,
        userId,
        error,
    };
    if (statusCode >= 500) {
        logger.error("Request error", logData);
    }
    else if (statusCode >= 400) {
        logger.warn("Request warning", logData);
    }
    else {
        logger.info("Request completed", logData);
    }
};
exports.logRequest = logRequest;
const logAuth = (action, userId, email, success = true, reason) => {
    const logData = {
        type: "authentication",
        action,
        userId,
        email,
        success,
        reason,
    };
    if (success) {
        logger.info(`Auth: ${action}`, logData);
    }
    else {
        logger.warn(`Auth failed: ${action}`, logData);
    }
};
exports.logAuth = logAuth;
const logDatabase = (operation, table, recordId, error) => {
    const logData = {
        type: "database",
        operation,
        table,
        recordId,
        error,
    };
    if (error) {
        logger.error(`DB error: ${operation} on ${table}`, logData);
    }
    else {
        logger.debug(`DB: ${operation} on ${table}`, logData);
    }
};
exports.logDatabase = logDatabase;
const logError = (message, error, context) => {
    const errorData = Object.assign({ type: "error", message, error: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined }, context);
    logger.error(message, errorData);
};
exports.logError = logError;
exports.default = logger;
