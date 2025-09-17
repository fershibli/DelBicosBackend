import { Router } from "express";
import { 
  createProfessionalGalleryImage, 
  getAllProfessionalGalleryImages, 
  getByIdProfessionalGalleryImage, 
  updateProfessionalGalleryImage, 
  deleteProfessionalGalleryImage 
} from "../controllers/professionalGallery.controller";

const router = Router();

router.post("/", createProfessionalGalleryImage);
router.get("/", getAllProfessionalGalleryImages);
router.get("/:id", getByIdProfessionalGalleryImage);
router.put("/:id", updateProfessionalGalleryImage);
router.delete("/:id", deleteProfessionalGalleryImage);

export default router;
