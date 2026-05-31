import { Request, Response } from "express";
import { pendingUploads } from "../services/storage/ImgBBStorageAdapter";
import { v4 as uuidv4 } from "uuid";

/**
 * PUT /api/proxy-upload/:token
 *
 * Recebe o binário enviado pelo frontend, encaminha ao ImgBB e retorna a URL pública.
 * Esse endpoint só é ativado quando STORAGE_PROVIDER=imgbb.
 */
export const proxyUpload = async (req: Request, res: Response) => {
  const { token } = req.params;

  const pending = pendingUploads.get(token);
  if (!pending) {
    return res
      .status(404)
      .json({ error: "Token de upload inválido ou expirado" });
  }

  if (Date.now() > pending.expiresAt) {
    pendingUploads.delete(token);
    return res.status(410).json({ error: "Token de upload expirado" });
  }

  pendingUploads.delete(token);

  // Coleta o corpo da requisição como Buffer
  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", resolve);
    req.on("error", reject);
  });

  const buffer = Buffer.concat(chunks);
  if (buffer.length === 0) {
    return res.status(400).json({ error: "Corpo da requisição vazio" });
  }

  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "IMGBB_API_KEY não configurada" });
  }

  const base64 = buffer.toString("base64");
  const imageName = uuidv4();

  const body = new URLSearchParams({
    key: apiKey,
    image: base64,
    name: imageName,
  });

  const imgbbResponse = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body,
  });

  const data = (await imgbbResponse.json()) as {
    success: boolean;
    data?: { url: string };
    error?: { message: string };
  };

  if (!data.success || !data.data?.url) {
    return res.status(502).json({
      error: data.error?.message || "Falha ao enviar imagem para o ImgBB",
    });
  }

  return res.json({ fileUrl: data.data.url });
};
