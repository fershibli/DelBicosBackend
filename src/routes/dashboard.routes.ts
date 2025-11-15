import { Router } from "express";
import { getDashboardKpis, getEarningsOverTime, getServicesByCategory } from "../controllers/DashboardController";
import auth from "../middlewares/auth.middleware";

const router = Router();

router.get("/kpis", auth, getDashboardKpis);
router.get("/earnings-over-time", auth, getEarningsOverTime);
router.get("/services-by-category", auth, getServicesByCategory);

export default router;
