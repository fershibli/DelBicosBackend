import Stripe from "stripe";
// --- Mocking Explícito com jest.doMock ---

// 1. Defina a função mock principal PRIMEIRO
const mockPaymentIntentsCreate = jest.fn();

// 2. Use jest.doMock para substituir o módulo 'stripe' ANTES de qualquer importação
jest.doMock("stripe", () => {
  // Retorna o CONSTRUTOR mockado
  return jest.fn().mockImplementation(() => {
    // A INSTÂNCIA retornada pelo construtor
    return {
      paymentIntents: {
        create: mockPaymentIntentsCreate, // Aponta para a função mock definida fora
      },
    };
  });
});

// 3. Importe o SERVIÇO e o Stripe DEPOIS do doMock
//    Agora temos certeza que eles receberão a versão mockada.
let PaymentService: any;
let MockedStripe: jest.MockedClass<typeof Stripe>;

beforeAll(() => {
  // Usamos require aqui para garantir que o mock seja aplicado
  PaymentService = require("../payment.service").PaymentService;
  MockedStripe = require("stripe") as jest.MockedClass<typeof Stripe>;
});

// --- Fim do Mocking ---

describe("PaymentService", () => {
  beforeEach(() => {
    // Limpa a função mock e o construtor mock
    mockPaymentIntentsCreate.mockClear();
    MockedStripe.mockClear();
  });

  // --- Teste de SUCESSO ---
  it("should create a PaymentIntent and return a client_secret on success", async () => {
    // 1. Arrange
    const mockClientSecret = "pi_123_secret_456";
    const inputParams = {
      amount: 5000,
      currency: "brl",
      metadata: { orderId: "order_abc" },
    };

    mockPaymentIntentsCreate.mockResolvedValueOnce({
      id: "pi_123",
      client_secret: mockClientSecret,
    });

    // 2. Act
    const clientSecret = await PaymentService.createPaymentIntent(inputParams);

    // 3. Assert
    expect(MockedStripe).toHaveBeenCalledTimes(1); // Verifica se 'new Stripe()' foi chamado
    expect(mockPaymentIntentsCreate).toHaveBeenCalledTimes(1);
    expect(mockPaymentIntentsCreate).toHaveBeenCalledWith({
      amount: inputParams.amount,
      currency: inputParams.currency,
      automatic_payment_methods: { enabled: true },
      metadata: inputParams.metadata,
    });
    expect(clientSecret).toBe(mockClientSecret);
  });

  // --- Teste de ERRO ---
  it("should throw an error if Stripe API fails", async () => {
    // 1. Arrange
    const errorMessage = "Stripe API error";
    const inputParams = {
      amount: 1000,
      currency: "usd",
    };

    mockPaymentIntentsCreate.mockRejectedValueOnce(new Error(errorMessage));

    // 2. Act & Assert
    await expect(
      PaymentService.createPaymentIntent(inputParams)
    ).rejects.toThrow(
      `Erro ao iniciar o processo de pagamento: ${errorMessage}`
    );

    expect(MockedStripe).toHaveBeenCalledTimes(1);
    expect(mockPaymentIntentsCreate).toHaveBeenCalledTimes(1);
    expect(mockPaymentIntentsCreate).toHaveBeenCalledWith({
      amount: inputParams.amount,
      currency: inputParams.currency,
      automatic_payment_methods: { enabled: true },
      metadata: undefined,
    });
  });
});
