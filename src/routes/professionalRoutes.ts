import express from "express";
import {
  getProfessionals,
  createProfessional,
  updateProfessional,
  deleteProfessional,
} from "../controllers/professionalController";

const router = express.Router();

router.get("/professionals", getProfessionals);
router.post("/professionals", createProfessional);
router.put("/professionals/:id", updateProfessional);
router.delete("/professionals/:id", deleteProfessional);

export default router;
