import { Request, Response } from "express";
import { ProfessionalAmenityModel } from "../models/ProfessionalAmenities";

export const createProfessionalAmenity = async (req: Request, res: Response) => {
  try {
    const { professional_id, amenity_id } = req.body;
    const record = await ProfessionalAmenityModel.create({ professional_id, amenity_id });
    res.status(201).json(record);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllProfessionalAmenities = async (_req: Request, res: Response) => {
  const records = await ProfessionalAmenityModel.findAll();
  res.json(records);
};

export const getProfessionalAmenityById = async (req: Request, res: Response) => {
  const record = await ProfessionalAmenityModel.findByPk(req.params.id);
  record ? res.json(record) : res.status(404).json({ error: "Not found" });
};

export const deleteProfessionalAmenity = async (req: Request, res: Response) => {
  const deleted = await ProfessionalAmenityModel.destroy({ where: { id: req.params.id } });
  deleted
    ? res.json({ message: "Deleted successfully" })
    : res.status(404).json({ error: "Not found" });
};
