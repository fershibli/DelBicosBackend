import { Request, Response } from 'express';
import { UserModel } from '../models/User';

export const verifyCode = async (req: Request, res: Response) => {
  const { phoneNumber, code } = req.body;

  if (!phoneNumber || !code || code.length !== 4) {
    return res.status(400).json({ message: 'Código ou número inválido' });
  }

  try {
    const user = await UserModel.findOne({ where: { phone: phoneNumber } });

    if (user) {
      return res.status(200).json({
        exists: true,
        user: { name: user.name, location: 'São Paulo' }, // Adjust location as needed
      });
    }

    return res.status(200).json({ exists: false });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error });
  }
};