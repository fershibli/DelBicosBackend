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
exports.checkFavorite = exports.removeFavorite = exports.addFavorite = exports.getFavorites = void 0;
const Favorite_1 = require("../models/Favorite");
const Professional_1 = require("../models/Professional");
const User_1 = require("../models/User");
const getFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authReq = req;
    try {
        const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ error: "Usuário não autenticado" });
        }
        const favorites = yield Favorite_1.FavoriteModel.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Professional_1.ProfessionalModel,
                    as: "Professional",
                    include: [
                        {
                            model: User_1.UserModel,
                            as: "User",
                            attributes: ["name", "avatar_uri"],
                        },
                    ],
                },
            ],
            order: [["created_at", "DESC"]],
        });
        const favoritesData = favorites.map((fav) => {
            var _a, _b, _c, _d;
            return ({
                id: fav.id,
                professionalId: fav.professional_id,
                professionalName: ((_b = (_a = fav.Professional) === null || _a === void 0 ? void 0 : _a.User) === null || _b === void 0 ? void 0 : _b.name) || "Nome não disponível",
                professionalAvatar: ((_d = (_c = fav.Professional) === null || _c === void 0 ? void 0 : _c.User) === null || _d === void 0 ? void 0 : _d.avatar_uri) || null,
                addedAt: fav.createdAt,
            });
        });
        return res.status(200).json({ favorites: favoritesData });
    }
    catch (error) {
        console.error("Erro ao buscar favoritos:", error);
        return res.status(500).json({ error: "Erro ao buscar favoritos" });
    }
});
exports.getFavorites = getFavorites;
const addFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authReq = req;
    try {
        const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a.id;
        const { professionalId } = req.body;
        if (!userId) {
            return res.status(401).json({ error: "Usuário não autenticado" });
        }
        if (!professionalId) {
            return res.status(400).json({ error: "professionalId é obrigatório" });
        }
        const professional = yield Professional_1.ProfessionalModel.findByPk(professionalId);
        if (!professional) {
            return res.status(404).json({ error: "Profissional não encontrado" });
        }
        const existing = yield Favorite_1.FavoriteModel.findOne({
            where: {
                user_id: userId,
                professional_id: professionalId,
            },
        });
        if (existing) {
            return res
                .status(409)
                .json({ error: "Profissional já está nos favoritos" });
        }
        const favorite = yield Favorite_1.FavoriteModel.create({
            user_id: userId,
            professional_id: professionalId,
        });
        return res.status(201).json({
            id: favorite.id,
            userId: favorite.user_id,
            professionalId: favorite.professional_id,
            createdAt: favorite.createdAt,
        });
    }
    catch (error) {
        console.error("Erro ao adicionar favorito:", error);
        return res.status(500).json({ error: "Erro ao adicionar favorito" });
    }
});
exports.addFavorite = addFavorite;
const removeFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authReq = req;
    try {
        const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a.id;
        const { professionalId } = req.params;
        if (!userId) {
            return res.status(401).json({ error: "Usuário não autenticado" });
        }
        const deleted = yield Favorite_1.FavoriteModel.destroy({
            where: {
                user_id: userId,
                professional_id: professionalId,
            },
        });
        if (deleted === 0) {
            return res.status(404).json({ error: "Favorito não encontrado" });
        }
        return res.status(200).json({ message: "Favorito removido com sucesso" });
    }
    catch (error) {
        console.error("Erro ao remover favorito:", error);
        return res.status(500).json({ error: "Erro ao remover favorito" });
    }
});
exports.removeFavorite = removeFavorite;
const checkFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authReq = req;
    try {
        const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a.id;
        const { professionalId } = req.params;
        if (!userId) {
            return res.status(401).json({ error: "Usuário não autenticado" });
        }
        const favorite = yield Favorite_1.FavoriteModel.findOne({
            where: {
                user_id: userId,
                professional_id: professionalId,
            },
        });
        return res.status(200).json({ isFavorite: !!favorite });
    }
    catch (error) {
        console.error("Erro ao verificar favorito:", error);
        return res.status(500).json({ error: "Erro ao verificar favorito" });
    }
});
exports.checkFavorite = checkFavorite;
