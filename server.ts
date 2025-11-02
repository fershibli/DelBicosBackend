import express, { Express } from "express";
// import mongoose from "mongoose";
import cors, { CorsOptions } from "cors";
import * as dotenv from "dotenv";
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

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

initializeAssociations();

console.log("Variáveis de ambiente carregadas com sucesso");
console.log("Ambiente:", process.env.ENVIRONMENT);

const app: Express = express();
const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const rawAllowed = process.env.ALLOWED_ORIGINS || "";
const allowedOrigins = rawAllowed
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// Normaliza para protocolo + host (com porta, se houver), sem barra final e em minúsculas.
const normalizeOrigin = (o?: string) => {
  if (!o) return "";
  try {
    const u = new URL(o);
    return `${u.protocol}//${u.host}`.toLowerCase();
  } catch {
    return o.replace(/\/+$/, "").toLowerCase();
  }
};
const allowedNormalized = allowedOrigins.map(normalizeOrigin);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // curl/Postman
    const norm = normalizeOrigin(origin);
    if (allowedNormalized.includes(norm)) return callback(null, true);
    try {
      const host = new URL(origin).hostname.toLowerCase();
      // Libera previews do Vercel (*.vercel.app). Ajuste se quiser restringir mais.
      if (/\.vercel\.app$/.test(host)) return callback(null, true);
    } catch (_) {}
    return callback(new Error(`Origin not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // pré-flight

app.use(express.json());
const baseDir =
  process.env.ENVIRONMENT === "production" ? process.cwd() : __dirname;
const AVATAR_BUCKET_PATH = path.resolve(baseDir, "avatarBucket");
if (!fs.existsSync(AVATAR_BUCKET_PATH)) {
  fs.mkdirSync(AVATAR_BUCKET_PATH, { recursive: true });
}

app.use("/docs", swaggerUi.serve as any, swaggerUi.setup(swaggerSpec) as any);

app.use("/avatarBucket", express.static(AVATAR_BUCKET_PATH));

// // Conectar ao MongoDB
// mongoose.connect(process.env.MONGO_URI as string, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// } as any)
//   .then(() => console.log('Conectado ao MongoDB'))
//   .catch((err: any) => console.error('Erro ao conectar ao MongoDB:', err));

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

const isServerless = process.env.IS_SERVERLESS == "true";

if (!isServerless) {
  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
} else {
  console.log("Servidor rodando em ambiente serverless");
}

export default app;
