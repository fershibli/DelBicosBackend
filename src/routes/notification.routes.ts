import { Router } from "express";
import { getNotificationsByUser, markNotificationAsRead, markAllNotificationsAsRead } from "../controllers/notification.controller";
const router = Router();
router.get('/:userId', /* authMiddleware, */ getNotificationsByUser);

router.patch('/:id/read', /* authMiddleware, */ markNotificationAsRead);

router.patch('/mark-all-read', /* authMiddleware, */ markAllNotificationsAsRead);


export default router;