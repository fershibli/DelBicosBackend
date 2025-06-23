import { Router } from "express";
import { AmenitiesController } from "../controllers/amenities.controller";

const router = Router();
const controller = new AmenitiesController();

router.post("/", controller.create);
router.get("/", controller.index);
router.get("/:id", controller.show);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
