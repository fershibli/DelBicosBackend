"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
exports.setupCors = setupCors;
const cors_1 = __importDefault(require("cors"));
// Normaliza para protocolo + host (com porta, se houver), sem barra final e em minúsculas.
const normalizeOrigin = (o) => {
    if (!o)
        return "";
    try {
        const u = new URL(o);
        return `${u.protocol}//${u.host}`.toLowerCase();
    }
    catch (_a) {
        return o.replace(/\/+$/, "").toLowerCase();
    }
};
exports.corsOptions = {
    origin: (origin, callback) => {
        const rawAllowed = process.env.ALLOWED_ORIGINS || "";
        const allowedOrigins = rawAllowed
            .split(",")
            .map((o) => o.trim())
            .filter(Boolean);
        const allowedNormalized = allowedOrigins.map(normalizeOrigin);
        if (!origin)
            return callback(null, true); // curl/Postman
        const norm = normalizeOrigin(origin);
        if (allowedNormalized.includes(norm))
            return callback(null, true);
        try {
            const host = new URL(origin).hostname.toLowerCase();
            // Libera previews do Vercel (*.vercel.app). Ajuste se quiser restringir mais.
            if (/\.vercel\.app$/.test(host))
                return callback(null, true);
        }
        catch (_) { }
        return callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
};
function setupCors(app) {
    const middleware = (0, cors_1.default)(exports.corsOptions);
    app.use(middleware);
    app.options("*", middleware); // pré-flight
}
