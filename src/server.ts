import express, { Express } from "express";
import http from "http";
import { setupCors } from "./middlewares/cors.middleware";
import { loggingMiddleware } from "./middlewares/logging.middleware";
import {
  helmetMiddleware,
  globalRateLimiter,
  authRateLimiter,
  hppMiddleware,
  mongoSanitizeMiddleware,
  xssSanitizer,
  sqlInjectionGuard,
} from "./middlewares/security.middleware";
import * as dotenv from "dotenv";
import logger from "./utils/logger";
import addressRoutes from "./routes/address.routes";
import categoryRoutes from "./routes/category.routes";
import subcategoryRoutes from "./routes/subcategory.routes";
import professionalRoutes from "./routes/professional.routes";
import appointmentRoutes from "./routes/appointment.routes";
import userRoutes from "./routes/user.routes";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./config/swagger";
import authRouter from "./routes/auth.routes";
import notificationRoutes from "./routes/notification.routes";
import path from "path";
import fs from "fs";
import { initializeAssociations } from "./models/associations";
import paymentRouter from "./routes/payment.routes";
import adminRoutes from "./routes/admin.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import favoriteRoutes from "./routes/favorite.routes";
import avatarRouter from "./routes/avatar.routes";
import { startAppointmentCron } from "./jobs/appointmentCron";
import serviceRoutes from "./routes/service.routes";
import availabilityRoutes from "./routes/availability.routes";
import availabilityLockRoutes from "./routes/availabilityLock.routes";
import uploadRoutes from "./routes/upload.routes";
import proxyUploadRoutes from "./routes/proxyUpload.routes";
import chatRoutes from "./routes/chat.routes";
import { initChatSocket } from "./realtime/chatSocket";

dotenv.config({ override: false });

initializeAssociations();

logger.info("Variáveis de ambiente carregadas com sucesso");
logger.info(`Ambiente: ${process.env.ENVIRONMENT}`);

startAppointmentCron();
logger.info("Cron jobs iniciados");

const app: Express = express();
const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// // Helmet – protege contra ataques comuns com HTTP headers
// app.use(helmetMiddleware);

// // Rate limiting – protege contra brute-force e DDoS
// app.use(globalRateLimiter);

// // HPP – protege contra HTTP Parameter Pollution
// app.use(hppMiddleware);

// // Mongo Sanitize – protege contra NoSQL injection
// app.use(mongoSanitizeMiddleware);

// // XSS Sanitizer – escapa HTML e scripts maliciosos
// app.use(xssSanitizer);

// // SQL Injection Guard – detecta e bloqueia SQL injection
// app.use(sqlInjectionGuard);

setupCors(app);

// Middleware de logging de requisições
app.use(loggingMiddleware);

const baseDir =
  process.env.ENVIRONMENT === "production" ? process.cwd() : path.resolve(__dirname, "..");
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
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRouter);
app.use("/auth", authRateLimiter, authRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/avatar", avatarRouter);
app.use("/api/services", serviceRoutes);
app.use("/api/availabilities", availabilityRoutes);
app.use("/api/availability-locks", availabilityLockRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/proxy-upload", proxyUploadRoutes);
app.use("/api/chat", chatRoutes);

// Test endpoint to invoke email fallback (Lambda) directly
app.post("/test-email-fallback", async (req, res) => {
  const { to, subject, body } = req.body || {};
  if (!to || !subject || !body) {
    return res
      .status(400)
      .json({ error: 'Fields "to", "subject", "body" are required' });
  }
  try {
    // dynamic import to avoid startup dependency issues
    const { sendViaLambda } = await import("./utils/emailFallback");
    const result = await sendViaLambda({ to, subject, html: body });
    if (result) return res.status(200).json({ ok: true });
    return res
      .status(502)
      .json({ ok: false, error: "Lambda invocation failed" });
  } catch (err) {
    logger.error("Error in /test-email-fallback:", err as any);
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

const isServerless = process.env.IS_SERVERLESS == "true";

if (!isServerless) {
  const port = Number(process.env.PORT || 3000);
  // Servidor HTTP compartilhado entre Express e socket.io (chat em tempo real)
  const httpServer = http.createServer(app);
  initChatSocket(httpServer);
  httpServer.listen(port, () => {
    logger.info(`Servidor rodando na porta ${port}`);
  });
} else {
  logger.info("Servidor rodando em ambiente serverless");
}

export default app;
