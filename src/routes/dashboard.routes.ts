import { Router } from "express";
import DashboardController from "../controllers/DashboardController";
import auth from "../middlewares/auth.middleware";

const router = Router();

router.get("/kpis", auth, DashboardController.getKpis);
router.get("/earnings-over-time", auth, DashboardController.getEarningsOverTime);
router.get("/services-by-category", auth, DashboardController.getServicesByCategory);

export default router;
