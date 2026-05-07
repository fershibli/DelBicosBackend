"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginLog = void 0;
const mongoose_1 = require("mongoose");
const LoginLogSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    loginDate: { type: Date, default: Date.now },
    jwt: { type: String, required: true },
    ip: { type: String },
    userAgent: { type: String },
    status: { type: String, default: "SUCCESS" },
});
exports.LoginLog = (0, mongoose_1.model)("LoginLog", LoginLogSchema);
