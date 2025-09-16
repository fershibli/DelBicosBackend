import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
import addressRoutes from "./src/routes/address.routes";
import serviceRoutes from "./src/routes/service.routes";
import categoryRoutes from "./src/routes/category.routes";
import subcategoryRoutes from "./src/routes/subcategory.routes";
import professionalRoutes from "./src/routes/professional.routes";
import clientsRoutes from "./src/routes/client.routes";
import professionalAvailabilityRoutes from "./src/routes/professionalAvailability.routes";
import appointmentRoutes from "./src/routes/appointment.routes";
import userRoutes from "./src/routes/user.routes";
import galleryRoutes from "./src/routes/gallery.routes";
import amenitiesRoutes from "./src/routes/amenities.route";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./src/config/swagger";
import professionalAmenityRoutes from "./src/routes/professionalAmenity.routes";
import emailRouter from "./src/routes/email.routes";
import authRouter from "./src/routes/auth.routes";

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

console.log("Variáveis de ambiente carregadas com sucesso");
console.log("Ambiente:", process.env.ENVIRONMENT);

const app: Express = express();
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// // Conectar ao MongoDB
// mongoose.connect(process.env.MONGO_URI as string, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// } as any)
//   .then(() => console.log('Conectado ao MongoDB'))
//   .catch((err: any) => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas
app.use("/api/user", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/professional_availabilities", professionalAvailabilityRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/professionals", professionalRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/amenities", amenitiesRoutes);
app.use("/api/professional_amenities", professionalAmenityRoutes);

app.use("/api/email", emailRouter);
app.use("/auth", authRouter);

const isServerless = process.env.ENVIRONMENT !== "development";

if (!isServerless) {
  app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
  });
} else {
  console.log("Servidor rodando em ambiente serverless");
}

export default app;
