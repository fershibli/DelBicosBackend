"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const authRouter = (0, express_1.Router)();
authRouter.post("/register", auth_controller_1.AuthController.handleRegister);
authRouter.post("/verify", auth_controller_1.AuthController.handleVerifyCode);
authRouter.post("/resend", auth_controller_1.AuthController.handleResendCode);
exports.default = authRouter;
