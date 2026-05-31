import crypto from "crypto";
import { StorageAdapter, UploadUrlResult } from "./StorageAdapter";

interface PendingUpload {
  fileType: string;
  expiresAt: number;
}

/**
 * Armazena os tokens de upload pendentes em memória.
 * Chave: token UUID  |  Valor: metadados do upload esperado
 */
export const pendingUploads = new Map<string, PendingUpload>();

/** TTL dos tokens em ms (5 minutos) */
const TOKEN_TTL_MS = 5 * 60 * 1000;

export class ImgBBStorageAdapter implements StorageAdapter {
  async generateUploadUrl(
    fileName: string,
    fileType: string,
  ): Promise<UploadUrlResult> {
    const token = crypto.randomUUID();
    pendingUploads.set(token, {
      fileType,
      expiresAt: Date.now() + TOKEN_TTL_MS,
    });

    // Caminho relativo — o frontend detecta que começa com "/" e usa o backendHttpClient
    const uploadUrl = `/api/proxy-upload/${token}`;

    // fileUrl não é conhecido antes do upload no ImgBB
    return { uploadUrl, fileUrl: null };
  }

  async getFileUrl(key: string): Promise<string> {
    // No ImgBB a URL já é pública e permanente — key é a própria URL
    return key;
  }

  async listFiles() {
    // ImgBB não tem API de listagem acessível — retorna vazio
    return [];
  }
}
