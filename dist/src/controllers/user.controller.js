"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserAvatarUri = exports.getAvatarUploadUrl = exports.updateUserProfile = exports.getUserByToken = exports.deleteUser = exports.changePassword = exports.getUserById = exports.logInUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const Address_1 = require("../models/Address");
const Client_1 = require("../models/Client");
const authUtils_1 = require("../utils/authUtils");
const logger_1 = __importStar(require("../utils/logger"));
const loginLog_service_1 = require("../services/loginLog.service");
const s3Service_1 = require("../services/s3Service");
const s3Service = new s3Service_1.S3Service();
const logInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.UserModel.findOne({ where: { email } });
        if (!user) {
            (0, logger_1.logAuth)("login", undefined, email, false, "Usuário não encontrado");
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            (0, logger_1.logAuth)("login", user.id, email, false, "Senha inválida");
            res.status(401).json({ message: "Senha inválida" });
            return;
        }
        const client = yield Client_1.ClientModel.findOne({ where: { user_id: user.id } });
        if (!client) {
            (0, logger_1.logAuth)("login", user.id, email, false, "Cliente não encontrado");
            res.status(404).json({ message: "Cliente não encontrado" });
            return;
        }
        const address = yield Address_1.AddressModel.findByPk(client.main_address_id);
        const { token, user: userPayload } = (0, authUtils_1.generateTokenAndUserPayload)(user, client, address);
        (0, loginLog_service_1.saveLoginLog)(req, {
            userId: user.id,
            username: user.email,
            jwt: token,
        });
        (0, logger_1.logAuth)("login", user.id, email, true);
        logger_1.default.info("Login realizado com sucesso", { userId: user.id, email });
        res.status(200).json({
            message: "Login realizado com sucesso",
            token: token,
            user: userPayload,
        });
    }
    catch (error) {
        (0, logger_1.logError)("Erro ao fazer login", error, { email });
        res.status(500).json({
            message: "Erro interno do servidor",
            error: error instanceof Error ? error.message : "Erro desconhecido",
        });
    }
});
exports.logInUser = logInUser;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.UserModel.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar_uri: user.avatar_uri,
            banner_uri: user.banner_uri,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuário" });
    }
});
exports.getUserById = getUserById;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Declarado fora para o catch enxergar
    try {
        const { current_password, new_password } = req.body;
        if (!current_password || !new_password) {
            res.status(400).json({ message: "Senha atual e nova senha são obrigatórias" });
            return;
        }
        if (!userId) {
            res.status(401).json({ message: "Não autorizado" });
            return;
        }
        const user = yield User_1.UserModel.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(current_password, user.password);
        if (!isMatch) {
            logger_1.default.warn("Tentativa de mudança de senha com senha incorreta", { userId });
            res.status(400).json({ message: "Senha atual incorreta" });
            return;
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashed = yield bcryptjs_1.default.hash(new_password, salt);
        user.password = hashed;
        yield user.save();
        logger_1.default.info("Senha alterada com sucesso", { userId });
        res.status(204).send();
    }
    catch (error) {
        (0, logger_1.logError)("Erro ao alterar senha", error, { userId });
        res.status(500).json({ message: "Erro interno do servidor" });
    }
});
exports.changePassword = changePassword;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield User_1.UserModel.destroy({ where: { id: req.params.id } });
        deleted
            ? res.json({ message: "Usuário deletado com sucesso" })
            : res.status(404).json({ error: "Usuário não encontrado" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao deletar usuário" });
    }
});
exports.deleteUser = deleteUser;
const getUserByToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Declarado fora
    try {
        if (!userId) {
            return res.status(401).json({ error: "Usuário não autenticado" });
        }
        const user = yield User_1.UserModel.findByPk(userId, {
            attributes: ["id", "name", "email", "phone", "avatar_uri", "banner_uri"],
            include: [
                {
                    model: Client_1.ClientModel,
                    as: "Client",
                    attributes: ["id", "cpf"],
                },
            ],
        });
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        res.status(200).json({ user });
    }
    catch (error) {
        (0, logger_1.logError)("Erro ao buscar usuário pelo token", error, { userId });
        res.status(500).json({ error: error.message });
    }
});
exports.getUserByToken = getUserByToken;
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Declarado fora
    if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado." });
    }
    const { name, email, phone } = req.body;
    try {
        const user = yield User_1.UserModel.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }
        if (email && email !== user.email) {
            const emailExists = yield User_1.UserModel.findOne({ where: { email } });
            if (emailExists) {
                return res.status(409).json({ error: "Este e-mail já está em uso." });
            }
        }
        if (name)
            user.name = name;
        if (email)
            user.email = email;
        if (phone)
            user.phone = phone;
        yield user.save();
        return res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar_uri: user.avatar_uri,
            banner_uri: user.banner_uri,
        });
    }
    catch (error) {
        (0, logger_1.logError)("Erro ao atualizar perfil", error, { userId });
        return res.status(500).json({
            error: "Erro interno ao atualizar perfil.",
            details: error.message,
        });
    }
});
exports.updateUserProfile = updateUserProfile;
/**
 * NOVAS FUNÇÕES PARA PoC S3 (AWS)
 */
const getAvatarUploadUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileName, fileType } = req.body;
        if (!fileName || !fileType) {
            return res.status(400).json({ error: "fileName e fileType são obrigatórios" });
        }
        const uploadUrl = yield s3Service.generateUploadUrl(fileName, fileType);
        const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        res.json({ uploadUrl, fileUrl });
    }
    catch (error) {
        (0, logger_1.logError)("Erro ao gerar URL do S3", error);
        res.status(500).json({ error: error.message });
    }
});
exports.getAvatarUploadUrl = getAvatarUploadUrl;
const updateUserAvatarUri = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { avatar_uri } = req.body;
    try {
        if (!avatar_uri)
            return res.status(400).json({ error: "avatar_uri é obrigatório" });
        const user = yield User_1.UserModel.findByPk(userId);
        if (!user)
            return res.status(404).json({ error: "Usuário não encontrado" });
        yield user.update({ avatar_uri });
        res.json({
            message: "URI do avatar atualizada com sucesso!",
            user: { id: user.id, avatar_uri: user.avatar_uri }
        });
    }
    catch (error) {
        (0, logger_1.logError)("Erro ao atualizar URI do avatar", error, { userId });
        res.status(500).json({ error: error.message });
    }
});
exports.updateUserAvatarUri = updateUserAvatarUri;
