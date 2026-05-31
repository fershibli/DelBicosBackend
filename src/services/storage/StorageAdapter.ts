export interface UploadUrlResult {
  /** URL para onde o frontend deve fazer PUT com o binário */
  uploadUrl: string;
  /**
   * URL pública final do arquivo.
   * - S3: já conhecida antes do upload (baseada no bucket/key)
   * - ImgBB: null antes do upload; o proxy retornará o valor real na resposta do PUT
   */
  fileUrl: string | null;
}

export interface StorageAdapter {
  /**
   * Gera os endereços de upload para um arquivo.
   * @param fileName  Nome/key do arquivo (ex: "uploads/123_avatar.jpg")
   * @param fileType  MIME type (ex: "image/jpeg")
   */
  generateUploadUrl(
    fileName: string,
    fileType: string,
  ): Promise<UploadUrlResult>;

  /**
   * Retorna a URL de visualização de um arquivo já armazenado.
   * @param key Identificador do arquivo no provider
   */
  getFileUrl(key: string): Promise<string>;

  /**
   * Lista todos os arquivos armazenados (usado para debug).
   */
  listFiles(): Promise<
    {
      name: string | undefined;
      size: number | undefined;
      lastModified: Date | undefined;
    }[]
  >;
}
