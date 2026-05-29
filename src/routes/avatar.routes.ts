import { Router } from "express";

import { AvatarController } from "../controllers/avatar.controller";

import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/upload-url",
  authMiddleware,
  AvatarController.getPresignedUrl
);

router.patch(
  "/update-path",
  authMiddleware,
  AvatarController.updateAvatarDatabase
);

router.get(
  "/:id",
  authMiddleware,
  AvatarController.getUserAvatar
);

export default router;