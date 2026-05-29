import { Request, Response } from "express";
import { S3Service } from "../services/s3Service";
import { UserModel } from "../models/User";
import path from "path";

const s3Service = new S3Service();

export const AvatarController = {
  listFiles: async (req: Request, res: Response) => {
    try {
      const files = await s3Service.listFiles();
      return res.json(files);
    } catch (error: any) {
      console.error("LIST FILES ERROR:", error);
      return res.status(500).json({
        error: error.message,
      });
    }
  },

  getFileUrl: async (req: Request, res: Response) => {
    try {
      const { key } = req.params;

      const url = await s3Service.getFileUrl(key);

      return res.json({ url });
    } catch (error: any) {
      console.error("GET FILE URL ERROR:", error);

      return res.status(500).json({
        error: error.message,
      });
    }
  },

  getPresignedUrl: async (req: Request, res: Response) => {
    try {
      const { fileName, fileType, folder } = req.body;

      if (!fileName || !fileType) {
        return res.status(400).json({
          error: "fileName e fileType são obrigatórios",
        });
      }

      const extension = path.extname(fileName);

      const uniqueFileName = `${folder || "uploads"}/${
        Date.now()
      }-${Math.random()
        .toString(36)
        .substring(2)}${extension}`;

      const uploadUrl =
        await s3Service.generateUploadUrl(
          uniqueFileName,
          fileType
        );

      const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;

      return res.json({
        uploadUrl,
        fileUrl,
        key: uniqueFileName,
      });
    } catch (error: any) {
      console.error("PRESIGNED URL ERROR:", error);

      return res.status(500).json({
        error: error.message,
      });
    }
  },

  getUserAvatar: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const user = await UserModel.findByPk(id, {
        attributes: [
          "id",
          "avatar_uri",
          "banner_uri",
        ],
      });

      if (!user) {
        return res.status(404).json({
          error: "Usuário não encontrado",
        });
      }

      return res.json({
        avatar_uri: user.avatar_uri,
        banner_uri: user.banner_uri,
      });
    } catch (error: any) {
      console.error("GET USER IMAGE ERROR:", error);

      return res.status(500).json({
        error: "Erro ao buscar imagens",
      });
    }
  },
  updateAvatarDatabase: async (req: Request, res: Response) => {
    try {
      const authReq = req as any;

      console.log("REQ USER:", authReq.user);

      const userId =
        typeof authReq.user === "number"
          ? authReq.user
          : authReq.user?.id;

      if (!userId) {
        return res.status(401).json({
          error: "Usuário não autenticado",
        });
      }

      const decodeHtml = (text?: string) => {
        if (!text) return text;

        return text
          .replace(/&#x2F;/g, "/")
          .replace(/&amp;/g, "&");
      };

      const avatar_uri = decodeHtml(req.body.avatar_uri);

      const banner_uri = decodeHtml(req.body.banner_uri);
      
      const user = await UserModel.findByPk(userId);

      if (!user) {
        return res.status(404).json({
          error: "Usuário não encontrado",
        });
      }

      await user.update({
        avatar_uri:
          avatar_uri ?? user.avatar_uri,

        banner_uri:
          banner_uri ?? user.banner_uri,
      });

      return res.json({
        success: true,
        avatar_uri: user.avatar_uri,
        banner_uri: user.banner_uri,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        error: error.message,
      });
    }
  },
};