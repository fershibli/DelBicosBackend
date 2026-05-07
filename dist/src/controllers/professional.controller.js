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
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProfessionalAvailability = exports.getProfessionalById = exports.getProfessionals = void 0;
const sequelize_1 = require("sequelize");
const Professional_1 = require("../models/Professional");
const User_1 = require("../models/User");
const Address_1 = require("../models/Address");
const Service_1 = require("../models/Service");
const Appointment_1 = require("../models/Appointment");
const Client_1 = require("../models/Client");
const ProfessionalAvailability_1 = require("../models/ProfessionalAvailability");
const getProfessionals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { termo, page = 0, limit = 12, lat, lng } = req.query;
        console.log(lat, lng);
        const latNum = lat ? parseFloat(String(lat)) : undefined;
        const lngNum = lng ? parseFloat(String(lng)) : undefined;
        console.log(latNum, lngNum);
        const hasLatLng = Number.isFinite(latNum) && Number.isFinite(lngNum);
        console.log(hasLatLng);
        const where = {};
        if (termo) {
            where[sequelize_1.Op.or] = [
                { "$User.name$": { [sequelize_1.Op.like]: `%${termo}%` } },
                { "$User.email$": { [sequelize_1.Op.like]: `%${termo}%` } },
                { cpf: { [sequelize_1.Op.like]: `%${termo}%` } },
            ];
        }
        const distanceLiteral = hasLatLng
            ? (0, sequelize_1.literal)(`
        6371 * acos(
          LEAST(1, GREATEST(-1,
            cos(radians(${latNum})) * cos(radians("MainAddress"."lat")) *
            cos(radians("MainAddress"."lng") - radians(${lngNum})) +
            sin(radians(${latNum})) * sin(radians("MainAddress"."lat"))
          ))
        )
      `)
            : null;
        console.log(distanceLiteral);
        const order = [];
        if (hasLatLng && distanceLiteral) {
            order.push([distanceLiteral, "ASC"]);
        }
        else {
            order.push(["created_at", "DESC"]);
        }
        const attributes = { include: [] };
        if (hasLatLng && distanceLiteral) {
            attributes.include.push([distanceLiteral, "distance_km"]);
        }
        const { rows, count } = yield Professional_1.ProfessionalModel.findAndCountAll({
            attributes,
            subQuery: false,
            include: [
                {
                    model: User_1.UserModel,
                    as: "User",
                    attributes: ["id", "name", "email", "avatar_uri", "banner_uri"],
                    required: true,
                },
                {
                    model: Address_1.AddressModel,
                    as: "MainAddress",
                    attributes: ["lat", "lng", "city", "state"],
                    required: false,
                },
                {
                    model: Service_1.ServiceModel,
                    as: "Services",
                    required: false,
                    attributes: ["title"],
                    separate: true,
                },
                {
                    model: Appointment_1.AppointmentModel,
                    as: "Appointments",
                    attributes: ["rating"],
                    required: false,
                    separate: true,
                    where: {
                        status: "completed",
                        rating: { [sequelize_1.Op.ne]: null },
                    },
                },
            ],
            where,
            order,
            limit: Number(limit),
            offset: Number(page) * Number(limit),
            distinct: true,
        });
        const professionals = rows.map((prof) => {
            var _a, _b, _c, _d, _e;
            const apps = ((_a = prof.Appointments) !== null && _a !== void 0 ? _a : []);
            const ratingsCount = apps.length;
            const ratingSum = apps.reduce((sum, a) => sum + a.rating, 0);
            const ratingAvg = ratingsCount > 0 ? ratingSum / ratingsCount : 0;
            return {
                id: prof.id,
                name: ((_b = prof.User) === null || _b === void 0 ? void 0 : _b.name) || "Profissional",
                email: (_c = prof.User) === null || _c === void 0 ? void 0 : _c.email,
                avatar_uri: (_d = prof.User) === null || _d === void 0 ? void 0 : _d.avatar_uri,
                banner_uri: (_e = prof.User) === null || _e === void 0 ? void 0 : _e.banner_uri,
                MainAddress: prof.MainAddress
                    ? {
                        city: prof.MainAddress.city,
                        state: prof.MainAddress.state,
                        lat: prof.MainAddress.lat,
                        lng: prof.MainAddress.lng,
                    }
                    : null,
                Services: prof.Services || [],
                distance_km: prof.dataValues.distance_km,
                rating: parseFloat(ratingAvg.toFixed(1)),
                ratings_count: ratingsCount,
            };
        });
        return res.json({
            professionals,
            totalCount: count,
            currentPage: Number(page),
            pageSize: Number(limit),
            totalPages: Math.ceil(count / Number(limit)),
        });
    }
    catch (error) {
        console.error("Erro ao buscar profissionais:", error);
        return res.status(500).json({
            error: "Erro ao buscar profissionais",
            details: error instanceof Error ? error.message : String(error),
        });
    }
});
exports.getProfessionals = getProfessionals;
const getProfessionalById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const professional = yield Professional_1.ProfessionalModel.findByPk(req.params.id, {
            include: [
                {
                    model: User_1.UserModel,
                    as: "User",
                    attributes: ["id", "name", "email", "avatar_uri", "banner_uri"],
                },
                { model: Address_1.AddressModel, as: "MainAddress" },
                { model: Service_1.ServiceModel, as: "Services" },
                // { model: AmenitiesModel, as: "Amenities", through: { attributes: [] } },
                // { model: ProfessionalGalleryModel, as: "Gallery" },
                // {
                //   model: ProfessionalAvailabilityModel,
                //   as: "Availabilities",
                //   where: { is_available: true },
                // },
                {
                    model: Appointment_1.AppointmentModel,
                    as: "Appointments",
                    where: { status: "completed", rating: { [sequelize_1.Op.not]: null } },
                    required: false,
                    include: [
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
                            model: Service_1.ServiceModel,
                            as: "Service",
                            attributes: ["title"],
                        },
                    ],
                },
            ],
        });
        if (!professional) {
            return res.status(404).json({ error: "Profissional não encontrado" });
        }
        const profData = professional;
        const appointments = ((_a = profData.Appointments) !== null && _a !== void 0 ? _a : []);
        const ratings = appointments
            .map((a) => { var _a; return (_a = a === null || a === void 0 ? void 0 : a.rating) !== null && _a !== void 0 ? _a : null; })
            .filter((v) => v !== null && Number.isFinite(v));
        const ratings_count = ratings.length;
        const rating = ratings_count > 0
            ? Math.round((ratings.reduce((s, n) => s + n, 0) / ratings_count) * 100) / 100
            : null;
        profData.setDataValue("rating", rating);
        profData.setDataValue("ratings_count", ratings_count);
        return res.json(professional);
    }
    catch (error) {
        console.error("Erro ao buscar profissional:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
});
exports.getProfessionalById = getProfessionalById;
function getAvailableSlots(professionalId, date, serviceDuration) {
    return __awaiter(this, void 0, void 0, function* () {
        const targetDate = new Date(`${date}T12:00:00.000Z`);
        const dayOfWeek = targetDate.getUTCDay();
        const bitmaskDay = "_".repeat(dayOfWeek) + "1" + "_".repeat(6 - dayOfWeek);
        const availabilityRules = yield ProfessionalAvailability_1.ProfessionalAvailabilityModel.findAll({
            where: {
                professional_id: professionalId,
                is_available: true,
                [sequelize_1.Op.or]: [
                    {
                        recurrence_pattern: "weekly",
                        days_of_week: { [sequelize_1.Op.like]: `%${bitmaskDay}%` },
                    },
                    {
                        recurrence_pattern: "none",
                        start_day: { [sequelize_1.Op.lte]: targetDate },
                        end_day: { [sequelize_1.Op.gte]: targetDate },
                    },
                ],
            },
        });
        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(`${date}T23:59:59.999Z`);
        const appointments = yield Appointment_1.AppointmentModel.findAll({
            where: {
                professional_id: professionalId,
                status: { [sequelize_1.Op.in]: ["confirmed", "pending"] },
                start_time: { [sequelize_1.Op.between]: [startOfDay, endOfDay] },
            },
        });
        const blocks = yield ProfessionalAvailability_1.ProfessionalAvailabilityModel.findAll({
            where: {
                professional_id: professionalId,
                is_available: false,
                recurrence_pattern: "none",
                start_day: { [sequelize_1.Op.lte]: targetDate },
                end_day: { [sequelize_1.Op.gte]: targetDate },
            },
        });
        const allBlockages = [
            ...appointments.map((a) => ({
                start: new Date(a.start_time),
                end: new Date(a.end_time),
            })),
            ...blocks.map((b) => {
                const [startH, startM] = b.start_time.split(":").map(Number);
                const [endH, endM] = b.end_time.split(":").map(Number);
                const blockStart = new Date(startOfDay);
                blockStart.setUTCHours(startH, startM);
                const blockEnd = new Date(startOfDay);
                blockEnd.setUTCHours(endH, endM);
                return { start: blockStart, end: blockEnd };
            }),
        ];
        const availableSlots = [];
        const slotInterval = 30;
        for (const rule of availabilityRules) {
            const [startH, startM] = rule.start_time.split(":").map(Number);
            const [endH, endM] = rule.end_time.split(":").map(Number);
            const ruleStart = new Date(startOfDay);
            ruleStart.setUTCHours(startH, startM, 0, 0);
            const ruleEnd = new Date(startOfDay);
            ruleEnd.setUTCHours(endH, endM, 0, 0);
            let currentSlotStart = new Date(ruleStart);
            while (currentSlotStart < ruleEnd) {
                const slotEnd = new Date(currentSlotStart.getTime() + serviceDuration * 60000);
                if (slotEnd > ruleEnd) {
                    break;
                }
                const isBlocked = allBlockages.some((block) => {
                    return currentSlotStart < block.end && slotEnd > block.start;
                });
                if (!isBlocked) {
                    availableSlots.push(currentSlotStart.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "UTC",
                    }));
                }
                currentSlotStart.setMinutes(currentSlotStart.getMinutes() + slotInterval);
            }
        }
        return [...new Set(availableSlots)].sort();
    });
}
const searchProfessionalAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subCategoryId, date, lat, lng } = req.query;
    if (!subCategoryId || !date) {
        return res
            .status(400)
            .json({ error: "subCategoryId e date são obrigatórios." });
    }
    if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res
            .status(400)
            .json({ error: "Formato de data inválido. Use AAAA-MM-DD." });
    }
    const latNum = typeof lat === "string" ? parseFloat(lat) : undefined;
    const lngNum = typeof lng === "string" ? parseFloat(lng) : undefined;
    const hasLatLng = Number.isFinite(latNum) && Number.isFinite(lngNum);
    try {
        const professionals = yield Professional_1.ProfessionalModel.findAll({
            include: [
                {
                    model: Service_1.ServiceModel,
                    as: "Services",
                    where: { subcategory_id: Number(subCategoryId), active: true },
                    required: true,
                },
                { model: User_1.UserModel, as: "User", attributes: ["name", "avatar_uri"] },
                {
                    model: Address_1.AddressModel,
                    as: "MainAddress",
                    attributes: ["city", "state", "lat", "lng"],
                },
            ],
        });
        if (!professionals.length) {
            return res.json([]);
        }
        const getDistance = (profLat, profLng) => {
            if (!hasLatLng)
                return 0;
            const toRad = (x) => (x * Math.PI) / 180;
            const R = 6371;
            const dLat = toRad(profLat - latNum);
            const dLon = toRad(profLng - lngNum);
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(latNum)) *
                    Math.cos(toRad(profLat)) *
                    Math.sin(dLon / 2) *
                    Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };
        const resultsPromises = professionals.map((prof) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c;
            const relevantService = prof.Services.find((s) => s.subcategory_id === Number(subCategoryId));
            const serviceDuration = (relevantService === null || relevantService === void 0 ? void 0 : relevantService.duration) || 60;
            const availableTimes = yield getAvailableSlots(prof.id, date, serviceDuration);
            if (availableTimes.length === 0) {
                return null;
            }
            const professionalWithAppointments = (yield Professional_1.ProfessionalModel.findByPk(prof.id, {
                include: [
                    {
                        model: Appointment_1.AppointmentModel,
                        as: "Appointments",
                        where: { status: "completed", rating: { [sequelize_1.Op.not]: null } },
                        attributes: ["rating"],
                        required: false,
                    },
                ],
            }));
            const ratings = ((_a = professionalWithAppointments === null || professionalWithAppointments === void 0 ? void 0 : professionalWithAppointments.Appointments) === null || _a === void 0 ? void 0 : _a.map((a) => a.rating)) || [];
            const ratingsCount = ratings.length;
            const averageRating = ratingsCount > 0
                ? ratings.reduce((acc, val) => acc + (val || 0), 0) / ratingsCount
                : 0;
            const distance = prof.MainAddress
                ? getDistance(parseFloat(prof.MainAddress.lat), parseFloat(prof.MainAddress.lng))
                : 0;
            return {
                id: prof.id,
                name: prof.User.name,
                imageUrl: prof.User.avatar_uri,
                serviceName: relevantService.title,
                priceFrom: relevantService.price,
                serviceId: relevantService.id,
                rating: parseFloat(averageRating.toFixed(1)),
                ratingsCount: ratingsCount,
                distance: parseFloat(distance.toFixed(1)),
                location: `${(_b = prof.MainAddress) === null || _b === void 0 ? void 0 : _b.city}, ${(_c = prof.MainAddress) === null || _c === void 0 ? void 0 : _c.state}`,
                offeredServices: prof.Services.map((s) => s.title),
                availableTimes: availableTimes,
            };
        }));
        let results = (yield Promise.all(resultsPromises)).filter((result) => result !== null);
        if (hasLatLng) {
            results.sort((a, b) => a.distance - b.distance);
        }
        return res.json(results);
    }
    catch (error) {
        console.error("Erro ao buscar disponibilidade:", error);
        return res
            .status(500)
            .json({ error: "Erro interno do servidor", details: error.message });
    }
});
exports.searchProfessionalAvailability = searchProfessionalAvailability;
