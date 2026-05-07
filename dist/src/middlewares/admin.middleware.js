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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = adminAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = require("../models/Admin");
function adminAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token)
            return res.status(401).json({ msg: 'Acesso negado. É obrigatório o envio de token JWT' });
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || 'secret') || {};
            const user = decoded.user;
            if (!user || !user.id)
                return res.status(403).json({ msg: 'Token inválido' });
            const isAdmin = yield Admin_1.AdminModel.findOne({ where: { user_id: user.id } });
            if (!isAdmin)
                return res.status(403).json({ msg: 'Acesso negado: somente administradores' });
            // attach minimal user
            req.user = user;
            next();
        }
        catch (error) {
            return res.status(403).json({ msg: 'Token inválido' });
        }
    });
}
