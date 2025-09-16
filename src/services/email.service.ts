import sgMail from "../config/sendgrid";

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export const EmailService = {
  sendTransactionalEmail: async ({
    to,
    subject,
    html,
  }: EmailParams): Promise<boolean> => {
    const fromEmail = process.env.SENDER_EMAIL_VERIFICADO;

    if (!fromEmail) {
      console.error("E-mail remetente verificado não encontrado no .env");
      return false;
    }

    const msg = {
      to,
      from: fromEmail,
      subject,
      html,
    };

    try {
      await sgMail.send(msg);
      console.log(`E-mail enviado com sucesso para ${to}`);
      return true;
    } catch (error) {
      console.error("Erro ao enviar e-mail pelo serviço:", error);
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { body?: any } };
        console.error(err.response?.body);
      }
      return false;
    }
  },
};
