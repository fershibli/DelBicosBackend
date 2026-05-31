import { StorageAdapter, UploadUrlResult } from "./StorageAdapter";
import { S3Service } from "../s3Service";

export class S3StorageAdapter implements StorageAdapter {
  private s3 = new S3Service();

  async generateUploadUrl(
    fileName: string,
    fileType: string,
  ): Promise<UploadUrlResult> {
    const uploadUrl = await this.s3.generateUploadUrl(fileName, fileType);
    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    return { uploadUrl, fileUrl };
  }

  async getFileUrl(key: string): Promise<string> {
    return this.s3.getFileUrl(key);
  }

  async listFiles() {
    return this.s3.listFiles();
  }
}
