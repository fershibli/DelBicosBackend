"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationCode = void 0;
/**
 * Gera um código de verificação numérico de 6 dígitos.
 * @returns {string} Uma string contendo o código de 6 dígitos.
 */
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateVerificationCode = generateVerificationCode;
