import { CustomRequest, CustomResponse } from '../api/index';
import User from '../models/User';

export const getUser = async (req: CustomRequest<{}>, res: CustomResponse) => {
  const { phoneNumber } = req.params;

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({
      name: user.firstName,
      location: user.location,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error });
  }
};