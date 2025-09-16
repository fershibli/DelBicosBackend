import { Request, Response } from "express";
import { EmailService } from "../services/email.service";

export const EmailController = {
  handleSendTestEmail: async (req: Request, res: Response) => {
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
      return res
        .status(400)
        .json({ error: 'Campos "to", "subject" e "html" são obrigatórios.' });
    }

    const wasSent = await EmailService.sendTransactionalEmail({
      to,
      subject,
      html,
    });

    if (wasSent) {
      return res.status(200).json({ message: "E-mail enviado com sucesso!" });
    } else {
      return res.status(500).json({ error: "Falha ao enviar o e-mail." });
    }
  },
};
