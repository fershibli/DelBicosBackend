import { Request, Response } from "express";
import { ProfessionalModel } from "../models/ProfessionalDTO";
import { UserModel } from "../models/User";
import { AddressModel } from "../models/Address";
import { ServiceModel } from "../models/Service";
import { AmenitiesModel } from "../models/Amenities";
import { GalleryModel } from "../models/Gallery";

export class ProfessionalDTOController {
  async create(req: Request, res: Response) {
    try {
      const professional = await ProfessionalModel.create(req.body);
      return res.status(201).json(professional);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar profissional", details: error });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const professionals = await ProfessionalModel.findAll({
        include: [
          { model: UserModel, as: "User" },
          { model: AddressModel, as: "address" },
          { model: ServiceModel, as: "services" },
          { model: AmenitiesModel, as: "amenities", through: { attributes: [] } },
          { model: GalleryModel, as: "gallery" },
        ],
      });
      return res.json(professionals);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar profissionais", details: error });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const professional = await ProfessionalModel.findByPk(id, {
        include: [
          { model: UserModel, as: "User" },
          { model: AddressModel, as: "address" },
          { model: ServiceModel, as: "services" },
          { model: AmenitiesModel, as: "amenities", through: { attributes: [] } },
          { model: GalleryModel, as: "gallery" },
        ],
      });

      if (!professional) {
        return res.status(404).json({ message: "Profissional não encontrado" });
      }

      return res.json(professional);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar profissional", details: error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const [updated] = await ProfessionalModel.update(req.body, {
        where: { id },
      });

      if (!updated) {
        return res.status(404).json({ message: "Profissional não encontrado" });
      }
        const professional = await ProfessionalModel.findByPk(id, {
          include: [
            { model: UserModel, as: "User" },
            { model: AddressModel, as: "address" },
            { model: ServiceModel, as: "services" },
            { model: AmenitiesModel, as: "amenities", through: { attributes: [] } },
            { model: GalleryModel, as: "gallery" },
          ],
        });

      return res.json(professional);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar profissional", details: error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const deleted = await ProfessionalModel.destroy({ where: { id } });

      if (!deleted) {
        return res.status(404).json({ message: "Profissional não encontrado" });
      }

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: "Erro ao remover profissional", details: error });
    }
  }
}
