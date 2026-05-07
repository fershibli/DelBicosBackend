"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = __importDefault(require("@sendgrid/mail"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey) {
    console.error("Chave de API do SendGrid não encontrada. Verifique o arquivo .env");
    process.exit(1); // Encerra a aplicação se a chave não estiver configurada
}
mail_1.default.setApiKey(apiKey);
exports.default = mail_1.default;
