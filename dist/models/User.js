"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    birthDate: { type: String },
    gender: { type: String },
    location: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
});
exports.default = (0, mongoose_1.model)('User', userSchema);
