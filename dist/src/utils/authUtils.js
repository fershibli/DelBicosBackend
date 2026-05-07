"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokenAndUserPayload = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Gera um token JWT e o payload do usuário para a resposta do frontend.
 * @param user - A instância do UserModel.
 * @param client - A instância do ClientModel.
 * @param address - A instância do AddressModel (pode ser null).
 */
const generateTokenAndUserPayload = (user, client, address) => {
    const secretKey = process.env.SECRET_KEY || "secret";
    const expiresIn = process.env.EXPIRES_IN || "1h";
    const options = {
        expiresIn: expiresIn,
    };
    const tokenPayload = {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
        },
        client: {
            id: client.id,
            cpf: client.cpf,
        },
        address: address
            ? {
                lat: address.lat,
                lng: address.lng,
                city: address.city,
                state: address.state,
                country_iso: address.country_iso,
            }
            : undefined,
    };
    const token = jsonwebtoken_1.default.sign(tokenPayload, secretKey, options);
    const userPayload = {
        id: user.id,
        client_id: client.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        cpf: client.cpf,
        avatar_uri: user.avatar_uri,
        address: address || null,
    };
    return { token, user: userPayload, address: address || null };
};
exports.generateTokenAndUserPayload = generateTokenAndUserPayload;
