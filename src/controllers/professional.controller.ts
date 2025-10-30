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
import { AppointmentModel } from "../models/Appointment";
import { ClientModel } from "../models/Client";

export const getProfessionals = async (req: Request, res: Response) => {
  try {
    const { termo, page = 0, limit = 12, lat, lng } = req.query;

    const where: any = {};
    if (termo) {
      where[Op.or] = [
        { "$user.name$": { [Op.like]: `%${termo}%` } },
        { "$user.email$": { [Op.like]: `%${termo}%` } },
        { cpf: { [Op.like]: `%${termo}%` } },
      ];
    }

    const order: any[] = [];
    if (lat && lng && lat !== "null" && lng !== "null") {
      const distance = literal(`
        6371 * acos(
          LEAST(1, GREATEST(-1,
            cos(radians(${lat})) * cos(radians("MainAddress"."lat")) *
            cos(radians("MainAddress"."lng") - radians(${lng})) +
            sin(radians(${lat})) * sin(radians("MainAddress"."lat"))
          ))
        )
      `);
      order.push([distance, "ASC"]);
    } else {
      order.push(["createdAt", "DESC"]);
    }

    const professionals = await ProfessionalModel.findAll({
      include: [
        {
          model: UserModel,
          as: "User",
          attributes: ["id", "name", "email", "avatar_uri", "banner_uri"],
          required: false,
        },
        {
          model: AddressModel,
          as: "MainAddress",
          attributes: ["lat", "lng", "city"],
          required: false,
        },
        {
          model: ServiceModel,
          as: "Services",
          required: false,
        },
      ],
      order,
      limit: Number(limit),
      offset: Number(page) * Number(limit),
    });

    console.log(`Encontrados ${professionals.length} profissionais`);

    return res.json({
      professionals,
      totalCount: professionals.length,
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Erro ao buscar profissionais:", error);
    return res.status(500).json({
      error: "Erro ao buscar profissionais",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getProfessionalById = async (req: Request, res: Response) => {
  try {
    const professional = await ProfessionalModel.findByPk(req.params.id, {
      include: [
        {
          model: UserModel,
          as: "User",
          attributes: ["id", "name", "email", "avatar_uri", "banner_uri"],
        },
        { model: AddressModel, as: "MainAddress" },
        { model: ServiceModel, as: "Services" },
        {
          model: AppointmentModel,
          as: "Appointments",
          where: { status: "completed", rating: { [Op.not]: null } },
          required: false,
          include: [
            {
              model: ClientModel,
              as: "Client",
              include: [
                { model: UserModel, attributes: ["name", "avatar_uri"] },
              ],
            },
          ],
        },
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
