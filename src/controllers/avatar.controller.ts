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
    const userId = (req as any).userId;
    const userObject = (req as any).user;
    const { avatar_uri } = req.body;

    console.log("--- DEBUG UPDATE PATH ---");
    console.log("req.userId:", userId);
    console.log("req.user:", userObject);
    console.log("Body:", req.body);

    const finalId = userId || userObject?.id || userObject?._id;

    if (!finalId) {
      return res.status(401).json({ 
        error: "401 - Não foi possível extrair o ID do usuário do token." 
      });
    }

    const user = await UserModel.findByPk(finalId);
    
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado no banco." });
    }

    await user.update({ avatar_uri });
    
    return res.json({ 
      mensagem: "Perfil atualizado no banco!", 
      avatar_uri 
    });

  } catch (error: any) {
    console.error("ERRO NO UPDATE:", error);
    return res.status(500).json({ error: error.message });
  }
}
};