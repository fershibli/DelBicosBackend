import { Request, Response } from "express";
import { GalleryModel } from "../models/Gallery";

export class GalleryController {
  async create(req: Request, res: Response) {
    try {
      const { professional_id, image_url } = req.body;
      const newImage = await GalleryModel.create({ professional_id, url: image_url });
      return res.status(201).json(newImage);
    } catch (error) {
      console.error("Erro ao criar imagem da galeria:", error);
      return res.status(500).json({ error: "Erro interno" });
    }
  }

  async index(req: Request, res: Response) {
    try {
      const images = await GalleryModel.findAll();
      return res.json(images);
    } catch (error) {
      console.error("Erro ao listar imagens:", error);
      return res.status(500).json({ error: "Erro interno" });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const image = await GalleryModel.findByPk(id);
      if (!image) return res.status(404).json({ error: "Imagem não encontrada" });
      return res.json(image);
    } catch (error) {
      console.error("Erro ao buscar imagem:", error);
      return res.status(500).json({ error: "Erro interno" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { image_url } = req.body;
      const image = await GalleryModel.findByPk(id);
      if (!image) return res.status(404).json({ error: "Imagem não encontrada" });

      await image.update({ url: image_url });
      return res.json(image);
    } catch (error) {
      console.error("Erro ao atualizar imagem:", error);
      return res.status(500).json({ error: "Erro interno" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const image = await GalleryModel.findByPk(id);
      if (!image) return res.status(404).json({ error: "Imagem não encontrada" });

      await image.destroy();
      return res.json({ message: "Imagem excluída com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir imagem:", error);
      return res.status(500).json({ error: "Erro interno" });
    }
  }
}
