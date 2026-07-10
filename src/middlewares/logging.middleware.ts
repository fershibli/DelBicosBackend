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
  next: NextFunction,
) => {
  const startTime = Date.now();
  const { method, originalUrl } = req;
  let alreadyLogged = false;

  const getUserId = () => {
    const authReq = req as AuthenticatedRequest;
    return authReq.user?.id;
  };

  // Capturar quando a resposta for finalizada
  res.on("finish", () => {
    if (alreadyLogged) return;
    alreadyLogged = true;

    const duration = Date.now() - startTime;
    const { statusCode } = res;

    // Logar a requisição finalizada normalmente
    logRequest(method, originalUrl, statusCode, duration, getUserId());
  });

  // Captura conexões encerradas antes do finish (ex.: timeout/abort no cliente)
  res.on("close", () => {
    if (alreadyLogged) return;
    alreadyLogged = true;

    const duration = Date.now() - startTime;
    const statusCode = res.headersSent ? res.statusCode : 499;
    logRequest(
      method,
      originalUrl,
      statusCode,
      duration,
      getUserId(),
      "request_aborted_before_finish",
    );
  });

  next();
};
