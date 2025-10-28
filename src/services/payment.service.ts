import Stripe from "stripe";
import * as dotenv from "dotenv";

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Interface para os parâmetros esperados pela função
interface PaymentIntentParams {
  amount: number; // Valor OBRIGATORIAMENTE em centavos (ou menor unidade)
  currency: string; // Ex: 'brl', 'usd' (em minúsculas)
  // Opcional: Adicione outros dados relevantes que você queira associar ao pagamento
  metadata?: { [key: string]: string | number | null };
  // customerId?: string; // Se você gerencia clientes no Stripe
}

export const PaymentService = {
  /**
   * Cria uma Intenção de Pagamento (Payment Intent) no Stripe.
   * @param params - Objeto contendo amount (em centavos) e currency.
   * @returns O client_secret do PaymentIntent criado.
   * @throws Lança um erro se a criação no Stripe falhar.
   */
  createPaymentIntent: async ({
    amount,
    currency,
    metadata,
  }: PaymentIntentParams): Promise<string> => {
    if (!stripeSecretKey || !stripeSecretKey.startsWith("sk_")) {
      const errorMsg =
        "FATAL ERROR: STRIPE_SECRET_KEY não definida corretamente.";
      console.error(errorMsg);
      throw new Error(errorMsg); // Lança o erro para ser pego pelo catch abaixo ou pelo controller
    }

    // Inicializa o cliente Stripe
    // Definimos a versão da API para garantir consistência. Verifique a versão mais recente na documentação do Stripe se desejar.
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-09-30.clover", // Versão atual da API Stripe no momento da escrita
      typescript: true, // Habilita checagem de tipos aprimorada se usar TS com Stripe
    });

    console.log(
      `[PaymentService] Criando Payment Intent: Amount=${amount}, Currency=${currency}`
    ); // Log para debug
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        // Configuração recomendada para o PaymentElement (frontend web/mobile)
        automatic_payment_methods: {
          enabled: true,
        },
        // Adiciona metadados (opcional, mas útil para rastreamento)
        metadata: metadata,
        // customer: customerId, // Se aplicável
      });

      // Validação do client_secret
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
};
