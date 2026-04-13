import { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";

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

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // limite mais restrito para rotas de autenticação
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    msg: "Muitas tentativas de login. Tente novamente após 15 minutos.",
  },
});

// ---------------------------------------------------------------------------
// HPP – HTTP Parameter Pollution protection
// ---------------------------------------------------------------------------
export const hppMiddleware = hpp();

// ---------------------------------------------------------------------------
// NoSQL Injection protection (MongoDB)
// ---------------------------------------------------------------------------
export const mongoSanitizeMiddleware = mongoSanitize();
