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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAddressForAuthenticatedUser = exports.updateAddressForAuthenticatedUser = exports.createAddressForAuthenticatedUser = exports.getAddressesForAuthenticatedUser = exports.getAllAddressByUserId = void 0;
const Address_1 = require("../models/Address");
const Client_1 = require("../models/Client");
const getAllAddressByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const addresses = yield Address_1.AddressModel.findAll({
            where: {
                user_id: userId,
                active: true,
            },
            order: [["createdAt", "DESC"]],
        });
        res.json(addresses);
    }
    catch (error) {
        console.error("Erro ao buscar endereços:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
exports.getAllAddressByUserId = getAllAddressByUserId;
const getAddressesForAuthenticatedUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const client = yield Client_1.ClientModel.findOne({ where: { user_id: userId } });
        const mainAddressId = client === null || client === void 0 ? void 0 : client.main_address_id;
        const addresses = yield Address_1.AddressModel.findAll({
            where: { user_id: userId },
            order: [["created_at", "DESC"]],
        });
        const addressesWithPrimaryFlag = addresses.map((addr) => {
            const addrJSON = addr.toJSON();
            return Object.assign(Object.assign({}, addrJSON), { isPrimary: addr.id === mainAddressId });
        });
        res.json(addressesWithPrimaryFlag);
    }
    catch (error) {
        console.error("Erro ao buscar endereços do usuário autenticado:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
exports.getAddressesForAuthenticatedUser = getAddressesForAuthenticatedUser;
const createAddressForAuthenticatedUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const payload = Object.assign(Object.assign({}, req.body), { user_id: userId });
        const address = yield Address_1.AddressModel.create(payload);
        res.status(201).json(address);
    }
    catch (error) {
        console.error("Erro ao criar endereço para usuário autenticado:", error);
        res.status(400).json({ error: error.message });
    }
});
exports.createAddressForAuthenticatedUser = createAddressForAuthenticatedUser;
const updateAddressForAuthenticatedUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const addressId = Number(req.params.id);
    if (!addressId || Number.isNaN(addressId)) {
        res.status(400).json({ error: "ID de endereço inválido" });
        return;
    }
    try {
        const address = yield Address_1.AddressModel.findByPk(addressId);
        if (!address) {
            res.status(404).json({ error: "Endereço não encontrado" });
            return;
        }
        if (address.user_id !== userId) {
            res.status(403).json({ error: "Ação não permitida" });
            return;
        }
        const _b = req.body, { user_id, id, isPrimary } = _b, updatable = __rest(_b, ["user_id", "id", "isPrimary"]);
        yield address.update(updatable);
        if (isPrimary === true) {
            const client = yield Client_1.ClientModel.findOne({ where: { user_id: userId } });
            if (client) {
                yield client.update({ main_address_id: address.id });
            }
        }
        res.json(address);
    }
    catch (error) {
        console.error("Erro ao atualizar endereço do usuário autenticado:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
exports.updateAddressForAuthenticatedUser = updateAddressForAuthenticatedUser;
const deleteAddressForAuthenticatedUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const addressId = Number(req.params.id);
    if (!addressId || Number.isNaN(addressId)) {
        res.status(400).json({ error: "ID de endereço inválido" });
        return;
    }
    try {
        const address = yield Address_1.AddressModel.findByPk(addressId);
        if (!address) {
            res.status(404).json({ error: "Endereço não encontrado" });
            return;
        }
        if (address.user_id !== userId) {
            res.status(403).json({ error: "Ação não permitida" });
            return;
        }
        yield address.destroy();
        res.json({ message: "Endereço deletado" });
    }
    catch (error) {
        console.error("Erro ao deletar endereço do usuário autenticado:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
exports.deleteAddressForAuthenticatedUser = deleteAddressForAuthenticatedUser;
