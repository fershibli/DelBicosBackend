import { Request, Response } from "express";
import { Op, literal } from "sequelize";
import { ProfessionalModel } from "../models/Professional";

export const getProfessionals = async (req: Request, res: Response) => {
  try {
    const { termo, page = 0, limit = 12 } = req.query;

    console.log("Buscando profissionais...");

    const professionals = await ProfessionalModel.findAll({
      include: [
        {
          association: "User",
          attributes: ["id", "name", "email", "avatar_uri", "banner_uri"],
          required: false,
        },
        {
          association: "Services",
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
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
        { association: "User" },
        { association: "MainAddress" },
        { association: "Services" },
        {
          association: "Appointments",
          where: { status: "completed", rating: { [Op.not]: null } },
          required: false,
          include: [
            {
              association: "Client",
              include: [
                { association: "User", attributes: ["name", "avatar_uri"] },
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
