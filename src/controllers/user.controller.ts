import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/authentication.interface";
import { UserModel } from "../models/User";
import { AddressModel } from "../models/Address";
import { ClientModel } from "../models/Client";
import { generateTokenAndUserPayload } from "../utils/authUtils";
import logger, { logAuth, logError } from "../utils/logger";

export const logInUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };
  try {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      logAuth("login", undefined, email, false, "Usuário não encontrado");
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logAuth("login", user.id, email, false, "Senha inválida");
      res.status(401).json({ message: "Senha inválida" });
      return;
    }

    const client = await ClientModel.findOne({ where: { user_id: user.id } });

    if (!client) {
      logAuth("login", user.id, email, false, "Cliente não encontrado");
      res.status(404).json({ message: "Cliente não encontrado" });
      return;
    }

    const address = await AddressModel.findByPk(client.main_address_id);

    const { token, user: userPayload } = generateTokenAndUserPayload(
      user,
      client,
      address
    );

    logAuth("login", user.id, email, true);
    logger.info("Login realizado com sucesso", { userId: user.id, email });

    res.status(200).json({
      message: "Login realizado com sucesso",
      token: token,
      user: userPayload,
    });
  } catch (error) {
    logError("Erro ao fazer login", error, { email });
    res.status(500).json({
      message: "Erro interno do servidor",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await UserModel.findByPk(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar_uri: user.avatar_uri,
    banner_uri: user.banner_uri,
  });
};

export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { current_password, new_password } = req.body as {
      current_password: string;
      new_password: string;
    };

    if (!current_password || !new_password) {
      res
        .status(400)
        .json({ message: "current_password and new_password are required" });
      return;
    }

    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await UserModel.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      logger.warn("Tentativa de mudança de senha com senha incorreta", { userId });
      res.status(400).json({ message: "Senha atual incorreta" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(new_password, salt);
    user.password = hashed;
    await user.save();

    logger.info("Senha alterada com sucesso", { userId });
    res.status(204).send();
  } catch (error) {
    logError("Erro ao alterar senha", error, { userId });
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const deleted = await UserModel.destroy({ where: { id: req.params.id } });
  deleted
    ? res.json({ message: "Usuário deletado com sucesso" })
    : res.status(404).json({ error: "Usuário não encontrado" });
};

export const getUserByToken = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const user = await UserModel.findByPk(userId, {
      attributes: ["id", "name", "email", "phone", "avatar_uri", "banner_uri"],
      include: [
        {
          model: ClientModel,
          as: "Client",
          attributes: ["id", "cpf"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(200).json({ user });
  } catch (error: any) {
    logError("Erro ao buscar usuário pelo token", error, { userId });
    res.status(500).json({ error: error.message });
  }
};
