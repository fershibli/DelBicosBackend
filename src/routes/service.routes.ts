import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
  getService,
  updateService,
  deleteService,
  listAllServices,
} from "../controllers/service.controller";
import { validateUpdateService } from "../middlewares/service.validation";

const router = Router();

// Mounted at: /api/services
router.get("/", listAllServices);
router.get("/:id", getService);
router.put("/:id", authMiddleware, validateUpdateService, updateService);
router.delete("/:id", authMiddleware, deleteService);

export default router;
