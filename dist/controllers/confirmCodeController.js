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
exports.verifyCode = void 0;
const User_1 = __importDefault(require("../models/User"));
const verifyCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, code } = req.body;
    if (!phoneNumber || !code || code.length !== 4) {
        return res.status(400).json({ message: 'Código ou número inválido' });
    }
    try {
        const user = yield User_1.default.findOne({ where: { phoneNumber } });
        if (user) {
            return res.status(200).json({
                exists: true,
                user: { name: user.firstName, location: user.location },
            });
        }
        return res.status(200).json({ exists: false });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error });
    }
});
exports.verifyCode = verifyCode;
