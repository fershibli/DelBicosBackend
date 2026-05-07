import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../config/s3Config";

export class S3Service {
  private bucketName = process.env.S3_BUCKET_NAME;

  async listFiles() {
    const command = new ListObjectsV2Command({
      Bucket: this.bucketName,
    });

    const response = await s3Client.send(command);
    return response.Contents?.map(file => ({
      name: file.Key,
      size: file.Size,
      lastModified: file.LastModified
    })) || [];
  }

  async getFileUrl(fileKey: string) {
  const command = new GetObjectCommand({
    Bucket: this.bucketName,
    Key: fileKey,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return url;
}

async generateUploadUrl(fileName: string, fileType: string) {
  const command = new PutObjectCommand({
    Bucket: this.bucketName,
    Key: fileName, 
    ContentType: fileType,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 300 });
}
}