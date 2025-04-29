import express from 'express';
import { setRoutes } from '../routes';
import { sequelize } from '../config/database';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

setRoutes(app);

sequelize.authenticate()
    .then(() => {
        console.log('Database connection established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;