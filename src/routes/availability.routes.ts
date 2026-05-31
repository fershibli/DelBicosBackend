import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
  getAvailabilityById,
  updateAvailabilityById,
  deleteAvailabilityById,
} from "../controllers/professionalAvailability.controller";
import { validateUpdateAvailability } from "../middlewares/availability.validation";

const router = Router();

// Mounted at: /api/availabilities
router.get("/:id", authMiddleware, getAvailabilityById);
router.put("/:id", authMiddleware, validateUpdateAvailability, updateAvailabilityById);
router.delete("/:id", authMiddleware, deleteAvailabilityById);

export default router;
