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
exports.markAllNotificationsAsRead = exports.markNotificationAsRead = exports.getNotificationsByUser = exports.createNotification = exports.sendPushNotification = exports.saveExpoPushToken = void 0;
const Notification_1 = require("../models/Notification");
const expo_server_sdk_1 = require("expo-server-sdk");
const UserToken_1 = require("../models/UserToken");
let expo = new expo_server_sdk_1.Expo();
const saveExpoPushToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, token } = req.body;
    if (!userId || !token) {
        return res.status(400).json({ error: "userId and token are required." });
    }
    if (!expo_server_sdk_1.Expo.isExpoPushToken(token)) {
        console.error(`Token ${token} não é um Expo Push Token válido.`);
        return res.status(400).json({ error: "Invalid Expo Push Token format." });
    }
    try {
        yield UserToken_1.UserTokenModel.upsert({
            user_id: userId,
            token: token,
        });
        res.status(201).json({ message: "Expo Push Token saved successfully." });
    }
    catch (error) {
        console.error("Erro ao salvar token:", error);
        res.status(500).json({ error: "Failed to save push token." });
    }
});
exports.saveExpoPushToken = saveExpoPushToken;
const sendPushNotification = (userId, title, message, notificationId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userToken = yield UserToken_1.UserTokenModel.findOne({
            where: { user_id: userId },
        });
        if (!userToken || !expo_server_sdk_1.Expo.isExpoPushToken(userToken.token)) {
            console.log(`Nenhum token válido encontrado para o usuário ${userId}.`);
            return;
        }
        const pushMessage = {
            to: userToken.token,
            sound: "default",
            title: title,
            body: message,
            data: {
                id: notificationId,
                title: title,
                message: message,
                createdAt: new Date().toISOString(),
            },
        };
        let ticket = yield expo.sendPushNotificationsAsync([pushMessage]);
        console.log("Ticket de envio de notificação:", ticket);
    }
    catch (error) {
        console.error("Erro ao enviar notificação push:", error);
    }
});
exports.sendPushNotification = sendPushNotification;
const createNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = yield Notification_1.NotificationModel.create(req.body);
        res.status(201).json(notification);
        (0, exports.sendPushNotification)(String(notification.user_id), notification.title, notification.message, notification.id);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.createNotification = createNotification;
const getNotificationsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    if (!userId) {
        return res
            .status(400)
            .json({ error: "User ID is required in URL parameter." });
    }
    const whereCondition = { user_id: userId };
    try {
        const notifications = yield Notification_1.NotificationModel.findAll({
            where: whereCondition,
            order: [
                ["is_read", "ASC"],
                ["createdAt", "DESC"],
            ],
        });
        res.json(notifications);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to retrieve notifications." });
    }
});
exports.getNotificationsByUser = getNotificationsByUser;
const markNotificationAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notificationId = req.params.notificationId;
    const userId = req.params.userId;
    if (!userId) {
        return res
            .status(400)
            .json({ error: "User ID is required for marking read." });
    }
    try {
        const [updatedRows] = yield Notification_1.NotificationModel.update({ is_read: true }, {
            where: {
                id: notificationId,
                user_id: userId,
                is_read: false,
            },
        });
        if (updatedRows === 0) {
            const notification = yield Notification_1.NotificationModel.findByPk(notificationId);
            if (!notification) {
                return res.status(404).json({ error: "Notification not found." });
            }
            return res
                .status(200)
                .json({ message: "Notification was already marked as read." });
        }
        const updatedNotification = yield Notification_1.NotificationModel.findByPk(notificationId);
        res.status(200).json(updatedNotification);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to mark notification as read." });
    }
});
exports.markNotificationAsRead = markNotificationAsRead;
const markAllNotificationsAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    if (!userId) {
        return res
            .status(400)
            .json({ error: "User ID is required for marking all read." });
    }
    try {
        const [updatedRows] = yield Notification_1.NotificationModel.update({ is_read: true }, {
            where: {
                user_id: userId,
                is_read: false,
            },
        });
        res.status(200).json({
            message: `${updatedRows} notifications marked as read.`,
            updatedCount: updatedRows,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ error: "Failed to mark all notifications as read." });
    }
});
exports.markAllNotificationsAsRead = markAllNotificationsAsRead;
