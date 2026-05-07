"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
// Cria uma nova instância do Router do Express
const paymentRouter = (0, express_1.Router)();
/**
 * @route   POST /api/payments/create-payment-intent
 * @desc    Cria uma Intenção de Pagamento (Payment Intent) no Stripe
 * @access  Private (ou Public, dependendo da sua necessidade)
 * @body    { amount: number, currency: string, [outrosDados]: any }
 */
paymentRouter.post("/create-payment-intent", auth_middleware_1.default, payment_controller_1.createPaymentIntentController // Liga a rota ao controller que criamos
);
/**
 * @route   POST /api/payments/confirm
 * @desc    Confirma um pagamento bem-sucedido e cria o agendamento no DB
 * @access  Private (Obrigatório!)
 */
paymentRouter.post("/confirm", auth_middleware_1.default, payment_controller_1.confirmPaymentController // 4. Ligue ao novo controller
);
// Exporta o router para ser usado no server.ts
exports.default = paymentRouter;
