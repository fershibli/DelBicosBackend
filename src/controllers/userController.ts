import { Request, Response } from "express";
import { UserModel } from "../models/User";

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.create(req.body);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await UserModel.findAll();
  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await UserModel.findByPk(req.params.id);
  user ? res.json(user) : res.status(404).json({ error: "User not found" });
};

export const updateUser = async (req: Request, res: Response) => {
  const user = await UserModel.findByPk(req.params.id);
  if (user) {
    await user.update(req.body);
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const deleted = await UserModel.destroy({ where: { id: req.params.id } });
  deleted
    ? res.json({ message: "User deleted" })
    : res.status(404).json({ error: "User not found" });
};
