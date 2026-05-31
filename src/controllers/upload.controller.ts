import { Response } from "express";
import { AuthenticatedRequest } from "../interfaces/authentication.interface";
import { S3Service } from "../services/s3Service";

const s3Service = new S3Service();

/**
 * POST /api/uploads
 * Body: { fileName: string, fileType: string }
 * Retorna uma presigned URL para upload direto no S3 e a URL pública do arquivo.
 *
 * O frontend deve:
 * 1. Chamar este endpoint para obter uploadUrl e fileUrl
 * 2. Fazer PUT na uploadUrl com o arquivo binário
 * 3. Salvar fileUrl como banner_uri no serviço
 */
export const getUploadUrl = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const body = req.body as {
      fileName?: string;
      fileType?: string;
      filename?: string; // alias enviado pelo frontend
      contentType?: string; // alias enviado pelo frontend
    };

    // Aceita ambos os nomes de campo (frontend e backend)
    const fileName = (body.fileName || body.filename || "").trim();
    const fileType = (body.fileType || body.contentType || "").trim();

    if (!fileName)
      return res.status(400).json({ error: "fileName é obrigatório" });
    if (!fileType)
      return res.status(400).json({ error: "fileType é obrigatório" });

    // Previne path traversal: usar apenas o basename
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `uploads/${Date.now()}_${safeName}`;

    const uploadUrl = await s3Service.generateUploadUrl(key, fileType);
    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    // Retorna ambos os nomes de campo para compatibilidade com frontend e backend
    return res.json({
      uploadUrl,
      url: fileUrl,
      presignedUrl: uploadUrl, // alias esperado pelo frontend
      fileUrl, // alias esperado pelo frontend
    });
  } catch (error: any) {
    console.error("Erro getUploadUrl:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};
