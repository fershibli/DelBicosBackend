import { Router } from "express";
import { proxyUpload } from "../controllers/proxyUpload.controller";

const router = Router();

/**
 * Recebe o binário do frontend e faz o upload para o ImgBB.
 * Usado somente quando STORAGE_PROVIDER=imgbb.
 * O token é gerado pelo ImgBBStorageAdapter no momento do POST /upload-url.
 */
router.put("/:token", proxyUpload);

export default router;
