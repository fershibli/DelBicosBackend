import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
  getChatMessages,
  getChatRooms,
} from "../controllers/chat.controller";
import {
  sendBotMessage,
  getBotSession,
} from "../controllers/botChat.controller";

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

// ── Chatbot com NLU ──────────────────────────────────────────────────────────

/**
 * @route   POST /api/chat/bot/message
 * @desc    Envia mensagem ao chatbot e recebe resposta + estado da sessão
 * @access  Private
 * @body    { message: string, session_id?: number, channel?: string }
 */
chatRouter.post("/bot/message", authMiddleware, sendBotMessage as any);

/**
 * @route   GET /api/chat/bot/session/:id
 * @desc    Retorna o histórico completo de uma sessão de chatbot
 * @access  Private
 */
chatRouter.get("/bot/session/:id", authMiddleware, getBotSession as any);

export default chatRouter;
