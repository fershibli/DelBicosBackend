import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
  getChatMessages,
  getChatRooms,
} from "../controllers/chat.controller";

const chatRouter = Router();

/**
 * @route   GET /api/chat/rooms
 * @desc    Lista as conversas do usuário (correspondente + última mensagem)
 * @access  Private
 */
chatRouter.get("/rooms", authMiddleware, getChatRooms);

/**
 * @route   GET /api/chat/rooms/:roomId/messages
 * @desc    Histórico paginado por cursor (sent_at)
 * @access  Private
 * @query   cursor (ISO date), limit (1..50)
 */
chatRouter.get("/rooms/:roomId/messages", authMiddleware, getChatMessages);

export default chatRouter;
