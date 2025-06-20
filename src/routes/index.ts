import { Router } from 'express';
import { IndexController } from '../controllers';
import serviceRoutes from './serviceRoutes';


const router = Router();
const indexController = new IndexController();

export function setRoutes(app: Router) {
    app.get('/', indexController.getIndex.bind(indexController));
    app.use('/services', serviceRoutes)
    // Add more routes here as needed
}

