import { Request, Response } from "express";
import { AmenitiesModel } from "../models/Amenities";

export class AmenitiesController {
  async create(req: Request, res: Response) {
    try {
      const { title } = req.body;
      const newAmenity = await AmenitiesModel.create({ title });
      return res.status(201).json(newAmenity);
    } catch (error) {
      console.error("Erro ao criar amenity:", error);
      return res.status(500).json({ error: "Erro interno ao criar amenity" });
    }
  }

  async index(req: Request, res: Response) {
    try {
      const amenities = await AmenitiesModel.findAll();
      return res.json(amenities);
    } catch (error) {
      console.error("Erro ao listar amenities:", error);
      return res.status(500).json({ error: "Erro interno ao listar amenities" });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const amenity = await AmenitiesModel.findByPk(id);
      if (!amenity) return res.status(404).json({ error: "Amenity não encontrada" });
      return res.json(amenity);
    } catch (error) {
      console.error("Erro ao buscar comodidade:", error);
      return res.status(500).json({ error: "Erro interno" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title } = req.body;
      const amenity = await AmenitiesModel.findByPk(id);
      if (!amenity) return res.status(404).json({ error: "Comodidade não encontrada" });

      await amenity.update({ title });
      return res.json(amenity);
    } catch (error) {
      console.error("Erro ao atualizar comodidade:", error);
      return res.status(500).json({ error: "Erro interno" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const amenity = await AmenitiesModel.findByPk(id);
      if (!amenity) return res.status(404).json({ error: "Comodidade não encontrada" });

      await amenity.destroy();
      return res.json({ message: "Comodidade excluída com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir comodidade:", error);
      return res.status(500).json({ error: "Erro interno" });
    }
  }
}
