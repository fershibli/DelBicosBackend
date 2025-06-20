import { Router } from "express";
import { confirmNumber } from "../controllers/confirmNumberController";
import { verifyCode } from "../controllers/confirmCodeController";
import { register } from "../controllers/registerController";
import { signUpUser } from "../controllers/user.controller";

const router = Router();

router.post("/user/register", signUpUser);
router.post("/confirm-number", confirmNumber);
router.post("/verify-code", verifyCode);
router.post("/register", register);

export default router;
