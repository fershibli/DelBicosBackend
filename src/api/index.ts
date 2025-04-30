import express from 'express';
import { setRoutes } from '../routes';
import { sequelize } from '../config/database';
import { Request } from 'express';
import { Response } from 'express';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

setRoutes(app);

sequelize.authenticate()
    .then(() => {
        console.log('Database connection established successfully.');
    })
    .catch(err=> {
        console.error('Unable to connect to the database:', err);
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export interface CustomRequest<T> extends Omit<Request, 'body'> {
    body: T;
}
  
  export interface CustomResponse extends Response {
    // Pode adicionar propriedades customizadas se necessário
  }
  
  export interface User {
    phoneNumber: string;
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    gender?: string;
    location?: string;
    email?: string;
    password?: string;
  }

export default app;