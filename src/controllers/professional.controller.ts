import { Request, Response } from "express";
import { Op, literal } from "sequelize";
import { ProfessionalModel } from "../models/Professional";
// Importe os modelos associados para os includes
import { UserModel } from "../models/User";
import { AddressModel } from "../models/Address";
import { ServiceModel } from "../models/Service";
import { AmenitiesModel } from "../models/Amenities";
import { ProfessionalGalleryModel } from "../models/ProfessionalGallery";
import { ProfessionalAvailabilityModel } from "../models/ProfessionalAvailability";

export const getProfessionals = async (req: Request, res: Response) => {
  try {
    const { termo, lat, lng, raio_km = 10 } = req.query;

    const where: any = {};
    if (termo) {
      where[Op.or] = [
        { "$User.name$": { [Op.like]: `%${termo}%` } },
        { "$User.email$": { [Op.like]: `%${termo}%` } },
        { cpf: { [Op.like]: `%${termo}%` } },
      ];
    }

    const include = [
      {
        model: UserModel,
        as: "User",
        attributes: ["name", "email"],
        required: false,
      },
      {
        model: AddressModel,
        as: "MainAddress",
        attributes: ["lat", "lng", "city"],
        required: false,
      },
      { model: ServiceModel, as: "Services" },
      // { model: AmenitiesModel, as: "Amenities", through: { attributes: [] } },
      // { model: ProfessionalGalleryModel, as: "Gallery" },
      // { model: ProfessionalAvailabilityModel, as: "Availabilities" },
    ];

    const order: any[] = [];
    if (lat && lng && lat !== "null" && lng !== "null") {
      const distance = literal(`
        6371 * acos(
          cos(radians(${lat})) * cos(radians("main_address"."lat")) *
          cos(radians("main_address"."lng") - radians(${lng})) +
          sin(radians(${lat})) * sin(radians("main_address"."lat"))
        )
      `);
      order.push([distance, "ASC"]);
    } else {
      order.push(["createdAt", "DESC"]);
    }

    const professionals = await ProfessionalModel.findAll({
      where,
      include,
      order,
    });

    return res.json(professionals);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Erro ao buscar profissionais", details: error });
  }
};

export const getProfessionalById = async (req: Request, res: Response) => {
  try {
    const professional = await ProfessionalModel.findByPk(req.params.id, {
      include: [
        { model: UserModel, as: "User" },
        { model: AddressModel, as: "MainAddress" },
        { model: ServiceModel, as: "Services" },
        // { model: AmenitiesModel, as: "Amenities", through: { attributes: [] } },
        // { model: ProfessionalGalleryModel, as: "Gallery" },
        // {
        //   model: ProfessionalAvailabilityModel,
        //   as: "Availabilities",
        //   where: { is_available: true },
        //   required: false,
        // },
      ],
    });

    if (!professional) {
      return res.status(404).json({ error: "Profissional não encontrado" });
    }

    return res.json(professional);
  } catch (error) {
    console.error("Erro ao buscar profissional:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const createProfessional = async (req: Request, res: Response) => {
  try {
    const newProfessional = await ProfessionalModel.create(req.body);
    return res.status(201).json(newProfessional);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar profissional" });
  }
};

export const updateProfessional = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await ProfessionalModel.update(req.body, {
      where: { id },
    });

    if (!updated) {
      return res.status(404).json({ error: "Profissional não encontrado" });
    }

    const updatedProfessional = await ProfessionalModel.findByPk(id, {
      include: [
        { model: UserModel, as: "User" },
        { model: AddressModel, as: "MainAddress" },
        { model: ServiceModel, as: "Services" },
        // { model: AmenitiesModel, as: "Amenities", through: { attributes: [] } },
        // { model: ProfessionalGalleryModel, as: "Gallery" },
        // { model: ProfessionalAvailabilityModel, as: "Availabilities" },
      ],
    });

    return res.json(updatedProfessional);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao atualizar profissional" });
  }
};

export const deleteProfessional = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await ProfessionalModel.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ error: "Profissional não encontrado" });
    }

    return res.json({ message: "Profissional removido com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao remover profissional" });
  }
};
