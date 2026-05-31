import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
  listLocks,
  createLock,
} from "../controllers/professionalAvailabilityLock.controller";
import { validateCreateLock } from "../middlewares/availabilityLock.validation";

const router = Router({ mergeParams: true });

// Mounted at: /professionals/:professionalId/availability-locks
router.get("/", authMiddleware, listLocks);
router.post("/", authMiddleware, validateCreateLock, createLock);

export default router;
