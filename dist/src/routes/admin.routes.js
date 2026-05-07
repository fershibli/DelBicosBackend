"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const admin_middleware_1 = __importDefault(require("../middlewares/admin.middleware"));
const router = (0, express_1.Router)();
router.post('/login', admin_controller_1.adminLogin);
router.get('/stats', admin_middleware_1.default, admin_controller_1.getAdminStats);
exports.default = router;
