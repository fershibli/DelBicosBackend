import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
import userRoutes from "./src/routes/userRoutes";

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

console.log("Variáveis de ambiente carregadas com sucesso");
console.log("Ambiente:", process.env.ENVIRONMENT);

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// // Conectar ao MongoDB
// mongoose.connect(process.env.MONGO_URI as string, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// } as any)
//   .then(() => console.log('Conectado ao MongoDB'))
//   .catch((err: any) => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas
app.use("/api/user", userRoutes);

const isServerless = process.env.ENVIRONMENT !== "development";

if (!isServerless) {
  app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
  });
} else {
  console.log("Servidor rodando em ambiente serverless");
}

export default app;
