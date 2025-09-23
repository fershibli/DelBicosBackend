import { Request, Response } from "express";
import { UserModel } from "../models/User";
import fs from "fs";
import path from "path";

export const uploadAvatar = async (req: Request, res: Response) => {
  console.log("=== INICIANDO UPLOAD DE AVATAR ===");
  console.log("📦 Headers recebidos:", req.headers);
  console.log("🔍 Parâmetros da URL:", req.params);
  console.log(
    "📊 Tamanho do body:",
    JSON.stringify(req.body)?.length || 0,
    "bytes"
  );

  try {
    const userId = req.params.id;
    const { base64Image } = req.body;

    console.log(`👤 UserID recebido: ${userId}`);
    console.log("🖼️  Base64 image received:", base64Image ? "SIM" : "NÃO");

    if (!base64Image) {
      console.log("❌ Erro: Base64 image é obrigatória");
      return res.status(400).json({ error: "Imagem em base64 é obrigatória" });
    }

    console.log("✅ Base64 image presente");
    console.log("🔍 Validando formato base64...");

    const base64Regex = /^data:image\/(png|jpg|jpeg);base64,/;
    if (!base64Regex.test(base64Image)) {
      console.log("❌ Formato base64 inválido");
      return res.status(400).json({
        error:
          "Formato base64 inválido. Formato esperado: data:image/(png|jpg|jpeg);base64,...",
      });
    }

    console.log("✅ Formato base64 válido");

    console.log("🔍 Buscando usuário no banco...");
    const user = await UserModel.findByPk(userId);
    if (!user) {
      console.log(`❌ Usuário ${userId} não encontrado`);
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    console.log("✅ Usuário encontrado:", user.id);

    const matches = base64Image.match(/^data:image\/(png|jpg|jpeg);base64,/);
    if (!matches || matches.length < 2) {
      console.log("❌ Não foi possível extrair tipo da imagem");
      return res.status(400).json({ error: "Formato base64 inválido" });
    }

    const imageType = matches[1];
    const base64Data = base64Image.replace(
      /^data:image\/(png|jpg|jpeg);base64,/,
      ""
    );

    console.log(`📸 Tipo da imagem: ${imageType}`);
    console.log(`📊 Tamanho dos dados base64: ${base64Data.length} caracteres`);

    const avatarDir = path.join(__dirname, "..", "..", "avatarBucket", userId);
    console.log(`📁 Diretório destino: ${avatarDir}`);

    if (!fs.existsSync(avatarDir)) {
      console.log("📂 Criando diretório...");
      fs.mkdirSync(avatarDir, { recursive: true });
      console.log("✅ Diretório criado");
    }

    const fileName = `avatar.${imageType}`;
    const filePath = path.join(avatarDir, fileName);
    console.log(`💾 Salvando arquivo: ${filePath}`);

    const buffer = Buffer.from(base64Data, "base64");
    fs.writeFileSync(filePath, buffer);
    console.log("✅ Arquivo salvo com sucesso");

    const relativePath = `avatarBucket/${userId}/${fileName}`;
    console.log(`🔄 Atualizando banco com path: ${relativePath}`);

    await user.update({ avatarUri: relativePath });
    console.log("✅ Banco atualizado");

    const fullAvatarUrl = `http://localhost:3000/${relativePath}`;
    console.log("🌐 URL completa do avatar:", fullAvatarUrl);

    console.log("🎉 Upload concluído com sucesso!");
    res.status(200).json({
      success: true,
      message: "Avatar enviado com sucesso",
      avatarUri: relativePath,
      avatarUrl: fullAvatarUrl,
    });
  } catch (error: any) {
    console.error("❌ ERRO NO UPLOAD:", error);
    console.error("Stack trace:", error.stack);

    res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    console.log("=== FIM DO PROCESSAMENTO ===\n");
  }
};

export const getAvatar = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findByPk(userId, {
      attributes: ["id", "avatarUri"],
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (!user.avatarUri) {
      return res
        .status(404)
        .json({ error: "Avatar não encontrado para este usuário" });
    }

    res.status(200).json({
      userId: user.id,
      avatarUri: user.avatarUri,
    });
  } catch (error: any) {
    console.error("Erro ao buscar avatar:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteAvatar = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (!user.avatarUri) {
      return res
        .status(404)
        .json({ error: "Avatar não encontrado para este usuário" });
    }

    const filePath = path.join(__dirname, "..", "..", user.avatarUri);
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

    await user.update({ avatarUri: null } as any);

    res.status(200).json({ message: "Avatar deletado com sucesso" });
  } catch (error: any) {
    console.error("Erro ao deletar avatar:", error);
    res.status(500).json({ error: error.message });
  }
};
