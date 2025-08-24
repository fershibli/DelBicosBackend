import { Request, Response } from "express";
import { EmailService } from "../services/email.service";
import { generateVerificationCode } from "../utils/verification";

// ATENÇÃO: Armazenamento temporário em memória.
const temporaryStorage: { [email: string]: { code: string; userData: any } } =
  {};

export const AuthController = {
  handleRegister: async (req: Request, res: Response) => {
    const { name, email, password, surname, birthDate, cpf, location } =
      req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Campos "name", "email" e "password" são obrigatórios.',
      });
    }

    // (adicionar mais validações, como formato de e-mail, força da senha, etc.)

    // 2. Gerar o código de verificação
    const verificationCode = generateVerificationCode();
    console.log(`Código gerado para ${email}: ${verificationCode}`);

    // 3. Salvar os dados do usuário e o código temporariamente
    temporaryStorage[email] = {
      code: verificationCode,
      userData: req.body,
    };

    // 4. Preparar e enviar o e-mail
    const emailSubject = "Seu Código de Verificação";
    const emailHtml = `
      <h1>Olá, ${name}!</h1>
      <p>Obrigado por se cadastrar. Use o código abaixo para verificar sua conta:</p>
      <h2><strong>${verificationCode}</strong></h2>
      <p>Este código expira em 10 minutos.</p>
    `;

    const wasSent = await EmailService.sendTransactionalEmail({
      to: email,
      subject: emailSubject,
      html: emailHtml,
    });

    // 5. Responder ao frontend
    if (wasSent) {
      return res
        .status(200)
        .json({ message: "E-mail de verificação enviado com sucesso!" });
    } else {
      return res.status(500).json({ error: "Falha ao enviar o e-mail." });
    }
  },

  handleVerifyCode: async (req: Request, res: Response) => {
    // 1. Extrair e-mail e código do corpo da requisição
    const { email, code } = req.body;

    if (!email || !code) {
      return res
        .status(400)
        .json({ error: 'Campos "email" e "code" são obrigatórios.' });
    }

    // 2. Buscar os dados temporários
    const tempData = temporaryStorage[email];

    if (!tempData) {
      return res
        .status(404)
        .json({ error: "Dados de verificação não encontrados ou expirados." });
    }

    // 3. Comparar o código
    if (tempData.code !== code) {
      return res.status(400).json({ error: "Código de verificação inválido." });
    }

    // 4. SUCESSO! Finalizar o cadastro
    // Posteriormente trocar esta parte para colocar no banco de dados
    const { userData } = tempData;
    console.log(
      "Verificação bem-sucedida! Salvando usuário no banco de dados:",
      userData
    );

    // 5. Limpar os dados temporários após o sucesso
    delete temporaryStorage[email];

    // 6. Avaliar para mandar token JWT
    return res
      .status(200)
      .json({ message: "Conta verificada com sucesso!", user: userData });
  },
};
