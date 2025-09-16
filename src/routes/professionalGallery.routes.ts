import { Router } from "express";
import { GalleryController } from "../controllers/gallery.controller";

const router = Router();
const controller = new GalleryController();

router.post("/", controller.create);
router.get("/", controller.index);
router.get("/:id", controller.show);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
