import express, { Express } from "express";
import { setupCors } from "./src/middlewares/cors.middleware";
import { loggingMiddleware } from "./src/middlewares/logging.middleware";
import * as dotenv from "dotenv";
import logger from "./src/utils/logger";
import addressRoutes from "./src/routes/address.routes";
import categoryRoutes from "./src/routes/category.routes";
import subcategoryRoutes from "./src/routes/subcategory.routes";
import professionalRoutes from "./src/routes/professional.routes";
import appointmentRoutes from "./src/routes/appointment.routes";
import userRoutes from "./src/routes/user.routes";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./src/config/swagger";
import authRouter from "./src/routes/auth.routes";
import notificationRoutes from "./src/routes/notification.routes";
import path from "path";
import fs from "fs";
import { initializeAssociations } from "./src/models/associations";
import paymentRouter from "./src/routes/payment.routes";
import adminRoutes from "./src/routes/admin.routes";
import dashboardRoutes from "./src/routes/dashboard.routes";
import favoriteRoutes from "./src/routes/favorite.routes";

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

initializeAssociations();

logger.info("Variáveis de ambiente carregadas com sucesso");
logger.info(`Ambiente: ${process.env.ENVIRONMENT}`);

const app: Express = express();
const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

setupCors(app);

// Middleware de logging de requisições
app.use(loggingMiddleware);

app.use(express.json());
const baseDir =
  process.env.ENVIRONMENT === "production" ? process.cwd() : __dirname;
const AVATAR_BUCKET_PATH = path.resolve(baseDir, "avatarBucket");
if (!fs.existsSync(AVATAR_BUCKET_PATH)) {
  fs.mkdirSync(AVATAR_BUCKET_PATH, { recursive: true });
}

app.use("/docs", swaggerUi.serve as any, swaggerUi.setup(swaggerSpec) as any);

app.use("/avatarBucket", express.static(AVATAR_BUCKET_PATH));

// Rotas
app.use("/api/user", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/professionals", professionalRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/professionals", professionalRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRouter);
app.use("/auth", authRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/favorites", favoriteRoutes);

const isServerless = process.env.IS_SERVERLESS == "true";

if (!isServerless) {
  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => {
    logger.info(`Servidor rodando na porta ${port}`);
  });
} else {
  logger.info("Servidor rodando em ambiente serverless");
}

export default app;
