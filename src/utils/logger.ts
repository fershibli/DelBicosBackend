import dotenv from "dotenv";
dotenv.config();

import winston from "winston";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import WinstonCloudWatch from "winston-cloudwatch";
import os from "os";

// Inicializar Logtail se token estiver configurado
const logtail = process.env.LOGTAIL_TOKEN
  ? new Logtail(process.env.LOGTAIL_TOKEN)
  : null;

// Configuração de formato personalizado
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.metadata({
    fillExcept: ["message", "level", "timestamp", "label"],
  }),
  winston.format.json()
);

// Formato para console (desenvolvimento)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, metadata }) => {
    let metaStr = "";
    if (metadata && Object.keys(metadata).length > 0) {
      metaStr = `\n${JSON.stringify(metadata, null, 2)}`;
    }
    return `[${timestamp}] ${level}: ${message}${metaStr}`;
  })
);

// Configurar transports
const transports: winston.transport[] = [
  // Console para desenvolvimento
  new winston.transports.Console({
    format: consoleFormat,
    level: process.env.ENVIRONMENT === "production" ? "info" : "debug",
  }),
];

// Adicionar Logtail transport se configurado
if (logtail) {
  transports.push(new LogtailTransport(logtail));
}

/**
 * CloudWatch Logs — ativado fora de development OU com flag ENABLE_CLOUDWATCH=true.
 * Erros críticos são enviados imediatamente (flushOnWrite para level 'error').
 */
const environment = process.env.ENVIRONMENT || "development";
const shouldEnableCloudWatch =
  environment !== "development" || process.env.ENABLE_CLOUDWATCH === "true";

if (shouldEnableCloudWatch && process.env.AWS_ACCESS_KEY_ID_CW) {
  const cloudWatchTransport = new WinstonCloudWatch({
    logGroupName: "/fatec/projeto-pi/backend",
    logStreamName: `${os.hostname()}-${new Date().toISOString().split("T")[0]}`,
    awsOptions: {
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID_CW!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_CW!,
        sessionToken: process.env.AWS_SESSION_TOKEN_CW,
      },
      region: process.env.AWS_REGION_CW || "us-east-1",
    },
    messageFormatter: ({ level, message, ...meta }) =>
      JSON.stringify({ level, message, ...meta }),
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
  const cloudWatchInfoTransport = new WinstonCloudWatch({
    logGroupName: "/fatec/projeto-pi/backend",
    logStreamName: `${os.hostname()}-${new Date().toISOString().split("T")[0]}-info`,
    awsOptions: {
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID_CW!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_CW!,
        sessionToken: process.env.AWS_SESSION_TOKEN_CW,
      },
      region: process.env.AWS_REGION_CW || "us-east-1",
    },
    messageFormatter: ({ level, message, ...meta }) =>
      JSON.stringify({ level, message, ...meta }),
    level: "info",
    // Upload a cada 10 segundos para não sobrecarregar as chamadas da AWS (produção)
    uploadRate: 10000,
  });

  cloudWatchInfoTransport.on("error", (err) => {
    console.error("⚠️ CloudWatch info transport error (non-fatal):", err.message);
  });

  transports.push(cloudWatchInfoTransport);

  console.log(
    `✅ CloudWatch Logs habilitado [grupo: /fatec/projeto-pi/backend | região: ${process.env.AWS_REGION_CW || "us-east-1"}]`
  );
}

// Criar logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: customFormat,
  transports,
  exitOnError: false,
});

// Adicionar métodos auxiliares para logging contextual
export const logRequest = (
  method: string,
  url: string,
  statusCode: number,
  duration: number,
  userId?: number,
  error?: string
) => {
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
  } else if (statusCode >= 400) {
    logger.warn("Request warning", logData);
  } else {
    logger.info("Request completed", logData);
  }
};

export const logAuth = (
  action: string,
  userId?: number,
  email?: string,
  success: boolean = true,
  reason?: string
) => {
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
  } else {
    logger.warn(`Auth failed: ${action}`, logData);
  }
};

export const logDatabase = (
  operation: string,
  table: string,
  recordId?: number,
  error?: string
) => {
  const logData = {
    type: "database",
    operation,
    table,
    recordId,
    error,
  };

  if (error) {
    logger.error(`DB error: ${operation} on ${table}`, logData);
  } else {
    logger.debug(`DB: ${operation} on ${table}`, logData);
  }
};

export const logError = (
  message: string,
  error: Error | unknown,
  context?: Record<string, any>
) => {
  const errorData = {
    type: "error",
    message,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    ...context,
  };

  logger.error(message, errorData);
};

export default logger;
