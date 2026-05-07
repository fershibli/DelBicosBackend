"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const favorite_controller_1 = require("../controllers/favorite.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.default, favorite_controller_1.getFavorites);
router.post("/", auth_middleware_1.default, favorite_controller_1.addFavorite);
router.delete("/:professionalId", auth_middleware_1.default, favorite_controller_1.removeFavorite);
router.get("/check/:professionalId", auth_middleware_1.default, favorite_controller_1.checkFavorite);
exports.default = router;
