import { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// ---------------------------------------------------------------------------
// Helmet – define HTTP headers seguros (XSS-Protection, Content-Security-Policy, etc.)
// ---------------------------------------------------------------------------
export const helmetMiddleware = helmet();

// ---------------------------------------------------------------------------
// Rate Limiting – protege contra brute-force e DDoS
// ---------------------------------------------------------------------------
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // máximo de 200 requisições por IP por janela
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    msg: "Muitas requisições deste IP. Tente novamente após 15 minutos.",
  },
});
