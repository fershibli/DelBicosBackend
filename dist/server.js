"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_middleware_1 = require("./src/middlewares/cors.middleware");
const logging_middleware_1 = require("./src/middlewares/logging.middleware");
const dotenv = __importStar(require("dotenv"));
const logger_1 = __importDefault(require("./src/utils/logger"));
const address_routes_1 = __importDefault(require("./src/routes/address.routes"));
const category_routes_1 = __importDefault(require("./src/routes/category.routes"));
const subcategory_routes_1 = __importDefault(require("./src/routes/subcategory.routes"));
const professional_routes_1 = __importDefault(require("./src/routes/professional.routes"));
const appointment_routes_1 = __importDefault(require("./src/routes/appointment.routes"));
const user_routes_1 = __importDefault(require("./src/routes/user.routes"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./src/config/swagger"));
const auth_routes_1 = __importDefault(require("./src/routes/auth.routes"));
const notification_routes_1 = __importDefault(require("./src/routes/notification.routes"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const associations_1 = require("./src/models/associations");
const payment_routes_1 = __importDefault(require("./src/routes/payment.routes"));
const admin_routes_1 = __importDefault(require("./src/routes/admin.routes"));
const dashboard_routes_1 = __importDefault(require("./src/routes/dashboard.routes"));
const favorite_routes_1 = __importDefault(require("./src/routes/favorite.routes"));
const avatar_routes_1 = __importDefault(require("./src/routes/avatar.routes"));
const result = dotenv.config();
if (result.error) {
    throw result.error;
}
(0, associations_1.initializeAssociations)();
logger_1.default.info("Variáveis de ambiente carregadas com sucesso");
logger_1.default.info(`Ambiente: ${process.env.ENVIRONMENT}`);
const app = (0, express_1.default)();
const swaggerSpec = (0, swagger_jsdoc_1.default)(swagger_1.default);
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
(0, cors_middleware_1.setupCors)(app);
// Middleware de logging de requisições
app.use(logging_middleware_1.loggingMiddleware);
app.use(express_1.default.json());
const baseDir = process.env.ENVIRONMENT === "production" ? process.cwd() : __dirname;
const AVATAR_BUCKET_PATH = path_1.default.resolve(baseDir, "avatarBucket");
if (!fs_1.default.existsSync(AVATAR_BUCKET_PATH)) {
    fs_1.default.mkdirSync(AVATAR_BUCKET_PATH, { recursive: true });
}
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.use("/avatarBucket", express_1.default.static(AVATAR_BUCKET_PATH));
// Rotas
app.use("/api/user", user_routes_1.default);
app.use("/api/categories", category_routes_1.default);
app.use("/api/subcategories", subcategory_routes_1.default);
app.use("/api/professionals", professional_routes_1.default);
app.use("/api/address", address_routes_1.default);
app.use("/api/appointments", appointment_routes_1.default);
app.use("/api/notifications", notification_routes_1.default);
app.use("/api/payments", payment_routes_1.default);
app.use("/auth", auth_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
app.use("/api/dashboard", dashboard_routes_1.default);
app.use("/api/favorites", favorite_routes_1.default);
app.use("/api/avatar", avatar_routes_1.default);
const isServerless = process.env.IS_SERVERLESS == "true";
if (!isServerless) {
    const port = Number(process.env.PORT || 3000);
    app.listen(port, () => {
        logger_1.default.info(`Servidor rodando na porta ${port}`);
    });
}
else {
    logger_1.default.info("Servidor rodando em ambiente serverless");
}
exports.default = app;
