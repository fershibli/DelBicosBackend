import { Request, Response } from "express";
import { NotificationModel } from "../models/Notification";

interface AuthRequest extends Request {
    user?: {
        id: number;
    };
}

export const createNotification = async (req: Request, res: Response) => {
  try {
    const notification = await NotificationModel.create(req.body);
    res.status(201).json(notification);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getNotificationsByUser = async (req: Request, res: Response) => {
  const userId = req.params.userId; 
  
  if (!userId) {
    return res.status(400).json({ error: "User ID is required for notification listing (test mode)." });
  }
  
  const whereCondition: any = { user_id: userId }; 

  try {
    const notifications = await NotificationModel.findAll({
      where: whereCondition,
      order: [
        ['is_read', 'ASC'], 
        ['created_at', 'DESC'], 
      ],
    });
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to retrieve notifications." });
  }
};
export const markNotificationAsRead = async (req: AuthRequest, res: Response) => {
  const notificationId = req.params.id;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: User ID not found." });
  }

  try {
    const [updatedRows] = await NotificationModel.update(
      { is_read: true },
      {
        where: {
          id: notificationId,
          user_id: userId,
          is_read: false,
        },
      }
    );

    if (updatedRows === 0) {
      const notification = await NotificationModel.findByPk(notificationId);
      if (!notification || notification.user_id !== userId) {
        return res.status(404).json({ error: "Notification not found or access denied." });
      }
      return res.status(200).json({ message: "Notification was already marked as read." });
    }
    const updatedNotification = await NotificationModel.findByPk(notificationId);
    res.status(200).json(updatedNotification);

  } catch (error: any) {
    res.status(500).json({ error: "Failed to mark notification as read." });
  }
};

export const markAllNotificationsAsRead = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: User ID not found." });
  }

  try {
    const [updatedRows] = await NotificationModel.update(
      { is_read: true },
      {
        where: {
          user_id: userId,
          is_read: false,
        },
      }
    );

    res.status(200).json({ 
        message: `${updatedRows} notifications marked as read.`,
        updatedCount: updatedRows 
    });

  } catch (error: any) {
    res.status(500).json({ error: "Failed to mark all notifications as read." });
  }
};