import { Router } from 'express';
import { IndexController } from '../controllers';
import userRoutes from './userRoutes';
import serviceRoutes from './serviceRoutes';
import categoryRoutes from "./categoryRoutes";
import subcategoryRoutes from "./subcategoryRoutes";
import addressRoutes from "./addressRoutes";
import professionalRoutes from "./professionalRoutes";
import clientsRoutes from "./clientRoutes";
import professionalAvailabilityRoutes from "./professionalAvailabilityRoutes";
import appointmentRoutes from "./appointmentRoutes";



const router = Router();
const indexController = new IndexController();

export function setRoutes(app: Router) {
    app.get('/', indexController.getIndex.bind(indexController));
    app.use('/services', serviceRoutes);
    app.use('/categories', categoryRoutes);
    app.use('/subcategories', subcategoryRoutes);
    app.use('/user', userRoutes);
    app.use('/address', addressRoutes);
    app.use('/clients', clientsRoutes);
    app.use("/professional_availabilities", professionalAvailabilityRoutes);
    app.use("/appointments", appointmentRoutes);
    app.use('/professionals', professionalRoutes);
    // Add more routes here as needed
}

