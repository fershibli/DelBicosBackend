import { Request, Response } from "express";
import { UserModel } from "../models/User";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { AuthenticatedRequest } from "../interfaces/authentication.interface";

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.id;
    const { base64Image } = req.body;

    if (!base64Image) {
      return res.status(400).json({ error: "Imagem em base64 é obrigatória" });
    }

    const base64Regex = /^data:image\/(png|jpg|jpeg);base64,/;
    if (!base64Regex.test(base64Image)) {
      return res.status(400).json({
        error:
          "Formato base64 inválido. Formato esperado: data:image/(png|jpg|jpeg);base64,...",
      });
    }

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const matches = base64Image.match(/^data:image\/(png|jpg|jpeg);base64,/);
    if (!matches || matches.length < 2) {
      return res.status(400).json({ error: "Formato base64 inválido" });
    }

    const imageType = matches[1];
    const base64Data = base64Image.replace(
      /^data:image\/(png|jpg|jpeg);base64,/,
      ""
    );

    const avatarDir = path.join(
      __dirname,
      "..",
      "..",
      "avatarBucket",
      userId.toString()
    );

    if (!fs.existsSync(avatarDir)) {
      fs.mkdirSync(avatarDir, { recursive: true });
    }

    const fileName = `avatar.${imageType}`;
    const filePath = path.join(avatarDir, fileName);

    const buffer = Buffer.from(base64Data, "base64");
    fs.writeFileSync(filePath, buffer);

    const relativePath = `avatarBucket/${userId}/${fileName}`;

    await user.update({ avatar_uri: relativePath });

    res.status(200).json({
      success: true,
      message: "Avatar enviado com sucesso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar_uri: user.avatar_uri,
        // Adicione outros campos do user que o seu store precisa
      },
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getAvatar = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.id;

    const user = await UserModel.findByPk(userId, {
      attributes: ["id", "avatar_uri"],
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (!user.avatar_uri) {
      return res
        .status(404)
        .json({ error: "Avatar não encontrado para este usuário" });
    }

    res.status(200).json({
      userId: user.id,
      avatar_uri: user.avatar_uri,
    });
  } catch (error: any) {
    console.error("Erro ao buscar avatar:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteAvatar = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.id;

    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    if (!user.avatar_uri) {
      return res
        .status(404)
        .json({ error: "Avatar não encontrado para este usuário" });
    }

    const filePath = path.join(__dirname, "..", "..", user.avatar_uri);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const avatarDir = path.dirname(filePath);
    if (fs.existsSync(avatarDir)) {
      const files = fs.readdirSync(avatarDir);
      if (files.length === 0) {
        fs.rmdirSync(avatarDir);
      }
    }

    await user.update({ avatar_uri: null } as any);

    res.status(200).json({ message: "Avatar deletado com sucesso" });
  } catch (error: any) {
    console.error("Erro ao deletar avatar:", error);
    res.status(500).json({ error: error.message });
  }
};

export const uploadImgBBAvatar = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.id;
    const { base64Image } = req.body;

    if (!base64Image) {
      return res.status(400).json({ error: "Imagem em base64 é obrigatória" });
    }

    const base64Regex = /^data:image\/(png|jpg|jpeg);base64,/;
    if (!base64Regex.test(base64Image)) {
      return res.status(400).json({
        error:
          "Formato base64 inválido. Formato esperado: data:image/(png|jpg|jpeg);base64,...",
      });
    }

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Remove prefixo e normaliza o base64 (sem quebras de linha/espacos)
    const rawBase64 = base64Image
      .replace(/^data:image\/(png|jpg|jpeg);base64,/, "")
      .replace(/\s+/g, "");

    // Valida tamanho após limpeza (10MB)
    const maxSizeInBytes = 10 * 1024 * 1024;
    const approxBytes = Math.floor((rawBase64.length * 3) / 4); // estimativa do tamanho em bytes
    if (approxBytes > maxSizeInBytes) {
      return res
        .status(400)
        .json({ error: "Imagem excede o tamanho máximo de 10MB" });
    }

    // Valida base64 decodificando
    let buffer: Buffer;
    try {
      buffer = Buffer.from(rawBase64, "base64");
      if (buffer.length === 0) {
        throw new Error("Empty buffer");
      }
    } catch {
      return res.status(400).json({ error: "Base64 inválido" });
    }

    const uuid_name = uuidv4();

    // Envia ao imgbb (sem prefixo)
    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: new URLSearchParams({
        key: process.env.IMGBB_API_KEY || "",
        image: rawBase64,
        name: uuid_name,
      }),
    });

    const data = await response.json();
    console.log("Resposta do imgbb:", data);

    if (!data.success) {
      return res.status(500).json({
        error: data?.error?.message || "Falha ao enviar imagem para o imgbb",
      });
    }

    const avatarUrl = data.data.url;
    await user.update({ avatar_uri: avatarUrl });

    res.status(200).json({
      success: true,
      message: "Avatar enviado com sucesso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar_uri: user.avatar_uri,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
