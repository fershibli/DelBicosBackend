import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { deleteLockById } from "../controllers/professionalAvailabilityLock.controller";

const router = Router();

// Mounted at: /api/availability-locks
router.delete("/:id", authMiddleware, deleteLockById);

export default router;
