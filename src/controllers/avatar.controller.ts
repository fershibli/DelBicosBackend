import { Request, Response } from "express";
import { S3Service } from "../services/s3Service";
import { UserModel } from "../models/User";

const s3Service = new S3Service();

export const AvatarController = {
  listFiles: async (req: Request, res: Response) => {
    try {
      const files = await s3Service.listFiles();
      res.json(files);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  getFileUrl: async (req: Request, res: Response) => {
    try {
      const { key } = req.params;
      const url = await s3Service.getFileUrl(key);
      res.json({ url });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  getPresignedUrl: async (req: Request, res: Response) => {
    try {
      const { fileName, fileType } = req.body;
      const uploadUrl = await s3Service.generateUploadUrl(fileName, fileType);
      const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
      res.json({ uploadUrl, fileUrl });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  getUserAvatar: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await UserModel.findByPk(id, { attributes: ["id", "avatar_uri"] });
      if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
      res.json({ avatar_uri: user.avatar_uri });
    } catch (error: any) {
      res.status(500).json({ error: "Erro ao buscar avatar" });
    }
  },

  updateAvatarDatabase: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { avatar_uri } = req.body;
      const user = await UserModel.findByPk(id);
      if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

      await user.update({ avatar_uri });
      res.json({ mensagem: "Perfil atualizado no banco!", avatar_uri });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};