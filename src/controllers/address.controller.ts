import { Request, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/authentication.interface";
import { AddressModel } from "../models/Address";

export const createAddress = async (req: Request, res: Response) => {
  try {
    const address = await AddressModel.create(req.body);
    res.status(201).json(address);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllAddresses = async (_req: Request, res: Response) => {
  const addresses = await AddressModel.findAll();
  res.json(addresses);
};

export const getAddressById = async (req: Request, res: Response) => {
  const address = await AddressModel.findByPk(req.params.id);
  address
    ? res.json(address)
    : res.status(404).json({ error: "Endereço não encontrado" });
};

export const updateAddress = async (req: Request, res: Response) => {
  const address = await AddressModel.findByPk(req.params.id);
  if (address) {
    await address.update(req.body);
    res.json(address);
  } else {
    res.status(404).json({ error: "Endereço não encontrado" });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  const deleted = await AddressModel.destroy({ where: { id: req.params.id } });
  deleted
    ? res.json({ message: "Endereço deletado" })
    : res.status(404).json({ error: "Endereço não encontrado" });
};

export const getAllAddressByUserId = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  if (!userId || Number.isNaN(userId)) {
    res.status(400).json({ error: "ID de usuário inválido" });
    return;
  }

  try {
    const addresses = await AddressModel.findAll({
      where: { user_id: userId },
    });
    res.json(addresses);
  } catch (error: any) {
    console.error("Erro ao buscar endereços por usuário:", error);
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
