import { Request, Response } from 'express';
type CustomRequest<T> = Request & { body: T };
type CustomResponse = Response;
import User from '../models/User';
import UserInterface from '../models/User';

export const getUser = async (req: CustomRequest<{}>, res: CustomResponse) => {
  const { phoneNumber } = req.params;

  try {
    const user = await User.findOne({ where: { phoneNumber } });
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

export const getAllUsers = async (req: CustomRequest<{}>, res: CustomResponse) => {
  try {
    const users = await User.findAll();
    res.status(200).json(
      users.map((user) => ({
        id: user.id,
        name: user.firstName,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error });
  }
};

export const getUserById = async (req: CustomRequest<{}>, res: CustomResponse) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({
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

export const updateUser = async (req: CustomRequest<Partial<UserInterface>>, res: CustomResponse) => {
  const { id } = req.params;
  const { firstName, email } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    await user.update({ firstName, email });
    res.status(200).json({
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