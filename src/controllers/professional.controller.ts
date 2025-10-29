import { Request, Response } from "express";
import { Op, literal } from "sequelize";
import { ProfessionalModel } from "../models/Professional";

export const getProfessionals = async (req: Request, res: Response) => {
  try {
    const { termo, lat, lng, raio_km = 10 } = req.query;

    const where: any = {};
    if (termo) {
      where[Op.or] = [
        { "$user.name$": { [Op.like]: `%${termo}%` } },
        { "$user.email$": { [Op.like]: `%${termo}%` } },
        { cpf: { [Op.like]: `%${termo}%` } },
      ];
    }

    const include = [
      {
        association: "User",
        attributes: ["name", "email"],
        required: false,
      },
      {
        association: "MainAddress",
        attributes: ["lat", "lng", "city"],
        required: false,
      },
      { association: "Services" },
      { association: "Amenities", through: { attributes: [] } },
      { association: "Gallery" },
      { association: "Availabilities" },
    ];

    const order: any[] = [];
    if (lat && lng) {
      const distance = literal(`
        6371 * acos(
          cos(radians(${lat})) * cos(radians(main_address.lat)) *
          cos(radians(main_address.lng) - radians(${lng})) +
          sin(radians(${lat})) * sin(radians(main_address.lat))
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
        { association: "User" },
        { association: "MainAddress" },
        { association: "Services" },
        { association: "Amenities", through: { attributes: [] } },
        { association: "Gallery" },
        {
          association: "Availabilities",
          where: { is_available: true },
          required: false,
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
