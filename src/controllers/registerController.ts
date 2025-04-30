import { CustomRequest, CustomResponse, User } from '../api/index';
import UserModel from '../models/User';

export const register = async (req: CustomRequest<User>, res: CustomResponse) => {
  const { phoneNumber, firstName, lastName, birthDate, gender, location, email, password } = req.body;

  if (!phoneNumber || !firstName || !lastName || !birthDate || !gender || !location || !email || !password) {
    return res.status(400).json({ message: 'Preencha todos os campos' });
  }

  try {
    const existingUser = await UserModel.findOne({ $or: [{ phoneNumber }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Número ou e-mail já registrado' });
    }

    const user = new UserModel({
      phoneNumber,
      firstName,
      lastName,
      birthDate,
      gender,
      location,
      email,
      password,
    });

    await user.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error });
  }
};