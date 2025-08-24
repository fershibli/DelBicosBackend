import { Router } from "express";
import { EmailController } from "../controllers/email.controller";

const emailRouter = Router();

// Exemplo de rota de teste para disparar um e-mail
emailRouter.post("/send-test-email", EmailController.handleSendTestEmail);

export default emailRouter;
