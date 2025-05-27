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
exports.confirmNumber = void 0;
const User_1 = __importDefault(require("../models/User"));
const confirmNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber } = req.body;
    if (!phoneNumber || phoneNumber.length < 10) {
        return res.status(400).json({ message: 'Número de telefone inválido' });
    }
    try {
        const user = yield User_1.default.findOne({ where: { phoneNumber } });
        if (user) {
            return res.status(200).json({ exists: true, message: 'Usuário existente, envie o código SMS' });
        }
        return res.status(200).json({ exists: false, message: 'Número não registrado, envie o código SMS' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error });
    }
});
exports.confirmNumber = confirmNumber;
