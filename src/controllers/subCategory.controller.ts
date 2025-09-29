import { Request, Response } from "express";
import { SubCategoryModel } from "../models/Subcategory";
import { CategoryModel } from "../models/Category";

export const createSubCategory = async (req: Request, res: Response) => {
  try {
    const { title, description, category_id } = req.body;

    const newSubcategory = await SubCategoryModel.create({
      title,
      description,
      category_id,
    });

    return res.status(201).json(newSubcategory);
  } catch (error: any) {
    console.error("Erro ao criar subcategoria:", error);
    return res.status(500).json({
      error: "Erro ao criar subcategoria",
      message: error.message,
      sql: error?.sql,
      sqlMessage: error?.original?.sqlMessage,
    });
  }
};

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

export const getByIdSubCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subcategory = await SubCategoryModel.findOne({
      where: { id, active: true },
    });
    if (!subcategory)
      return res.status(404).json({ error: "Subcategory not found" });
    return res.json(subcategory);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch subcategory" });
  }
};

export const updateSubCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, category_id, active } = req.body;
    const subcategory = await SubCategoryModel.findByPk(id);
    if (!subcategory)
      return res.status(404).json({ error: "Subcategory not found" });

    await subcategory.update({ title, description, category_id, active });
    return res.json(subcategory);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update subcategory" });
  }
};

export const deleteSubCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subcategory = await SubCategoryModel.findByPk(id);
    if (!subcategory)
      return res.status(404).json({ error: "Subcategory not found" });

    await subcategory.update({ active: false });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete subcategory" });
  }
};
