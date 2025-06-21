import { Router } from "express";
import {
  createAvailability,
  getAllAvailabilities,
  getAvailabilityById,
  updateAvailability,
  deleteAvailability,
} from "../controllers/professionalAvailabilityController";

const router = Router();

router.post("/", createAvailability);
router.get("/", getAllAvailabilities);
router.get("/:id", getAvailabilityById);
router.put("/:id", updateAvailability);
router.delete("/:id", deleteAvailability);

export default router;
