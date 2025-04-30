import { CustomRequest, CustomResponse } from '../api/index'; 
import User from '../models/User';

export const verifyCode = async (req: CustomRequest<{ phoneNumber: string; code: string }>, res: CustomResponse) => {
  const { phoneNumber, code } = req.body;

  if (!phoneNumber || !code || code.length !== 4) {
    return res.status(400).json({ message: 'Código ou número inválido' });
  }

  try {
    const user = await User.findOne({ phoneNumber });

    if (user) {
      return res.status(200).json({
        exists: true,
        user: { name: user.firstName, location: user.location },
      });
    }

    return res.status(200).json({ exists: false });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error });
  }
};