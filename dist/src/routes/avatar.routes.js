"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const avatar_controller_1 = require("../controllers/avatar.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = (0, express_1.Router)();
/**
 * Rotas de Gerenciamento de Arquivos e Avatar (S3 + Neon)
 */
// Listar arquivos no bucket (útil para debug)
router.get("/files", auth_middleware_1.default, avatar_controller_1.AvatarController.listFiles);
// Obter URL de visualização de qualquer arquivo no S3
router.get("/files/:key", auth_middleware_1.default, avatar_controller_1.AvatarController.getFileUrl);
// 1. Gera a URL assinada para o Frontend fazer o PUT direto no S3
router.post("/upload-url", auth_middleware_1.default, avatar_controller_1.AvatarController.getPresignedUrl);
// 2. Busca o avatar_uri atual do usuário no Neon
router.get("/:id", auth_middleware_1.default, avatar_controller_1.AvatarController.getUserAvatar);
// 3. Atualiza o campo avatar_uri no Neon após o upload bem sucedido
router.patch("/update-path", auth_middleware_1.default, avatar_controller_1.AvatarController.updateAvatarDatabase);
exports.default = router;
