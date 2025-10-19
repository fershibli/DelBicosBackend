// BACKEND: notification.controller.ts

import { Request, Response } from "express";
import { NotificationModel } from "../models/Notification";

// Removendo a interface AuthRequest, já que não usaremos req.user

export const createNotification = async (req: Request, res: Response) => {
  try {
    const notification = await NotificationModel.create(req.body);
    res.status(201).json(notification);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// GET: /api/notifications/:userId (Busca as notificações de um ID passado na URL)
export const getNotificationsByUser = async (req: Request, res: Response) => {
  const userId = req.params.userId; // AGORA LENDO O ID DA ROTA

  if (!userId) {
    return res.status(400).json({ error: "User ID is required in URL parameter." });
  }

  const whereCondition: any = { user_id: userId };

  try {
    const notifications = await NotificationModel.findAll({
      where: whereCondition,
      order: [
        ['is_read', 'ASC'],
        ['createdAt', 'DESC'], // Ajustado para o padrão Sequelize 'createdAt'
      ],
    });
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to retrieve notifications." });
  }
};

// PATCH: /api/notifications/:notificationId/read/:userId (Marca 1 como lida)
export const markNotificationAsRead = async (req: Request, res: Response) => {
  const notificationId = req.params.notificationId; // A rota será ajustada para este nome
  const userId = req.params.userId; // <--- PEGANDO O ID DO USUÁRIO PELA ROTA (INSEGURO)

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
      // Removemos a verificação de 'user_id' aqui também para simplificar
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

// PATCH: /api/notifications/mark-all-read/:userId (Marca todas como lidas)
export const markAllNotificationsAsRead = async (req: Request, res: Response) => {
  const userId = req.params.userId; // <--- PEGANDO O ID DO USUÁRIO PELA ROTA (INSEGURO)

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