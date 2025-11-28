import { Request, Response, NextFunction } from "express";
import { logRequest } from "../utils/logger";
import { AuthenticatedRequest } from "../interfaces/authentication.interface";

/**
 * Middleware para logging automático de todas as requisições HTTP
 * Captura método, URL, status code, tempo de resposta e usuário autenticado
 */
export const loggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  const { method, originalUrl } = req;

  // Capturar quando a resposta for finalizada
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const { statusCode } = res;

    // Tentar obter ID do usuário se estiver autenticado
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.id;

    // Logar a requisição
    logRequest(method, originalUrl, statusCode, duration, userId);
  });

  next();
};
