import { Request, Response, NextFunction } from "express";
import helmet from "helmet";

// ---------------------------------------------------------------------------
// Helmet – define HTTP headers seguros (XSS-Protection, Content-Security-Policy, etc.)
// ---------------------------------------------------------------------------
export const helmetMiddleware = helmet();
