import { Request, Response } from "express";
import { Op, literal } from "sequelize";
import { ProfessionalModel } from "../models/Professional";
// Importe os modelos associados para os includes
import { UserModel } from "../models/User";
import { AddressModel } from "../models/Address";
import { ServiceModel } from "../models/Service";
import { AppointmentModel } from "../models/Appointment";
import { ClientModel } from "../models/Client";
import { ProfessionalGalleryModel } from "../models/ProfessionalGallery";
import { ProfessionalAvailabilityModel } from "../models/ProfessionalAvailability";
import { AmenitiesModel } from "../models/Amenities";

export const getProfessionals = async (req: Request, res: Response) => {
  try {
    const { termo, page = 0, limit = 12, lat, lng } = req.query;
    const latNum = typeof lat === "string" ? parseFloat(lat) : undefined;
    const lngNum = typeof lng === "string" ? parseFloat(lng) : undefined;
    const hasLatLng = Number.isFinite(latNum) && Number.isFinite(lngNum);

    const where: any = {};
    if (termo) {
      where[Op.or] = [
        { "$User.name$": { [Op.like]: `%${termo}%` } },
        { "$User.email$": { [Op.like]: `%${termo}%` } },
        { cpf: { [Op.like]: `%${termo}%` } },
      ];
    }

    const distanceLiteral = hasLatLng
      ? literal(`
        6371 * acos(
          LEAST(1, GREATEST(-1,
            cos(radians(${latNum})) * cos(radians("MainAddress"."lat")) *
            cos(radians("MainAddress"."lng") - radians(${lngNum})) +
            sin(radians(${latNum})) * sin(radians("MainAddress"."lat"))
          ))
        )
      `)
      : null;

    const order: any[] = [];
    if (hasLatLng && distanceLiteral) {
      order.push([distanceLiteral, "ASC"]);
    } else {
      order.push(["createdAt", "DESC"]);
    }

    const attributes: any = {};

    if (hasLatLng && distanceLiteral) {
      attributes.include = [[distanceLiteral as any, "distance_km"]];
    }

    const { rows, count } = await ProfessionalModel.findAndCountAll({
      attributes,
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
        // {
        //   model: ProfessionalGalleryModel,
        //   as: "Gallery",
        //   required: false,
        // },
        // {
        //   model: ProfessionalAvailabilityModel,
        //   as: "Availabilities",
        //   required: false,
        // },
        // {
        //   model: AmenitiesModel,
        //   as: "Amenities",
        //   through: { attributes: [] },
        //   required: false,
        // },
        // Inclui appointments apenas com rating válido para calcular média/contagem
        {
          model: AppointmentModel,
          as: "Appointments",
          attributes: ["rating"],
          required: false,
          separate: true, // evita duplicar linhas do profissional
          where: {
            status: "completed",
            rating: { [Op.ne]: null } as any, // evita conflito de tipagem TS
          },
        },
      ],
      where,
      order,
      limit: Number(limit),
      offset: Number(page) * Number(limit),
      distinct: true,
    });

    // Calcula ratings_avg e ratings_count a partir dos appointments incluídos
    for (const prof of rows as any[]) {
      const apps = (prof.Appointments ?? []) as Array<{
        rating: number | null;
      }>;
      const ratings = apps
        .map((a) => a?.rating ?? null)
        .filter((v): v is number => v !== null && Number.isFinite(v));

      const ratings_count = ratings.length;
      const rating =
        ratings_count > 0
          ? ratings.reduce((s, n) => s + n, 0) / ratings_count
          : null;

      // Arredonda para 2 casas decimais (mantendo tipo number)
      const roundedRating =
        rating !== null ? Math.round(rating * 100) / 100 : null;

      prof.setDataValue("rating", roundedRating); // média arredondada
      prof.setDataValue("ratings_count", ratings_count);

      // remove o array de appointments do payload
      if (prof.dataValues?.Appointments) {
        delete prof.dataValues.Appointments;
      }
    }

    console.log(`Encontrados ${rows.length} profissionais`);

    return res.json({
      professionals: rows,
      totalCount: count,
      currentPage: Number(page),
      pageSize: Number(limit),
      totalPages: Math.ceil(count / Number(limit)),
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
        // { model: AmenitiesModel, as: "Amenities", through: { attributes: [] } },
        // { model: ProfessionalGalleryModel, as: "Gallery" },
        // {
        //   model: ProfessionalAvailabilityModel,
        //   as: "Availabilities",
        //   where: { is_available: true },
        // },
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
                {
                  model: UserModel,
                  as: "User",
                  attributes: ["name", "avatar_uri"],
                },
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
