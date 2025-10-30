import { Request, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/authentication.interface";
import { AddressModel } from "../models/Address";

export const getAllAddressByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const addresses = await AddressModel.findAll({
      where: {
        user_id: userId,
        active: true,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json(addresses);
  } catch (error: any) {
    console.error("Erro ao buscar endereços:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getAddressesForAuthenticatedUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const addresses = await AddressModel.findAll({
      where: { user_id: userId },
    });
    res.json(addresses);
  } catch (error: any) {
    console.error("Erro ao buscar endereços do usuário autenticado:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const createAddressForAuthenticatedUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const payload = { ...req.body, user_id: userId };
    const address = await AddressModel.create(payload as any);
    res.status(201).json(address);
  } catch (error: any) {
    console.error("Erro ao criar endereço para usuário autenticado:", error);
    res.status(400).json({ error: error.message });
  }
};

export const updateAddressForAuthenticatedUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const addressId = Number(req.params.id);
  if (!addressId || Number.isNaN(addressId)) {
    res.status(400).json({ error: "ID de endereço inválido" });
    return;
  }

  try {
    const address = await AddressModel.findByPk(addressId);
    if (!address) {
      res.status(404).json({ error: "Endereço não encontrado" });
      return;
    }

    if (address.user_id !== userId) {
      res.status(403).json({ error: "Ação não permitida" });
      return;
    }

    // Prevent changing ownership via update
    const { user_id, id, ...updatable } = req.body as any;
    await address.update(updatable);
    res.json(address);
  } catch (error: any) {
    console.error("Erro ao atualizar endereço do usuário autenticado:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const deleteAddressForAuthenticatedUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const addressId = Number(req.params.id);
  if (!addressId || Number.isNaN(addressId)) {
    res.status(400).json({ error: "ID de endereço inválido" });
    return;
  }

  try {
    const address = await AddressModel.findByPk(addressId);
    if (!address) {
      res.status(404).json({ error: "Endereço não encontrado" });
      return;
    }

    if (address.user_id !== userId) {
      res.status(403).json({ error: "Ação não permitida" });
      return;
    }

    await address.destroy();
    res.json({ message: "Endereço deletado" });
  } catch (error: any) {
    console.error("Erro ao deletar endereço do usuário autenticado:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
