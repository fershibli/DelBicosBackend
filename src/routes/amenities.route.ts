import { Router } from "express";
import { 
  createAmenity, 
  getAllAmenities, 
  getByIdAmenity, 
  updateAmenity, 
  deleteAmenity 
} from "../controllers/amenities.controller";

const router = Router();

router.post("/", createAmenity);
router.get("/", getAllAmenities);
router.get("/:id", getByIdAmenity);
router.put("/:id", updateAmenity);
router.delete("/:id", deleteAmenity);

export default router;
