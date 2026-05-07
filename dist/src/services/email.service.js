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
exports.EmailService = void 0;
const sendgrid_1 = __importDefault(require("../config/sendgrid"));
exports.EmailService = {
    sendTransactionalEmail: (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, html, }) {
        var _b;
        const fromEmail = process.env.SENDER_EMAIL_VERIFICADO;
        if (!fromEmail) {
            console.error("E-mail remetente verificado não encontrado no .env");
            return false;
        }
        const msg = {
            to,
            from: fromEmail,
            subject,
            html,
        };
        try {
            yield sendgrid_1.default.send(msg);
            return true;
        }
        catch (error) {
            console.error("Erro ao enviar e-mail pelo serviço:", error);
            if (typeof error === "object" && error !== null && "response" in error) {
                const err = error;
                console.error((_b = err.response) === null || _b === void 0 ? void 0 : _b.body);
            }
            return false;
        }
    }),
};
