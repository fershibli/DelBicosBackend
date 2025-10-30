import Stripe from "stripe";
import * as dotenv from "dotenv";
import { AppointmentModel, IAppointment } from "../models/Appointment";
import { UserModel } from "../models/User";
import { ClientModel } from "../models/Client";

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey || !stripeSecretKey.startsWith("sk_")) {
  const errorMsg = "FATAL ERROR: STRIPE_SECRET_KEY não definida corretamente.";
  console.error(errorMsg);
  throw new Error(errorMsg);
}

const stripe = new Stripe(stripeSecretKey, {
  // @ts-ignore: O tipo da API version pode estar estranho
  apiVersion: "2025-09-30.clover",
  typescript: true,
});

interface PaymentIntentParams {
  amount: number;
  currency: string;
  metadata?: { [key: string]: string | number | null };
}

export const PaymentService = {
  createPaymentIntent: async ({
    amount,
    currency,
    metadata,
  }: PaymentIntentParams): Promise<string> => {
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

  confirmAndCreateAppointment: async (
    paymentIntentId: string,
    authenticatedUserId: number
  ): Promise<IAppointment> => {
    let paymentIntent: Stripe.PaymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error: any) {
      console.error(
        "[PaymentService] Erro ao buscar PaymentIntent no Stripe:",
        error.message
      );
      throw new Error(`Erro ao verificar pagamento: ${error.message}`);
    }

    if (paymentIntent.status !== "succeeded") {
      console.warn(
        `[PaymentService] Tentativa de confirmação de pagamento não sucedido (Status: ${paymentIntent.status})`
      );
      throw new Error("O pagamento não foi concluído com sucesso.");
    }

    const metadata = paymentIntent.metadata;
    const professionalId = metadata.professionalId;
    const serviceId = metadata.serviceId;
    const selectedTime = metadata.selectedTime;
    const addressId = metadata.addressId;

    if (!professionalId || !serviceId || !selectedTime || !addressId) {
      throw new Error(
        "Dados do agendamento ausentes nos metadados do pagamento."
      );
    }

    const user = await UserModel.findByPk(authenticatedUserId);
    if (!user) {
      throw new Error("Cliente (usuário) não encontrado.");
    }
    // TODO: Verifique se 'user.id' é o 'client_id' correto que o AppointmentModel espera.
    // Se você tem uma tabela 'clients' separada, você deve buscá-la aqui.
    // Ex: const client = await ClientModel.findOne({ where: { user_id: authenticatedUserId } });
    // const clientId = client.id;
    const clientId = user.id; // ASSUMINDO que o ID do usuário é o ID do cliente

    try {
      const newAppointment = await AppointmentModel.create({
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
      return newAppointment;
    } catch (dbError: any) {
      console.error(
        "[PaymentService] Erro ao salvar agendamento no DB:",
        dbError.message
      );

      try {
        await stripe.refunds.create({ payment_intent: paymentIntentId });
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
    const client = await ClientModel.findOne({
      where: { user_id: authenticatedUserId },
    });
    if (!client) {
      throw new Error("Cliente não encontrado.");
    }

    const appointment = await AppointmentModel.findOne({
      where: {
        id: appointmentId,
        client_id: client.id,
      },
    });

    if (!appointment) {
      throw new Error(
        "Agendamento não encontrado ou não pertence a este usuário."
      );
    }

    const paymentIntentId = appointment.payment_intent_id;
    if (!paymentIntentId) {
      throw new Error(
        "Este agendamento não possui um recibo de pagamento online."
      );
    }

    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId,
        {
          expand: ["latest_charge"],
        }
      );

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
