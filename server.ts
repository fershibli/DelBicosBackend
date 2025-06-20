import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes";
import userRoutes from "./src/routes/userRoutes";
import serviceRoutes from './src/routes/serviceRoutes';


// Carregar variáveis de ambiente
dotenv.config();

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
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use('/api/services', serviceRoutes);


// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
