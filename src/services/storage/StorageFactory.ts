import { StorageAdapter } from "./StorageAdapter";
import { S3StorageAdapter } from "./S3StorageAdapter";
import { ImgBBStorageAdapter } from "./ImgBBStorageAdapter";

let instance: StorageAdapter | null = null;

export function getStorageAdapter(): StorageAdapter {
  if (instance) return instance;

  const provider = process.env.STORAGE_PROVIDER || "s3";

  if (provider === "imgbb") {
    instance = new ImgBBStorageAdapter();
  } else {
    instance = new S3StorageAdapter();
  }

  return instance;
}
