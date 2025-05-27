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
exports.updateUser = exports.getUserById = exports.getAllUsers = exports.getUser = void 0;
const User_1 = __importDefault(require("../models/User"));
// import { UserInterface } from '../interfaces'; // Removed because UserInterface does not exist
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber } = req.params;
    try {
        const user = yield User_1.default.findOne({ where: { phoneNumber } });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json({
            name: user.firstName,
            location: user.location,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error });
    }
});
exports.getUser = getUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.findAll();
        res.status(200).json(users.map((user) => ({
            id: user.id,
            name: user.firstName,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        })));
    }
    catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error });
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield User_1.default.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json({
            id: user.id,
            name: user.firstName,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error });
    }
});
exports.getUserById = getUserById;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { firstName, email } = req.body;
    try {
        const user = yield User_1.default.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        yield user.update({ firstName, email });
        res.status(200).json({
            id: user.id,
            name: user.firstName,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error });
    }
});
exports.updateUser = updateUser;
