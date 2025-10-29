import { Request, Response } from "express";
import { CategoryModel } from "../models/Category";

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.findAll({
      where: { active: true },
    });
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ error: "Falha ao buscar categorias" });
  }
};
