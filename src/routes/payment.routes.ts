import { Router } from "express";
import { createPaymentIntentController } from "../controllers/payment.controller";
// Opcional: Importe seu middleware de autenticação se esta rota precisar ser protegida
// import authMiddleware from '../middlewares/auth.middleware';

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
  // Se você descomentar a linha abaixo, apenas usuários autenticados poderão criar pagamentos.
  // authMiddleware,
  createPaymentIntentController // Liga a rota ao controller que criamos
);

/*
 * Outras rotas relacionadas a pagamento podem ser adicionadas aqui no futuro:
 *
 * Exemplo: Rota para receber Webhooks do Stripe (altamente recomendado para produção)
 * paymentRouter.post('/webhook', express.raw({type: 'application/json'}), handleStripeWebhookController);
 *
 * Exemplo: Rota para buscar o status de um pagamento
 * paymentRouter.get('/payment-status/:paymentIntentId', authMiddleware, getPaymentStatusController);
 */

// Exporta o router para ser usado no server.ts
export default paymentRouter;
