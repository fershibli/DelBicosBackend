import { Router } from "express";
import {
  createAddress,
  getAllAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController";

const router = Router();

router.post("/", createAddress);
router.get("/", getAllAddresses);
router.get("/:id", getAddressById);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);

export default router;
