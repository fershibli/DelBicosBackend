import { Request, Response } from "express";
import { ProfessionalAvailabilityModel } from "../models/ProfessionalAvailability";

export const createAvailability = async (req: Request, res: Response) => {
  try {
    const availability = await ProfessionalAvailabilityModel.create(req.body);
    res.status(201).json(availability);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllAvailabilities = async (_req: Request, res: Response) => {
  const availabilities = await ProfessionalAvailabilityModel.findAll();
  res.json(availabilities);
};

export const getAvailabilityById = async (req: Request, res: Response) => {
  const availability = await ProfessionalAvailabilityModel.findByPk(req.params.id);
  availability
    ? res.json(availability)
    : res.status(404).json({ error: "Disponibilidade não encontrada" });
};

export const updateAvailability = async (req: Request, res: Response) => {
  const availability = await ProfessionalAvailabilityModel.findByPk(req.params.id);
  if (availability) {
    await availability.update(req.body);
    res.json(availability);
  } else {
    res.status(404).json({ error: "Disponibilidade não encontrada" });
  }
};

export const deleteAvailability = async (req: Request, res: Response) => {
  const deleted = await ProfessionalAvailabilityModel.destroy({ where: { id: req.params.id } });
  deleted
    ? res.json({ message: "Disponibilidade deletada com sucesso" })
    : res.status(404).json({ error: "Disponibilidade não encontrada" });
};
