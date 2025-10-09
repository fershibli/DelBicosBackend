import { Request, Response } from "express";
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

export const getAddressesByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const addresses = await AddressModel.findAll({
      where: { 
        user_id: userId,
        active: true 
      },
      order: [['createdAt', 'DESC']]
    });

    res.json(addresses);
  } catch (error: any) {
    console.error('Erro ao buscar endereços:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
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
    ? res.json({ message: "Endereço deletado"})
    : res.status(404).json({ error: "Endereço não encontrado" });
};
