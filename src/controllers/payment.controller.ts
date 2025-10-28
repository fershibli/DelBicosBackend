import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service"; // Importa o serviço testado

export const createPaymentIntentController = async (
  req: Request,
  res: Response
): Promise<void> => {
  // 1. Extrair 'amount' e 'currency' do corpo da requisição
  const { amount, currency } = req.body;

  // 2. Validação dos dados de entrada
  if (amount == null || typeof amount !== "number" || amount <= 0) {
    // Retorna erro 400 se o 'amount' for inválido
    res.status(400).json({
      error:
        'Parâmetro "amount" inválido ou ausente. Deve ser um número positivo representando o valor na unidade principal (ex: 50.00 para R$50,00).',
    });
    return;
  }
  if (!currency || typeof currency !== "string" || currency.length !== 3) {
    // Retorna erro 400 se a 'currency' for inválida
    res.status(400).json({
      error:
        'Parâmetro "currency" inválido ou ausente. Deve ser um código ISO de 3 letras (ex: "brl").',
    });
    return;
  }
  // Adicione aqui outras validações se necessário (ex: verificar se a moeda é suportada)

  // 3. Converter 'amount' para a menor unidade monetária (centavos)
  // Certifique-se de que a lógica de arredondamento está correta para evitar problemas com floats.
  const amountInCents = Math.round(amount * 100);

  // Opcional: Extrair metadados (ex: ID do pedido, ID do usuário) do corpo ou do usuário autenticado
  const metadata = {
    orderId: req.body.orderId || null, // Exemplo
    userId: (req as any).user?.id || null, // Exemplo se usar middleware de autenticação
  };

  try {
    // 4. Chamar o serviço com os dados processados
    const clientSecret = await PaymentService.createPaymentIntent({
      amount: amountInCents,
      currency: currency.toLowerCase(), // Garante minúsculas
      metadata: metadata, // Passa os metadados
    });

    // 5. Enviar a resposta de sucesso com o clientSecret
    res.status(200).json({ clientSecret });
  } catch (error: any) {
    // 6. Capturar erros vindos do serviço (incluindo erros do Stripe)
    console.error(
      "[PaymentController] Erro ao criar Payment Intent:",
      error.message
    );
    // Retorna um erro 500 genérico para o frontend, escondendo detalhes internos
    res.status(500).json({
      error: "Falha ao processar o pagamento. Por favor, tente novamente.",
    });
  }
};

// Adicione outros controllers relacionados a pagamento aqui, se necessário.
