import { Request, Response } from "express";
import { EmailService } from "../services/email.service";
import { generateVerificationCode } from "../utils/verification";
import bcrypt from "bcryptjs";
import { sequelize } from "../config/database";
import { UserModel } from "../models/User";
import { ClientModel } from "../models/Client";
import { generateTokenAndUserPayload } from "../utils/authUtils";

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

    try {
      const existingUser = await UserModel.findOne({ where: { email } });
      if (existingUser) {
        return res
          .status(409)
          .json({ error: "Este e-mail já está cadastrado." });
      }
      const existingClient = await ClientModel.findOne({ where: { cpf } });
      if (existingClient) {
        return res.status(409).json({ error: "Este CPF já está cadastrado." });
      }
    } catch (error) {
      return res.status(500).json({ error: "Erro ao verificar usuário." });
    }

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

    const { userData } = tempData;
    const t = await sequelize.transaction();

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const newUser = await UserModel.create(
        {
          name: `${userData.name} ${userData.surname}`,
          email: userData.email,
          phone: userData.phone,
          password: hashedPassword,
          active: true,
          avatar_uri: undefined,
          banner_uri: undefined,
        },
        { transaction: t }
      );

      // 2. Crie o Endereço (ATENÇÃO: O RegisterScreen não coleta endereço completo)
      // O 'location' (ex: "Sorocaba, SP") do formulário não é um endereço completo.
      // Vamos assumir que 'main_address_id' em ClientModel pode ser nulo.
      // O usuário terá que cadastrar o endereço no Perfil.
      // const newAddress = await AddressModel.create({ ... }, { transaction: t });

      const newClient = await ClientModel.create(
        {
          user_id: newUser.id,
          cpf: userData.cpf,
          main_address_id: undefined,
        },
        { transaction: t }
      );

      await t.commit();

      delete temporaryStorage[email];

      const { token, user: userPayload } = generateTokenAndUserPayload(
        newUser,
        newClient,
        null
      );

      return res.status(200).json({
        message: "Conta verificada e usuário criado com sucesso!",
        token: token,
        user: userPayload,
      });
    } catch (error: any) {
      await t.rollback();
      console.error("Erro ao criar usuário após verificação:", error);
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({ error: "E-mail ou CPF já cadastrado." });
      }
      return res.status(500).json({
        error: "Falha ao salvar usuário no banco de dados.",
        details: error.message,
      });
    }
  },
};
