import { Request, Response } from "express";
import { ProfessionalModel } from "../models/Professional";

export const createProfessional = async (req: Request, res: Response) => {
  try {
    const professional = await ProfessionalModel.create(req.body);
    res.status(201).json(professional);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllProfessionals = async (_req: Request, res: Response) => {
  const professionals = await ProfessionalModel.findAll();
  res.json(professionals);
};

export const getProfessionalById = async (req: Request, res: Response) => {
  const professional = await ProfessionalModel.findByPk(req.params.id);
  professional
    ? res.json(professional)
    : res.status(404).json({ error: "Profissional não encontrado" });
};

export const updateProfessional = async (req: Request, res: Response) => {
  const professional = await ProfessionalModel.findByPk(req.params.id);
  if (professional) {
    await professional.update(req.body);
    res.json(professional);
  } else {
    res.status(404).json({ error: "Profissional não encontrado" });
  }
};

export const deleteProfessional = async (req: Request, res: Response) => {
  const deleted = await ProfessionalModel.destroy({
    where: { id: req.params.id },
  });
  deleted
    ? res.json({ message: "Profissional deletado com sucesso" })
    : res.status(404).json({ error: "Profissional não encontrado" });
};
