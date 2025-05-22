import { User as UserInterface } from '../interfaces';
import { Request, Response } from 'express';
import User from '../models/User';

// If you have a custom response type, import it here. Otherwise, use Express' Response type.
type CustomResponse = Response;
export const register = async (req: Request<UserInterface>, res: CustomResponse) => {
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