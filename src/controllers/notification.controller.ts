import { Request, Response } from "express";
import { NotificationModel } from "../models/Notification";
import { Expo, ExpoPushMessage } from "expo-server-sdk";
import { UserTokenModel } from "../models/UserToken";


let expo = new Expo();

export const saveExpoPushToken = async (req: Request, res: Response) => {
    const { userId, token } = req.body;

    if (!userId || !token) {
        return res.status(400).json({ error: "userId and token are required." });
    }

    if (!Expo.isExpoPushToken(token)) {
        console.error(`Token ${token} não é um Expo Push Token válido.`);
        return res.status(400).json({ error: "Invalid Expo Push Token format." });
    }

    try {
        await UserTokenModel.upsert({
            user_id: userId,
            token: token,
        });

        res.status(201).json({ message: "Expo Push Token saved successfully." });
    } catch (error: any) {
        console.error("Erro ao salvar token:", error);
        res.status(500).json({ error: "Failed to save push token." });
    }
};


export const sendPushNotification = async (userId: string, title: string, message: string, notificationId: number) => {
    try {
        const userToken = await UserTokenModel.findOne({ where: { user_id: userId } });

        if (!userToken || !Expo.isExpoPushToken(userToken.token)) {
            console.log(`Nenhum token válido encontrado para o usuário ${userId}.`);
            return;
        }

        const pushMessage: ExpoPushMessage = {
            to: userToken.token,
            sound: 'default',
            title: title,
            body: message,
            data: { 
                id: notificationId,
                title: title, 
                message: message,
                createdAt: new Date().toISOString()
            }, 
        };

        let ticket = await expo.sendPushNotificationsAsync([pushMessage]);
        console.log("Ticket de envio de notificação:", ticket);
        
    } catch (error) {
        console.error("Erro ao enviar notificação push:", error);
    }
};


export const createNotification = async (req: Request, res: Response) => {
  try {
    const notification = await NotificationModel.create(req.body);
    res.status(201).json(notification);
    sendPushNotification(
            String(notification.user_id),
            notification.title,
            notification.message,
            notification.id
        );

  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getNotificationsByUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required in URL parameter." });
  }

  const whereCondition: any = { user_id: userId };

  try {
    const notifications = await NotificationModel.findAll({
      where: whereCondition,
      order: [
        ['is_read', 'ASC'],
        ['createdAt', 'DESC'],
      ],
    });
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to retrieve notifications." });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  const notificationId = req.params.notificationId;
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required for marking read." });
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
      if (!notification) {
        return res.status(404).json({ error: "Notification not found." });
      }
      return res.status(200).json({ message: "Notification was already marked as read." });
    }
    const updatedNotification = await NotificationModel.findByPk(notificationId);
    res.status(200).json(updatedNotification);

  } catch (error: any) {
    res.status(500).json({ error: "Failed to mark notification as read." });
  }
};

export const markAllNotificationsAsRead = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required for marking all read." });
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