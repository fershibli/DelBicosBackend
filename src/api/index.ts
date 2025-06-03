import express from 'express';
import { setRoutes } from '../routes';
import { connectDatabase, sequelize } from '../config/database';
import { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

setRoutes(app);

const startServer = async () => {
    try {
        await connectDatabase();
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log('Database connection established successfully.');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

export interface CustomRequest<T> extends Request {
    body: T;
}
  
export interface CustomResponse extends Response {
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