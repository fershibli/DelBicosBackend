import express, { Express } from "express";
// import mongoose from "mongoose";
import cors from "cors";
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
import path from "path";
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

app.use(
  cors({
    origin: [
      "http://localhost:8081",
      "http://localhost:19000",
      "exp://localhost:8081",
      "exp://host.docker.internal:8081",
    ],
    credentials: true,
  })
);

app.use(express.json());
const AVATAR_BUCKET_PATH = path.join(__dirname, "avatarBucket"); // <-- VERIFIQUE ESTE CAMINHO
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
app.use("/api/payments", paymentRouter);
app.use("/auth", authRouter);

const isServerless = process.env.IS_SERVERLESS == "true";

if (!isServerless) {
  app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
  });
} else {
  console.log("Servidor rodando em ambiente serverless");
}

export default app;
