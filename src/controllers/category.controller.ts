import { Request, Response } from "express";
import { CategoryModel } from "../models/Category";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const newCategory = await CategoryModel.create({
      title,
      description,
    });
    return res.status(201).json(newCategory);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Falha ao criar categoria" });
  }
};

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

export const getByIdCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findOne({
      where: { id, active: true },
    });
    if (!category)
      return res.status(404).json({ error: "Categoria não encontrada" });
    return res.json(category);
  } catch (error) {
    return res.status(500).json({ error: "Falha ao buscar categoria" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, active } = req.body;
    const category = await CategoryModel.findByPk(id);
    if (!category)
      return res.status(404).json({ error: "Categoria não encontrada" });

    await category.update({ title, description, active });
    return res.json(category);
  } catch (error) {
    return res.status(500).json({ error: "Falha ao atualizar categoria" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findByPk(id);
    if (!category)
      return res.status(404).json({ error: "Categoria não encontrada" });

    await category.update({ active: false });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Falha ao excluir categoria" });
  }
};
