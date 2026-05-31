import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
  listAvailability,
  getAvailability,
  createAvailability,
  updateAvailability,
  deleteAvailability,
} from "../controllers/professionalAvailability.controller";
import {
  validateCreateAvailability,
  validateUpdateAvailability,
} from "../middlewares/availability.validation";

const router = Router({ mergeParams: true });

/**
 * Rotas CRUD para disponibilidade do profissional
 * Mounted em: /professionals/:professionalId/availability
 */

router.get("/", authMiddleware, listAvailability);
router.get("/:id", authMiddleware, getAvailability);
router.post(
  "/",
  authMiddleware,
  validateCreateAvailability,
  createAvailability,
);
router.put(
  "/:id",
  authMiddleware,
  validateUpdateAvailability,
  updateAvailability,
);
router.delete("/:id", authMiddleware, deleteAvailability);

export default router;
