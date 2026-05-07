"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarController = void 0;
const s3Service_1 = require("../services/s3Service");
const User_1 = require("../models/User");
const s3Service = new s3Service_1.S3Service();
exports.AvatarController = {
    listFiles: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const files = yield s3Service.listFiles();
            res.json(files);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    getFileUrl: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { key } = req.params;
            const url = yield s3Service.getFileUrl(key);
            res.json({ url });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    getPresignedUrl: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { fileName, fileType } = req.body;
            const uploadUrl = yield s3Service.generateUploadUrl(fileName, fileType);
            const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
            res.json({ uploadUrl, fileUrl });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    getUserAvatar: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const user = yield User_1.UserModel.findByPk(id, { attributes: ["id", "avatar_uri"] });
            if (!user)
                return res.status(404).json({ error: "Usuário não encontrado" });
            res.json({ avatar_uri: user.avatar_uri });
        }
        catch (error) {
            res.status(500).json({ error: "Erro ao buscar avatar" });
        }
    }),
    updateAvatarDatabase: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.userId;
            const userObject = req.user;
            const { avatar_uri } = req.body;
            console.log("--- DEBUG UPDATE PATH ---");
            console.log("req.userId:", userId);
            console.log("req.user:", userObject);
            console.log("Body:", req.body);
            const finalId = userId || (userObject === null || userObject === void 0 ? void 0 : userObject.id) || (userObject === null || userObject === void 0 ? void 0 : userObject._id);
            if (!finalId) {
                return res.status(401).json({
                    error: "401 - Não foi possível extrair o ID do usuário do token."
                });
            }
            const user = yield User_1.UserModel.findByPk(finalId);
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado no banco." });
            }
            yield user.update({ avatar_uri });
            return res.json({
                mensagem: "Perfil atualizado no banco!",
                avatar_uri
            });
        }
        catch (error) {
            console.error("ERRO NO UPDATE:", error);
            return res.status(500).json({ error: error.message });
        }
    })
};
