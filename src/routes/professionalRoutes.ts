import { Router } from "express";
import {
  createProfessional,
  getAllProfessionals,
  getProfessionalById,
  updateProfessional,
  deleteProfessional,
} from "../controllers/professionalController";

const router = Router();

router.post("/", createProfessional);
router.get("/", getAllProfessionals);
router.get("/:id", getProfessionalById);
router.put("/:id", updateProfessional);
router.delete("/:id", deleteProfessional);

export default router;
