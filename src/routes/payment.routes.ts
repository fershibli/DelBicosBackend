import { Router } from "express";
import {
  createPaymentIntentController,
  confirmPaymentController,
} from "../controllers/payment.controller";
import authMiddleware from "../middlewares/auth.middleware";

// Cria uma nova instância do Router do Express
const paymentRouter = Router();

/**
 * @route   POST /api/payments/create-payment-intent
 * @desc    Cria uma Intenção de Pagamento (Payment Intent) no Stripe
 * @access  Private (ou Public, dependendo da sua necessidade)
 * @body    { amount: number, currency: string, [outrosDados]: any }
 */
paymentRouter.post(
  "/create-payment-intent",
  authMiddleware,
  createPaymentIntentController // Liga a rota ao controller que criamos
);

/**
 * @route   POST /api/payments/confirm
 * @desc    Confirma um pagamento bem-sucedido e cria o agendamento no DB
 * @access  Private (Obrigatório!)
 */
paymentRouter.post(
  "/confirm",
  authMiddleware,
  confirmPaymentController // 4. Ligue ao novo controller
);

// Exporta o router para ser usado no server.ts
export default paymentRouter;
