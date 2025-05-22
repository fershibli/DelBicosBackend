import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

// Carregar variáveis de ambiente
dotenv.config();

// Definir o fuso horário de São Paulo (-03:00)
const timeZone = 'America/Sao_Paulo';
const currentDateTime = toZonedTime(new Date(), timeZone);
const formattedDateTime = format(currentDateTime, "yyyy-MM-dd 'at' HH:mm:ss 'BRT'");

// Configurar a conexão com o banco de dados
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        timezone: timeZone,
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    })
  : new Sequelize('delbicos', 'username', 'password', {
      host: 'localhost',
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        timezone: timeZone,
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });

// Função para conectar ao banco de dados
export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Connection to the database has been established successfully at ${formattedDateTime}.`);
  } catch (error) {
    console.error(`Unable to connect to the database at ${formattedDateTime}:`, error);
    process.exit(1); // Encerrar o processo em caso de falha na conexão
  }
};

// Executar a conexão ao carregar o arquivo
connectDatabase();

export default sequelize;