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

    const verificationCode = generateVerificationCode();

    temporaryStorage[email] = {
      code: verificationCode,
      userData: req.body,
    };

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

    if (wasSent) {
      return res
        .status(200)
        .json({ message: "E-mail de verificação enviado com sucesso!" });
    } else {
      return res.status(500).json({ error: "Falha ao enviar o e-mail." });
    }
  },

  handleVerifyCode: async (req: Request, res: Response) => {
    const { email, code } = req.body;

    if (!email || !code) {
      return res
        .status(400)
        .json({ error: 'Campos "email" e "code" são obrigatórios.' });
    }

    const tempData = temporaryStorage[email];

    if (!tempData) {
      return res
        .status(404)
        .json({ error: "Dados de verificação não encontrados ou expirados." });
    }

    if (tempData.code !== code) {
      return res.status(400).json({ error: "Código de verificação inválido." });
    }

    // Posteriormente trocar esta parte para colocar no banco de dados
    const { userData } = tempData;

    delete temporaryStorage[email];

    return res
      .status(200)
      .json({ message: "Conta verificada com sucesso!", user: userData });
  },
};
