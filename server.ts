import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import swaggerOptions from './src/config/swagger';
import authRoutes from "./src/routes/authRoutes";
import * as dotenv from "dotenv";
import userRoutes from "./src/routes/userRoutes";
import addressRoutes from "./src/routes/addressRoutes";
import serviceRoutes from './src/routes/serviceRoutes';
import categoryRoutes from "./src/routes/categoryRoutes";
import subcategoryRoutes from "./src/routes/subcategoryRoutes";
import professionalRoutes from "./src/routes/professionalRoutes";
import clientsRoutes from "./src/routes/clientRoutes";
import professionalAvailabilityRoutes from "./src/routes/professionalAvailabilityRoutes";
import appointmentRoutes from "./src/routes/appointmentRoutes";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';


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
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// // Conectar ao MongoDB
// mongoose.connect(process.env.MONGO_URI as string, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// } as any)
//   .then(() => console.log('Conectado ao MongoDB'))
//   .catch((err: any) => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas
app.use("/api/user", userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/professional_availabilities', professionalAvailabilityRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use('/api/professionals', professionalRoutes);


const isServerless = process.env.ENVIRONMENT !== "development";

if (!isServerless) {
  app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
  });
} else {
  console.log("Servidor rodando em ambiente serverless");
}

export default app;
