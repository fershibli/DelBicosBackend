import { Router } from "express";
import {
  createProfessionalAmenity,
  deleteProfessionalAmenity,
  getAllProfessionalAmenities,
  getProfessionalAmenityById,
} from "../controllers/professionalAmenityController";

const router = Router();

router.post("/", createProfessionalAmenity);
router.get("/", getAllProfessionalAmenities);
router.get("/:id", getProfessionalAmenityById);
router.delete("/:id", deleteProfessionalAmenity);

export default router;
