import { Schema, model } from "mongoose";

const LoginLogSchema = new Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  loginDate: { type: Date, default: Date.now },
  jwt: { type: String, required: true },
  ip: { type: String },
  userAgent: { type: String },
  status: { type: String, default: "SUCCESS" },
});

export const LoginLog = model("LoginLog", LoginLogSchema);
