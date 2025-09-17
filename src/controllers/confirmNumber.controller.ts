import { Request, Response } from 'express';
import { UserModel } from '../models/User';

export const confirmNumber = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber || phoneNumber.length < 10) {
    return res.status(400).json({ message: 'Número de telefone inválido' });
  }

  try {
    const user = await UserModel.findOne({ where: { phone: phoneNumber } });

    if (user) {
      return res.status(200).json({ exists: true, message: 'Usuário existente, envie o código SMS' });
    }

    return res.status(200).json({ exists: false, message: 'Número não registrado, envie o código SMS' });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error });
  }
};