import { Router } from "express";
import { confirmNumber } from "../controllers/confirmNumberController";
import { verifyCode } from "../controllers/confirmCodeController";
import { signUpUser } from "../controllers/user.controller";

const router = Router();

router.post("/register", signUpUser);
router.post("/confirm-number", confirmNumber);
router.post("/verify-code", verifyCode);

export default router;
