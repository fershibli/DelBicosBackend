import { Router } from "express";
import { AvailabilityController } from "../controllers/professionalAvailability.controller";

const router = Router({ mergeParams: true });
const controller = new AvailabilityController();

router.get("/:professionalId/availability", controller.getAvailability);
router.put("/:professionalId/availability", controller.updateAvailability);

export default router;