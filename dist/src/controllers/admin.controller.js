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
exports.getAdminStats = exports.adminLogin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const Admin_1 = require("../models/Admin");
const database_1 = require("../config/database");
const sequelize_1 = require("sequelize");
// Removidos imports não usados (AppointmentModel, ProfessionalModel, Op, Sequelize)
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: "Email e senha obrigatórios" });
    try {
        const user = yield User_1.UserModel.findOne({ where: { email } });
        if (!user)
            return res.status(404).json({ error: "Usuário não encontrado" });
        const isValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isValid)
            return res.status(401).json({ error: "Senha inválida" });
        const isAdmin = yield Admin_1.AdminModel.findOne({ where: { user_id: user.id } });
        if (!isAdmin)
            return res
                .status(403)
                .json({ error: "Apenas administradores têm acesso" });
        const payload = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
            admin: true,
        };
        const secret = process.env.SECRET_KEY || "secret";
        const expiresIn = process.env.EXPIRES_IN || "1h";
        const options = {
            expiresIn: expiresIn,
        };
        const token = jsonwebtoken_1.default.sign(payload, secret, options);
        return res
            .status(200)
            .json({
            token,
            user: { id: user.id, name: user.name, email: user.email, admin: true },
        });
    }
    catch (error) {
        console.error("Admin login error", error);
        return res.status(500).json({ error: "Erro interno" });
    }
});
exports.adminLogin = adminLogin;
const getAdminStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const year = Number(req.query.year) || new Date().getFullYear();
        const usersSql = `
      SELECT EXTRACT(MONTH FROM created_at) AS month, COUNT(id) AS count
      FROM "users"
      WHERE EXTRACT(YEAR FROM created_at) = :year
      GROUP BY month
      ORDER BY month
    `;
        const professionalsSql = `
      SELECT EXTRACT(MONTH FROM created_at) AS month, COUNT(id) AS count
      FROM professional
      WHERE EXTRACT(YEAR FROM created_at) = :year
      GROUP BY month
      ORDER BY month
    `;
        const appointmentsSql = `
      SELECT EXTRACT(MONTH FROM created_at) AS month, status, COUNT(id) AS count
      FROM appointment
      WHERE EXTRACT(YEAR FROM created_at) = :year
      GROUP BY month, status
      ORDER BY month
    `;
        const servicesSummarySql = `
      SELECT status, COUNT(id) AS count
      FROM appointment
      WHERE EXTRACT(YEAR FROM created_at) = :year
      GROUP BY status
    `;
        const users = (yield database_1.sequelize.query(usersSql, {
            replacements: { year },
            type: sequelize_1.QueryTypes.SELECT,
        }));
        const professionals = (yield database_1.sequelize.query(professionalsSql, {
            replacements: { year },
            type: sequelize_1.QueryTypes.SELECT,
        }));
        const appointments = (yield database_1.sequelize.query(appointmentsSql, {
            replacements: { year },
            type: sequelize_1.QueryTypes.SELECT,
        }));
        const servicesSummaryRows = (yield database_1.sequelize.query(servicesSummarySql, { replacements: { year }, type: sequelize_1.QueryTypes.SELECT }));
        const servicesSummary = {
            pending: 0,
            confirmed: 0,
            completed: 0,
            canceled: 0,
            total: 0,
        };
        for (const row of servicesSummaryRows) {
            const status = String(row.status);
            servicesSummary[status] = Number(row.count || 0);
            servicesSummary.total += Number(row.count || 0);
        }
        const months = Array.from({ length: 12 }, (_, i) => ({ month: i + 1 }));
        const usersByMonth = months.map((m) => ({
            month: m.month,
            count: Number((users.find((u) => Number(u.month) === m.month) || { count: 0 }).count),
        }));
        const professionalsByMonth = months.map((m) => ({
            month: m.month,
            count: Number((professionals.find((p) => Number(p.month) === m.month) || { count: 0 })
                .count),
        }));
        const appointmentsByMonth = months.map((m) => {
            const month = m.month;
            const pending = Number((appointments.find((a) => Number(a.month) === month && a.status === "pending") || { count: 0 }).count || 0);
            const confirmed = Number((appointments.find((a) => Number(a.month) === month && a.status === "confirmed") || { count: 0 }).count || 0);
            const completed = Number((appointments.find((a) => Number(a.month) === month && a.status === "completed") || { count: 0 }).count || 0);
            const canceled = Number((appointments.find((a) => Number(a.month) === month && a.status === "canceled") || { count: 0 }).count || 0);
            const totalRequested = pending + confirmed + completed + canceled;
            return { month, totalRequested, completed, canceled, pending, confirmed };
        });
        return res.json({
            year,
            usersByMonth,
            professionalsByMonth,
            appointmentsByMonth,
            servicesSummary,
        });
    }
    catch (error) {
        console.error("Admin stats error", error);
        return res.status(500).json({ error: "Erro ao buscar estatísticas" });
    }
});
exports.getAdminStats = getAdminStats;
