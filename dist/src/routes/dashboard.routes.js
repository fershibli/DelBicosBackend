"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = (0, express_1.Router)();
router.get("/kpis", auth_middleware_1.default, dashboard_controller_1.getDashboardKpis);
router.get("/earnings-over-time", auth_middleware_1.default, dashboard_controller_1.getEarningsOverTime);
router.get("/services-by-category", auth_middleware_1.default, dashboard_controller_1.getServicesByCategory);
exports.default = router;
