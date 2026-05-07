"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const dotenv = __importStar(require("dotenv"));
const Appointment_1 = require("../models/Appointment");
const User_1 = require("../models/User");
const Client_1 = require("../models/Client");
const Notification_1 = require("../models/Notification");
const Service_1 = require("../models/Service");
dotenv.config();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey || !stripeSecretKey.startsWith("sk_")) {
    const errorMsg = "FATAL ERROR: STRIPE_SECRET_KEY não definida corretamente.";
    console.error(errorMsg);
    throw new Error(errorMsg);
}
const stripe = new stripe_1.default(stripeSecretKey, {
    // @ts-ignore: O tipo da API version pode estar estranho
    apiVersion: "2025-09-30.clover",
    typescript: true,
});
exports.PaymentService = {
    createPaymentIntent: (_a) => __awaiter(void 0, [_a], void 0, function* ({ amount, currency, metadata, }) {
        try {
            const paymentIntent = yield stripe.paymentIntents.create({
                amount: amount,
                currency: currency,
                automatic_payment_methods: {
                    enabled: true,
                },
                metadata: metadata,
            });
            if (!paymentIntent.client_secret) {
                console.error("[PaymentService] Erro crítico: PaymentIntent criado sem client_secret.", paymentIntent);
                throw new Error("Falha ao obter o identificador de pagamento do provedor.");
            }
            return paymentIntent.client_secret;
        }
        catch (error) {
            console.error("[PaymentService] Erro na API do Stripe ao criar Payment Intent:", error);
            throw new Error(`Erro ao iniciar o processo de pagamento: ${error.message || "Erro desconhecido do provedor de pagamento."}`);
        }
    }),
    confirmAndCreateAppointment: (paymentIntentId, authenticatedUserId) => __awaiter(void 0, void 0, void 0, function* () {
        let paymentIntent;
        try {
            paymentIntent = yield stripe.paymentIntents.retrieve(paymentIntentId);
        }
        catch (error) {
            console.error("[PaymentService] Erro ao buscar PaymentIntent no Stripe:", error.message);
            throw new Error(`Erro ao verificar pagamento: ${error.message}`);
        }
        if (paymentIntent.status !== "succeeded") {
            console.warn(`[PaymentService] Tentativa de confirmação de pagamento não sucedido (Status: ${paymentIntent.status})`);
            throw new Error("O pagamento não foi concluído com sucesso.");
        }
        const metadata = paymentIntent.metadata;
        const professionalId = metadata.professionalId;
        const serviceId = metadata.serviceId;
        const selectedTime = metadata.selectedTime;
        const addressId = metadata.addressId;
        if (!professionalId || !serviceId || !selectedTime || !addressId) {
            throw new Error("Dados do agendamento ausentes nos metadados do pagamento.");
        }
        const user = yield User_1.UserModel.findByPk(authenticatedUserId);
        if (!user) {
            throw new Error("Cliente (usuário) não encontrado.");
        }
        // TODO: Verifique se 'user.id' é o 'client_id' correto que o AppointmentModel espera.
        // Se você tem uma tabela 'clients' separada, você deve buscá-la aqui.
        // Ex: const client = await ClientModel.findOne({ where: { user_id: authenticatedUserId } });
        // const clientId = client.id;
        const clientId = user.id; // ASSUMINDO que o ID do usuário é o ID do cliente
        try {
            const newAppointment = yield Appointment_1.AppointmentModel.create({
                professional_id: Number(professionalId),
                client_id: clientId,
                service_id: Number(serviceId),
                address_id: Number(addressId),
                rating: undefined,
                review: undefined,
                start_time: new Date(selectedTime),
                end_time: new Date(selectedTime),
                status: "confirmed",
                payment_intent_id: paymentIntentId,
            });
            const service = yield Service_1.ServiceModel.findByPk(Number(serviceId));
            if (!service) {
                throw new Error("Serviço não encontrado.");
            }
            yield Notification_1.NotificationModel.create({
                user_id: clientId,
                title: "Agendamento Criado com Sucesso",
                message: `Seu agendamento para o serviço '${service.title}' no dia ${selectedTime} foi criado. Aguardando confirmação do profissional.`,
                notification_type: "appointment",
                related_entity_id: newAppointment.id,
                is_read: false,
            });
            return newAppointment;
        }
        catch (dbError) {
            console.error("[PaymentService] Erro ao salvar agendamento no DB:", dbError.message);
            try {
                yield stripe.refunds.create({ payment_intent: paymentIntentId });
            }
            catch (refundError) {
                console.error(`[PaymentService] FALHA CRÍTICA: Não foi possível criar o agendamento E não foi possível processar o reembolso. PI: ${paymentIntentId}`, refundError.message);
                // TODO: Adicionar lógica para notificar administradores (ex: Sentry, Log, Email)
            }
            throw new Error("Erro ao salvar o agendamento no banco de dados.");
        }
    }),
    getAppointmentReceipt: (appointmentId, authenticatedUserId) => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield Client_1.ClientModel.findOne({
            where: { user_id: authenticatedUserId },
        });
        if (!client) {
            throw new Error("Cliente não encontrado.");
        }
        const appointment = yield Appointment_1.AppointmentModel.findOne({
            where: {
                id: appointmentId,
                client_id: client.id,
            },
        });
        if (!appointment) {
            throw new Error("Agendamento não encontrado ou não pertence a este usuário.");
        }
        const paymentIntentId = appointment.payment_intent_id;
        if (!paymentIntentId) {
            throw new Error("Este agendamento não possui um recibo de pagamento online.");
        }
        try {
            const paymentIntent = yield stripe.paymentIntents.retrieve(paymentIntentId, {
                expand: ["latest_charge"],
            });
            const latestCharge = paymentIntent.latest_charge;
            const receiptUrl = latestCharge === null || latestCharge === void 0 ? void 0 : latestCharge.receipt_url;
            if (!receiptUrl) {
                console.warn(`[PaymentService] Não foi encontrado receipt_url. Status do PI: ${paymentIntent.status}, Status da Cobrança: ${latestCharge === null || latestCharge === void 0 ? void 0 : latestCharge.status}`);
                throw new Error("O recibo para este pagamento não está disponível.");
            }
            return receiptUrl;
        }
        catch (error) {
            console.error("[PaymentService] Erro ao buscar recibo no Stripe:", error.message);
            throw new Error(`Erro ao buscar recibo: ${error.message}`);
        }
    }),
};
