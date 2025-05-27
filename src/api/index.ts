import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from '../config/database';
import authRoutes from '../routes/authRoutes';
import userRoutes from '../routes/userRoutes';

dotenv.config();

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
// Rotas
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);

sequelize.sync({ force: false }).then(() => {
  console.log(`Banco de dados sincronizado em ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}.`);
}).catch((error) => {
  console.error('Erro ao sincronizar o banco de dados:', error);
});

app.use(cors({
  origin: 'http://localhost:19006', // Porta padrão do Expo Web
  methods: ['GET', 'POST', 'PUT'],
  credentials: true
}))

export default app;