import { Router } from "express";
import { getNotificationsByUser, markNotificationAsRead, markAllNotificationsAsRead, saveExpoPushToken } from "../controllers/notification.controller";
const router = Router();
router.get('/:userId', getNotificationsByUser);
router.patch('/:notificationId/read/:userId', markNotificationAsRead);
router.patch('/mark-all-read/:userId', markAllNotificationsAsRead);
router.post('/notifications/save-token', saveExpoPushToken);


export default router;