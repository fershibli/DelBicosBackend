import Stripe from "stripe";
import * as dotenv from "dotenv";
import { AppointmentModel, IAppointment } from "../models/Appointment";
import { UserModel } from "../models/User";
import { ClientModel } from "../models/Client";

dotenv.config();

// --- 1. CONFIGURAÇÃO E INICIALIZAÇÃO DO STRIPE (Movido para o Topo) ---
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey || !stripeSecretKey.startsWith("sk_")) {
  const errorMsg = "FATAL ERROR: STRIPE_SECRET_KEY não definida corretamente.";
  console.error(errorMsg);
  throw new Error(errorMsg);
}

// Inicializa o cliente Stripe UMA VEZ para ser usado por todo o serviço
const stripe = new Stripe(stripeSecretKey, {
  // @ts-ignore: O tipo da API version pode estar estranho
  apiVersion: "2025-09-30.clover", // Mantendo a versão que você corrigiu
  typescript: true,
});
// --- FIM DA INICIALIZAÇÃO ---

// Interface para os parâmetros de criação
interface PaymentIntentParams {
  amount: number; // Em centavos
  currency: string;
  metadata?: { [key: string]: string | number | null };
}

export const PaymentService = {
  // --- FUNÇÃO 1: CRIAR O PAGAMENTO (Seu código existente, levemente ajustado) ---
  createPaymentIntent: async ({
    amount,
    currency,
    metadata,
  }: PaymentIntentParams): Promise<string> => {
    // Removemos a inicialização do Stripe daqui, pois ela agora é global

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: metadata,
      });

      if (!paymentIntent.client_secret) {
        console.error(
          "[PaymentService] Erro crítico: PaymentIntent criado sem client_secret.",
          paymentIntent
        );
        throw new Error(
          "Falha ao obter o identificador de pagamento do provedor."
        );
      }

      console.log(
        `[PaymentService] Payment Intent criado com sucesso. ID: ${paymentIntent.id}`
      );
      return paymentIntent.client_secret;
    } catch (error: any) {
      console.error(
        "[PaymentService] Erro na API do Stripe ao criar Payment Intent:",
        error
      );
      throw new Error(
        `Erro ao iniciar o processo de pagamento: ${
          error.message || "Erro desconhecido do provedor de pagamento."
        }`
      );
    }
  },

  // --- FUNÇÃO 2: CONFIRMAR PAGAMENTO E CRIAR AGENDAMENTO (Nova) ---
  confirmAndCreateAppointment: async (
    paymentIntentId: string,
    authenticatedUserId: number // ID do usuário logado (vem do middleware)
  ): Promise<IAppointment> => {
    console.log(
      `[PaymentService] Confirmando PaymentIntent ID: ${paymentIntentId} para User ID: ${authenticatedUserId}`
    );

    // 1. Busque o PaymentIntent no Stripe (Verificação de Segurança)
    let paymentIntent: Stripe.PaymentIntent;
    try {
      // Usamos a instância 'stripe' global
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error: any) {
      console.error(
        "[PaymentService] Erro ao buscar PaymentIntent no Stripe:",
        error.message
      );
      throw new Error(`Erro ao verificar pagamento: ${error.message}`);
    }

    // 2. Verifique o Status do Pagamento
    if (paymentIntent.status !== "succeeded") {
      console.warn(
        `[PaymentService] Tentativa de confirmação de pagamento não sucedido (Status: ${paymentIntent.status})`
      );
      throw new Error("O pagamento não foi concluído com sucesso.");
    }

    // 3. Extraia os Metadados
    const metadata = paymentIntent.metadata;
    const professionalId = metadata.professionalId;
    const serviceId = metadata.serviceId;
    const selectedTime = metadata.selectedTime;
    const addressId = metadata.addressId;

    if (!professionalId || !serviceId || !selectedTime || !addressId) {
      console.error(
        "[PaymentService] Metadados incompletos no PaymentIntent:",
        metadata
      );
      throw new Error(
        "Dados do agendamento ausentes nos metadados do pagamento."
      );
    }

    // 4. Encontre o `client_id` real baseado no `user_id` autenticado
    // (Ajuste esta lógica se 'UserModel' não tiver a FK 'client_id' direta)
    const user = await UserModel.findByPk(authenticatedUserId);
    if (!user) {
      throw new Error("Cliente (usuário) não encontrado.");
    }
    // TODO: Verifique se 'user.id' é o 'client_id' correto que o AppointmentModel espera.
    // Se você tem uma tabela 'clients' separada, você deve buscá-la aqui.
    // Ex: const client = await ClientModel.findOne({ where: { user_id: authenticatedUserId } });
    // const clientId = client.id;
    const clientId = user.id; // ASSUMINDO que o ID do usuário é o ID do cliente

    // 5. Crie o Agendamento no Banco de Dados
    try {
      const newAppointment = await AppointmentModel.create({
        professional_id: Number(professionalId),
        client_id: clientId,
        service_id: Number(serviceId),
        address_id: Number(addressId), // Usando o addressId dos metadados
        rating: undefined,
        review: undefined,
        start_time: new Date(selectedTime), // Converte a string ISO para Data
        end_time: new Date(selectedTime), // TODO: Calcule a hora final (start_time + service.duration)
        status: "confirmed",
        payment_intent_id: paymentIntentId,
      });
      return newAppointment;
    } catch (dbError: any) {
      console.error(
        "[PaymentService] Erro ao salvar agendamento no DB:",
        dbError.message
      );

      // Lógica de Reembolso: Se o agendamento falhar, o pagamento deve ser reembolsado.
      try {
        await stripe.refunds.create({ payment_intent: paymentIntentId });
        console.log(
          `[PaymentService] Reembolso do ${paymentIntentId} processado com sucesso.`
        );
      } catch (refundError: any) {
        console.error(
          `[PaymentService] FALHA CRÍTICA: Não foi possível criar o agendamento E não foi possível processar o reembolso. PI: ${paymentIntentId}`,
          refundError.message
        );
        // TODO: Adicionar lógica para notificar administradores (ex: Sentry, Log, Email)
      }
      throw new Error("Erro ao salvar o agendamento no banco de dados.");
    }
  },
  getAppointmentReceipt: async (
    appointmentId: number,
    authenticatedUserId: number
  ): Promise<string> => {
    // 1. Encontre o client_id (baseado no seu código do appointment.controller)
    const client = await ClientModel.findOne({
      where: { user_id: authenticatedUserId },
    });
    if (!client) {
      throw new Error("Cliente não encontrado.");
    }

    // 2. Busque o agendamento no nosso DB
    const appointment = await AppointmentModel.findOne({
      where: {
        id: appointmentId,
        client_id: client.id, // Garante que o usuário só possa ver o seu
      },
    });

    if (!appointment) {
      throw new Error(
        "Agendamento não encontrado ou não pertence a este usuário."
      );
    }

    // 3. Verifique se há um ID de pagamento
    const paymentIntentId = appointment.payment_intent_id;
    if (!paymentIntentId) {
      throw new Error(
        "Este agendamento não possui um recibo de pagamento online."
      );
    }

    // 4. Busque o PaymentIntent no Stripe
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId,
        {
          expand: ["latest_charge"],
        }
      );

      // 5. Extraia a URL do recibo
      const latestCharge = paymentIntent.latest_charge as Stripe.Charge;

      const receiptUrl = latestCharge?.receipt_url;

      if (!receiptUrl) {
        console.warn(
          `[PaymentService] Não foi encontrado receipt_url. Status do PI: ${paymentIntent.status}, Status da Cobrança: ${latestCharge?.status}`
        );
        throw new Error("O recibo para este pagamento não está disponível.");
      }

      return receiptUrl;
    } catch (error: any) {
      console.error(
        "[PaymentService] Erro ao buscar recibo no Stripe:",
        error.message
      );
      throw new Error(`Erro ao buscar recibo: ${error.message}`);
    }
  },
};
