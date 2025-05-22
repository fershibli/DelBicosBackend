import { CustomRequest, CustomResponse } from '../api/index';
import User from '../models/User';

export const confirmNumber = async (req: CustomRequest<{ phoneNumber: string }>, res: CustomResponse) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber || phoneNumber.length < 10) {
    return res.status(400).json({ message: 'Número de telefone inválido' });
  }

  try {
    const user = await User.findOne({ where: { phoneNumber } });

    if (user) {
      return res.status(200).json({ exists: true, message: 'Usuário existente, envie o código SMS' });
    }

    return res.status(200).json({ exists: false, message: 'Número não registrado, envie o código SMS' });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error });
  }
};