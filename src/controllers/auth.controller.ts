import { Request, Response } from "express";
import { EmailService } from "../services/email.service";
import { generateVerificationCode } from "../utils/verification";
import bcrypt from "bcryptjs";
import { sequelize } from "../config/database";
import { UserModel } from "../models/User";
import { ClientModel } from "../models/Client";
import { AddressModel } from "../models/Address";
import { NotificationModel } from "../models/Notification";
import { generateTokenAndUserPayload } from "../utils/authUtils";
import logger, { logAuth, logError } from "../utils/logger";
import { saveLoginLog } from "../services/loginLog.service";

interface ActiveCode {
  value: string;
  expiresAt: number;
}

interface TempData {
  codes: ActiveCode[];
  userData: any;
}

const EXPIRATION_TIME_MS = 10 * 60 * 1000;

const temporaryStorage: { [email: string]: TempData } = {};
export const AuthController = {
  handleRegister: async (req: Request, res: Response) => {
    const { name, email, password, surname, birthDate, cpf, address } =
      req.body;

    if (!name || !email || !password || !cpf) {
      return res.status(400).json({
        error: "Campos obrigatórios ausentes (nome, email, senha, cpf).",
      });
    }

    if (
      !address ||
      !address.postal_code ||
      !address.street ||
      !address.number
    ) {
      return res.status(400).json({
        error: "Endereço incompleto. CEP, Rua e Número são obrigatórios.",
      });
    }

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
      console.error("Erro na validação de existência:", error);
      return res.status(500).json({ error: "Erro ao verificar usuário." });
    }

    const verificationCode = generateVerificationCode();

    temporaryStorage[email] = {
      codes: [
        {
          value: verificationCode,
          expiresAt: Date.now() + EXPIRATION_TIME_MS,
        },
      ],
      userData: req.body,
    };

    const emailSubject = "Seu Código de Verificação";
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verificação de E-mail</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f7fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center" style="padding: 40px 0;">
              
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                
                <tr>
                  <td bgcolor="#003366" align="center" style="padding: 30px 0;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px;">
                      del<span style="color: #FC8200;">Bicos</span>
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #333333; margin-top: 0; font-size: 22px;">Olá, ${name}! 👋</h2>
                    
                    <p style="color: #666666; font-size: 16px; line-height: 1.5;">
                      Seja muito bem-vindo(a) ao <strong>DelBicos</strong>. Estamos felizes em ter você conosco!
                    </p>
                    
                    <p style="color: #666666; font-size: 16px; line-height: 1.5;">
                      Para garantir a segurança da sua conta e concluir seu cadastro, utilize o código abaixo:
                    </p>

                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <div style="background-color: #FFF5EB; border: 2px dashed #FC8200; border-radius: 8px; padding: 15px 30px; display: inline-block;">
                            <span style="font-size: 32px; font-weight: bold; color: #FC8200; letter-spacing: 8px; font-family: monospace;">
                              ${verificationCode}
                            </span>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <p style="color: #999999; font-size: 14px; text-align: center;">
                      ⚠️ Este código expira em <strong>10 minutos</strong>.
                    </p>
                    
                    <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
                    
                    <p style="color: #666666; font-size: 14px; line-height: 1.5;">
                      Se você não solicitou este código, por favor ignore este e-mail. Nenhuma ação é necessária.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td bgcolor="#f8f9fa" style="padding: 20px 30px; text-align: center;">
                    <p style="color: #999999; font-size: 12px; margin: 0;">
                      © ${new Date().getFullYear()} DelBicos - Delivery de Serviços.<br>
                      Todos os direitos reservados.
                    </p>
                  </td>
                </tr>

              </table>
              
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-top: 20px;">
                    <p style="color: #bbbbbb; font-size: 12px;">
                      Enviado automaticamente pelo sistema DelBicos.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const wasSent = await EmailService.sendTransactionalEmail({
      to: email,
      subject: emailSubject,
      html: emailHtml,
    });

    if (wasSent) {
      logger.info("E-mail de verificação enviado", { email });
      return res
        .status(200)
        .json({ message: "E-mail de verificação enviado com sucesso!" });
    } else {
      logger.error("Falha ao enviar e-mail de verificação", { email });
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

    const receivedCode = String(code || "").trim();
    const now = Date.now();

    const isValidCode = tempData.codes.some(
      (c) => c.value === receivedCode && c.expiresAt > now
    );

    if (!isValidCode) {
      return res.status(400).json({ error: "Código inválido ou expirado." });
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
        },
        { transaction: t }
      );

      const newAddress = await AddressModel.create(
        {
          user_id: newUser.id,
          postal_code: userData.address.postal_code.replace(/\D/g, ""),
          street: userData.address.street,
          number: userData.address.number,
          complement: userData.address.complement,
          neighborhood: userData.address.neighborhood,
          city: userData.address.city,
          state: userData.address.state,
          country_iso: userData.address.country_iso || "BR",
          lat: 0,
          lng: 0,
          active: true,
        },
        { transaction: t }
      );

      const newClient = await ClientModel.create(
        {
          user_id: newUser.id,
          cpf: userData.cpf,
          main_address_id: newAddress.id,
        },
        { transaction: t }
      );

      await t.commit();

      delete temporaryStorage[email];

      await NotificationModel.create({
        user_id: newUser.id,
        title: "Bem-vindo ao DelBicos!",
        message: "Sua conta foi criada com sucesso. Aproveite nossos serviços!",
        is_read: false,
        notification_type: "system",
      });

      const { token, user: userPayload } = generateTokenAndUserPayload(
        newUser,
        newClient,
        newAddress
      );

      // Salva log de login no MongoDB (fire-and-forget, não bloqueia a resposta)
      saveLoginLog(req, {
        userId: newUser.id,
        username: newUser.email,
        jwt: token,
      });

      return res.status(200).json({
        message: "Conta verificada e usuário criado com sucesso!",
        token: token,
        user: userPayload,
      });
    } catch (error: any) {
      await t.rollback();
      logError("Erro ao criar usuário após verificação", error, { email });
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({ error: "E-mail ou CPF já cadastrado." });
      }

      return res.status(500).json({
        error: "Falha ao salvar usuário no banco de dados.",
        details: error.message,
      });
    }
  },

  handleResendCode: async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "E-mail é obrigatório." });
    }

    const tempData = temporaryStorage[email];

    if (!tempData) {
      return res.status(404).json({
        error: "Sessão de cadastro expirada. Por favor, cadastre-se novamente.",
        code: "SESSION_EXPIRED",
      });
    }

    try {
      const newVerificationCode = generateVerificationCode();

      tempData.codes.push({
        value: newVerificationCode,
        expiresAt: Date.now() + EXPIRATION_TIME_MS,
      });

      tempData.codes = tempData.codes.filter((c) => c.expiresAt > Date.now());

      const { userData } = tempData;
      const name = userData.name;
      const emailSubject = "Novo Código de Verificação - DelBicos";

      const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verificação de E-mail</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f7fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center" style="padding: 40px 0;">
              
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                
                <tr>
                  <td bgcolor="#003366" align="center" style="padding: 30px 0;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px;">
                      del<span style="color: #FC8200;">Bicos</span>
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #333333; margin-top: 0; font-size: 22px;">Olá, ${name}! 👋</h2>
                    
                    <p style="color: #666666; font-size: 16px; line-height: 1.5;">
                      Seja muito bem-vindo(a) ao <strong>DelBicos</strong>. Estamos felizes em ter você conosco!
                    </p>
                    
                    <p style="color: #666666; font-size: 16px; line-height: 1.5;">
                      Para garantir a segurança da sua conta e concluir seu cadastro, utilize o código abaixo:
                    </p>

                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <div style="background-color: #FFF5EB; border: 2px dashed #FC8200; border-radius: 8px; padding: 15px 30px; display: inline-block;">
                            <span style="font-size: 32px; font-weight: bold; color: #FC8200; letter-spacing: 8px; font-family: monospace;">
                              ${newVerificationCode}
                            </span>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <p style="color: #999999; font-size: 14px; text-align: center;">
                      ⚠️ Este código expira em <strong>10 minutos</strong>.
                    </p>
                    
                    <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
                    
                    <p style="color: #666666; font-size: 14px; line-height: 1.5;">
                      Se você não solicitou este código, por favor ignore este e-mail. Nenhuma ação é necessária.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td bgcolor="#f8f9fa" style="padding: 20px 30px; text-align: center;">
                    <p style="color: #999999; font-size: 12px; margin: 0;">
                      © ${new Date().getFullYear()} DelBicos - Delivery de Serviços.<br>
                      Todos os direitos reservados.
                    </p>
                  </td>
                </tr>

              </table>
              
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-top: 20px;">
                    <p style="color: #bbbbbb; font-size: 12px;">
                      Enviado automaticamente pelo sistema DelBicos.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

      await EmailService.sendTransactionalEmail({
        to: email,
        subject: emailSubject,
        html: emailHtml,
      });

      return res.status(200).json({ message: "Código reenviado com sucesso!" });
    } catch (error: any) {
      console.error("Erro ao reenviar código:", error);
      return res.status(500).json({ error: "Falha ao enviar o e-mail." });
    }
  },
};
