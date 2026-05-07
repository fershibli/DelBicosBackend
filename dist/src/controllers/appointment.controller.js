"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppointmentInvoice = exports.reviewAppointment = exports.confirmAppointment = exports.getAllAppointments = exports.createAppointment = void 0;
const Appointment_1 = require("../models/Appointment");
const User_1 = require("../models/User");
const Client_1 = require("../models/Client");
const Professional_1 = require("../models/Professional");
const Service_1 = require("../models/Service");
const Notification_1 = require("../models/Notification");
const Address_1 = require("../models/Address");
const Subcategory_1 = require("../models/Subcategory");
const logger_1 = __importStar(require("../utils/logger"));
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("pt-BR");
const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
});
const createAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointment = yield Appointment_1.AppointmentModel.create(req.body);
        const professional = yield Professional_1.ProfessionalModel.findByPk(appointment.professional_id);
        const client = yield Client_1.ClientModel.findByPk(appointment.client_id);
        const service = yield Service_1.ServiceModel.findByPk(appointment.service_id);
        if (!professional || !client || !service) {
            logger_1.default.warn("Missing linked data for notification trigger", {
                appointmentId: appointment.id,
            });
        }
        else {
            const clientUser = yield User_1.UserModel.findByPk(client.user_id);
            const professionalUser = yield User_1.UserModel.findByPk(professional.user_id);
            const appointmentTime = appointment.start_time.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            });
            const appointmentDate = appointment.start_time.toLocaleDateString("pt-BR");
            if (professionalUser) {
                yield Notification_1.NotificationModel.create({
                    user_id: professionalUser.id,
                    title: "Novo Agendamento Recebido",
                    message: `Você recebeu um novo agendamento de ${(clientUser === null || clientUser === void 0 ? void 0 : clientUser.name) || "Cliente Desconhecido"} para o serviço '${service.title}' no dia ${appointmentDate} às ${appointmentTime}. Status: Pendente de Confirmação.`,
                    notification_type: "appointment",
                    related_entity_id: appointment.id,
                    is_read: false,
                });
            }
            if (clientUser) {
                yield Notification_1.NotificationModel.create({
                    user_id: clientUser.id,
                    title: "Agendamento Criado com Sucesso",
                    message: `Seu agendamento para o serviço '${service.title}' no dia ${appointmentDate} às ${appointmentTime} foi criado. Aguardando confirmação do profissional.`,
                    notification_type: "appointment",
                    related_entity_id: appointment.id,
                    is_read: false,
                });
            }
        }
        logger_1.default.info("Appointment criado com sucesso", {
            appointmentId: appointment.id,
            clientId: appointment.client_id,
            professionalId: appointment.professional_id,
        });
        res.status(201).json(appointment);
    }
    catch (error) {
        (0, logger_1.logError)("Erro ao criar appointment", error);
        res.status(400).json({ error: error.message });
    }
});
exports.createAppointment = createAppointment;
const getAllAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const user = yield User_1.UserModel.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        const client = yield Client_1.ClientModel.findOne({ where: { user_id: userId } });
        const whereClause = {};
        if (client) {
            whereClause.client_id = client.id;
        }
        else {
            return res.json([]);
        }
        const appointments = yield Appointment_1.AppointmentModel.findAll({
            where: whereClause,
            include: [
                { model: Service_1.ServiceModel, as: "Service" },
                {
                    model: Client_1.ClientModel,
                    as: "Client",
                    include: [
                        {
                            model: User_1.UserModel,
                            as: "User",
                            attributes: ["name", "avatar_uri"],
                        },
                    ],
                },
                {
                    model: Professional_1.ProfessionalModel,
                    as: "Professional",
                    include: [
                        {
                            model: User_1.UserModel,
                            as: "User",
                            attributes: ["name", "avatar_uri"],
                        },
                    ],
                },
            ],
            order: [["start_time", "ASC"]],
        });
        res.json(appointments);
    }
    catch (error) {
        (0, logger_1.logError)("Erro ao buscar appointments", error, { userId });
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
exports.getAllAppointments = getAllAppointments;
const confirmAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const appointment = yield Appointment_1.AppointmentModel.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ error: "Agendamento não encontrado" });
        }
        if (appointment.status !== "pending") {
            return res.status(400).json({
                error: `Não é possível aceitar um agendamento com status '${appointment.status}'`,
            });
        }
        appointment.status = "confirmed";
        yield appointment.save();
        logger_1.default.info("Appointment confirmado", { appointmentId: id });
        res.json(appointment);
    }
    catch (error) {
        (0, logger_1.logError)("Erro ao confirmar agendamento", error, { appointmentId: id });
        res.status(500).json({ error: "Erro ao confirmar agendamento" });
    }
});
exports.confirmAppointment = confirmAppointment;
const reviewAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { id } = req.params;
    const { rating, review } = req.body;
    const authReq = req;
    try {
        if (!rating) {
            return res.status(400).json({
                error: "O campo 'rating' é obrigatório",
            });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                error: "A avaliação deve estar entre 1 e 5",
            });
        }
        if (review && review.length > 500) {
            return res.status(400).json({
                error: "O comentário deve ter no máximo 500 caracteres",
            });
        }
        const appointment = yield Appointment_1.AppointmentModel.findByPk(id, {
            include: [
                {
                    model: Client_1.ClientModel,
                    as: "Client",
                    include: [{ model: User_1.UserModel, as: "User" }],
                },
            ],
        });
        if (!appointment) {
            return res.status(404).json({ error: "Agendamento não encontrado" });
        }
        if (appointment.status !== "completed") {
            return res.status(400).json({
                error: `Não é possível avaliar um agendamento com status '${appointment.status}'`,
            });
        }
        const authenticatedUserId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!authenticatedUserId) {
            return res.status(401).json({ error: "Usuário não autenticado" });
        }
        const apptData = appointment;
        const clientUserId = (_c = (_b = apptData.Client) === null || _b === void 0 ? void 0 : _b.User) === null || _c === void 0 ? void 0 : _c.id;
        if (clientUserId !== authenticatedUserId) {
            return res.status(403).json({
                error: "Você não tem permissão para avaliar este agendamento",
            });
        }
        const isUpdate = appointment.rating !== null && appointment.rating !== undefined;
        appointment.rating = rating;
        appointment.review = review || null;
        yield appointment.save();
        if (!isUpdate) {
            const professional = yield Professional_1.ProfessionalModel.findByPk(appointment.professional_id);
            if (professional) {
                const professionalUser = yield User_1.UserModel.findByPk(professional.user_id);
                const service = yield Service_1.ServiceModel.findByPk(appointment.service_id);
                if (professionalUser) {
                    yield Notification_1.NotificationModel.create({
                        user_id: professionalUser.id,
                        title: "Nova Avaliação Recebida",
                        message: `Você recebeu uma avaliação de ${rating} estrelas${service ? ` para o serviço '${service.title}'` : ""}${review ? `: "${review}"` : "."}`,
                        notification_type: "service",
                        related_entity_id: appointment.id,
                        is_read: false,
                    });
                }
            }
        }
        res.json({
            success: true,
            message: isUpdate
                ? "Avaliação atualizada com sucesso"
                : "Avaliação registrada com sucesso",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao avaliar agendamento" });
    }
});
exports.reviewAppointment = reviewAppointment;
const getAppointmentInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const authReq = req;
    try {
        const appointmentId = Number(req.params.id);
        const authenticatedUserId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!authenticatedUserId) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }
        if (isNaN(appointmentId)) {
            return res.status(400).json({ error: "ID do agendamento inválido." });
        }
        const client = yield Client_1.ClientModel.findOne({
            where: { user_id: authenticatedUserId },
        });
        if (!client) {
            return res.status(404).json({ error: "Cliente não encontrado." });
        }
        const appointment = yield Appointment_1.AppointmentModel.findOne({
            where: {
                id: appointmentId,
                client_id: client.id,
            },
            include: [
                {
                    model: Service_1.ServiceModel,
                    as: "Service",
                    include: [{ model: Subcategory_1.SubCategoryModel, as: "Subcategory" }],
                },
                {
                    model: Client_1.ClientModel,
                    as: "Client",
                    include: [{ model: User_1.UserModel, as: "User" }],
                },
                {
                    model: Professional_1.ProfessionalModel,
                    as: "Professional",
                    include: [{ model: User_1.UserModel, as: "User" }],
                },
                {
                    model: Address_1.AddressModel,
                    as: "Address",
                },
            ],
        });
        if (!appointment) {
            return res.status(404).json({
                error: "Agendamento não encontrado ou não pertence a este usuário.",
            });
        }
        const apptData = appointment;
        const invoice = {
            invoiceNumber: `NF${appointment.id.toString().padStart(6, "0")}`,
            date: formatDate(appointment.createdAt),
            customerName: ((_c = (_b = apptData.Client) === null || _b === void 0 ? void 0 : _b.User) === null || _c === void 0 ? void 0 : _c.name) || "Cliente não encontrado",
            customerCpf: ((_d = apptData.Client) === null || _d === void 0 ? void 0 : _d.cpf) || "CPF não encontrado",
            customerAddress: apptData.Address
                ? `${apptData.Address.street}, ${apptData.Address.number} - ${apptData.Address.neighborhood} - ${apptData.Address.city}/${apptData.Address.state}`
                : "Endereço não fornecido",
            professionalName: ((_f = (_e = apptData.Professional) === null || _e === void 0 ? void 0 : _e.User) === null || _f === void 0 ? void 0 : _f.name) || "Profissional não encontrado",
            professionalCpf: ((_g = apptData.Professional) === null || _g === void 0 ? void 0 : _g.cpf) || "CPF/CNPJ não encontrado",
            serviceName: ((_h = apptData.Service) === null || _h === void 0 ? void 0 : _h.title) || "Serviço não encontrado",
            serviceDescription: ((_j = apptData.Service) === null || _j === void 0 ? void 0 : _j.description) || "",
            servicePrice: parseFloat(((_k = apptData.Service) === null || _k === void 0 ? void 0 : _k.price) || "0"),
            serviceDate: formatDate(appointment.start_time),
            serviceTime: `${formatTime(appointment.start_time)} - ${formatTime(appointment.end_time)}`,
            total: parseFloat(((_l = apptData.Service) === null || _l === void 0 ? void 0 : _l.price) || "0"),
            paymentMethod: "Cartão de Crédito",
            transactionId: appointment.payment_intent_id || "N/A",
        };
        res.json(invoice);
    }
    catch (error) {
        console.error("Erro ao gerar invoice:", error);
        res
            .status(500)
            .json({ error: "Erro ao gerar invoice", details: error.message });
    }
});
exports.getAppointmentInvoice = getAppointmentInvoice;
