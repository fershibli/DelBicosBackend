import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
  listServices,
  createService,
} from "../controllers/service.controller";
import {
  validateCreateService,
} from "../middlewares/service.validation";

const router = Router({ mergeParams: true });

// Mounted at: /professionals/:professionalId/services
router.get("/", listServices);
router.post("/", authMiddleware, validateCreateService, createService);

export default router;
