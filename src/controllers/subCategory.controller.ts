import { Request, Response } from "express";
import { SubCategoryModel } from "../models/Subcategory";
import { CategoryModel } from "../models/Category";

export const getAllSubCategories = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;

    // Verificar se a categoria existe
    const category = await CategoryModel.findOne({
      where: { id: categoryId, active: true },
    });

    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    // Buscar subcategorias da categoria específica
    const subcategories = await SubCategoryModel.findAll({
      where: {
        category_id: categoryId,
        active: true,
      },
      order: [["title", "ASC"]],
    });

    return res.json(subcategories);
  } catch (error: any) {
    console.error("Erro ao buscar subcategorias:", error);
    return res.status(500).json({
      error: "Erro interno do servidor",
      message: error.message,
    });
  }
};
