import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/register", AuthController.handleRegister);
authRouter.post("/verify", AuthController.handleVerifyCode);
authRouter.post("/resend", AuthController.handleResendCode);

export default authRouter;
