import { Request } from "express";
import { LoginLog } from "../models/LoginLog";
import logger from "../utils/logger";

interface LoginLogData {
  userId: string | number;
  username: string;
  jwt: string;
}

/**
 * Salva um log de login no MongoDB de forma assíncrona (fire-and-forget).
 * Não bloqueia a resposta ao cliente e não propaga erros.
 *
 * @param req - Express Request (para extrair IP e User-Agent)
 * @param data - Dados do login (userId, username, jwt)
 */
export function saveLoginLog(req: Request, data: LoginLogData): void {
  // Fire-and-forget: não usamos await, a Promise roda em background
  LoginLog.create({
    userId: String(data.userId),
    username: data.username,
    loginDate: new Date(),
    jwt: data.jwt,
    ip: req.ip || req.headers["x-forwarded-for"] || "unknown",
    userAgent: req.headers["user-agent"] || "unknown",
    status: "SUCCESS",
  }).catch((error) => {
    // Log do erro sem derrubar a API
    logger.error("Falha ao salvar log de login no MongoDB", {
      error: error instanceof Error ? error.message : String(error),
      userId: data.userId,
      username: data.username,
    });
  });
}
