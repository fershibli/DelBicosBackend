import { CustomRequest, CustomResponse, User as UserInterface } from '../interfaces';
import User from '../models/User';

export const register = async (req: CustomRequest<UserInterface>, res: CustomResponse) => {
  const { phoneNumber, firstName, lastName, birthDate, gender, location, email, password } = req.body;

  if (!phoneNumber || !firstName || !lastName || !birthDate || !gender || !location || !email || !password) {
    return res.status(400).json({ message: 'Preencha todos os campos' });
  }

  try {
    const existingUser = await User.findOne({ where: { phoneNumber } });
    if (existingUser) {
      return res.status(400).json({ message: 'Número ou e-mail já registrado' });
    }

    const user = await User.create({
      phoneNumber,
      firstName,
      lastName,
      birthDate,
      gender,
      location,
      email,
      password,
    });

    res.status(201).json({
      id: user.id,
      name: user.firstName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error });
  }
};