import { Router } from 'express';
import { IndexController } from '../controllers';
import serviceRoutes from './serviceRoutes';
import subcategoryRoutes from "./subcategoryRoutes";



const router = Router();
const indexController = new IndexController();

export function setRoutes(app: Router) {
    app.get('/', indexController.getIndex.bind(indexController));
    app.use('/services', serviceRoutes)
    app.use('/subcategories', subcategoryRoutes);
    // Add more routes here as needed
}

