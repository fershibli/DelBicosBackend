import { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import logger from "../utils/logger";

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

// ---------------------------------------------------------------------------
// XSS Sanitization – remove tags HTML e scripts maliciosos do input
// ---------------------------------------------------------------------------
function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value !== null && typeof value === "object") {
    return sanitizeObject(value as Record<string, unknown>);
  }
  return value;
}

function sanitizeObject(
  obj: Record<string, unknown>
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    sanitized[key] = sanitizeValue(obj[key]);
  }
  return sanitized;
}

export const xssSanitizer = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === "object") {
    req.query = sanitizeObject(req.query) as typeof req.query;
  }
  if (req.params && typeof req.params === "object") {
    req.params = sanitizeObject(req.params) as typeof req.params;
  }
  next();
};

// ---------------------------------------------------------------------------
// SQL Injection detection – camada extra de defesa (Sequelize já parametriza)
// ---------------------------------------------------------------------------

const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|EXECUTE)\b.*\b(FROM|INTO|TABLE|SET|WHERE|ALL)\b)/i,
  /(';\s*(DROP|ALTER|DELETE|UPDATE|INSERT)\b)/i,
  /(--\s*$|;\s*--)/m,
  /(\b(OR|AND)\b\s+[\d'"]+=[\d'"]+)/i,
];

function containsSqlInjection(value: unknown): boolean {
  if (typeof value === "string") {
    return SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(value));
  }
  if (Array.isArray(value)) {
    return value.some(containsSqlInjection);
  }
  if (value !== null && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some(
      containsSqlInjection
    );
  }
  return false;
}

export const sqlInjectionGuard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const targets = [req.body, req.query, req.params];
  for (const target of targets) {
    if (target && containsSqlInjection(target)) {
      logger.warn(
        `SQL Injection attempt detected from IP ${req.ip} on ${req.method} ${req.originalUrl}`
      );
      return res.status(400).json({
        msg: "Requisição bloqueada: entrada inválida detectada.",
      });
    }
  }
  next();
};
