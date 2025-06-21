import { Request, Response } from "express";
import { ClientModel } from "../models/Client";

export const createClient = async (req: Request, res: Response) => {
  try {
    const client = await ClientModel.create(req.body);
    res.status(201).json(client);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllClients = async (_req: Request, res: Response) => {
  const clients = await ClientModel.findAll();
  res.json(clients);
};

export const getClientById = async (req: Request, res: Response) => {
  const client = await ClientModel.findByPk(req.params.id);
  client
    ? res.json(client)
    : res.status(404).json({ error: "Cliente não encontrado" });
};

export const updateClient = async (req: Request, res: Response) => {
  const client = await ClientModel.findByPk(req.params.id);
  if (client) {
    await client.update(req.body);
    res.json(client);
  } else {
    res.status(404).json({ error: "Cliente não encontrado" });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  const deleted = await ClientModel.destroy({ where: { id: req.params.id } });
  deleted
    ? res.json({ message: "Cliente deletado com sucesso" })
    : res.status(404).json({ error: "Cliente não encontrado" });
};
