import { Router } from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  confirmAppointment,
} from "../controllers/appointment.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Gerenciamento de agendamentos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - professional_id
 *         - service_id
 *         - client_id
 *         - date
 *         - start_time
 *         - end_time
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-gerado do agendamento
 *         professional_id:
 *           type: integer
 *           description: ID do profissional
 *         service_id:
 *           type: integer
 *           description: ID do serviço
 *         client_id:
 *           type: integer
 *           description: ID do cliente
 *         date:
 *           type: string
 *           format: date
 *           description: Data do agendamento (YYYY-MM-DD)
 *         start_time:
 *           type: string
 *           format: time
 *           description: Hora de início (HH:MM:SS)
 *         end_time:
 *           type: string
 *           format: time
 *           description: Hora de término (HH:MM:SS)
 *         status:
 *           type: string
 *           enum: [pending, confirmed, canceled, completed]
 *           default: pending
 *           description: Status do agendamento
 *         notes:
 *           type: string
 *           nullable: true
 *           description: Observações adicionais
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data de atualização
 *       example:
 *         id: 1
 *         professional_id: 5
 *         service_id: 3
 *         client_id: 8
 *         date: "2023-12-15"
 *         start_time: "14:00:00"
 *         end_time: "15:00:00"
 *         status: "confirmed"
 *         notes: "Cliente preferencial"
 *         createdAt: "2023-12-01T10:00:00.000Z"
 *         updatedAt: "2023-12-01T10:00:00.000Z"
 *
 *     AppointmentInput:
 *       type: object
 *       required:
 *         - professional_id
 *         - service_id
 *         - client_id
 *         - date
 *         - start_time
 *         - end_time
 *       properties:
 *         professional_id:
 *           type: integer
 *         service_id:
 *           type: integer
 *         client_id:
 *           type: integer
 *         date:
 *           type: string
 *           format: date
 *         start_time:
 *           type: string
 *           format: time
 *         end_time:
 *           type: string
 *           format: time
 *         status:
 *           type: string
 *           enum: [pending, confirmed, canceled, completed]
 *         notes:
 *           type: string
 *           nullable: true
 *       example:
 *         professional_id: 5
 *         service_id: 3
 *         client_id: 8
 *         date: "2023-12-15"
 *         start_time: "14:00:00"
 *         end_time: "15:00:00"
 *         notes: "Cliente preferencial"
 */

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Cria um novo agendamento
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AppointmentInput'
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Dados inválidos ou conflito de horário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", createAppointment);

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Retorna todos os agendamentos
 *     tags: [Appointments]
 *     parameters:
 *       - in: query
 *         name: professional_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID do profissional
 *       - in: query
 *         name: client_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID do cliente
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, canceled, completed]
 *         description: Filtrar por status
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar por data específica (YYYY-MM-DD)
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial para intervalo (YYYY-MM-DD)
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final para intervalo (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/", getAllAppointments);

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Retorna um agendamento pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Dados do agendamento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Agendamento não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", getAppointmentById);

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Atualiza um agendamento existente
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do agendamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AppointmentInput'
 *     responses:
 *       200:
 *         description: Agendamento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Dados inválidos ou conflito de horário
 *       404:
 *         description: Agendamento não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put("/:id", updateAppointment);

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Remove um agendamento
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Agendamento removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Agendamento deletado com sucesso
 *       404:
 *         description: Agendamento não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/:id", deleteAppointment);

/**
 * @swagger
 * /appointments/{id}/confirm:
 *   post:
 *     summary: Confirma um agendamento pendente
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Agendamento confirmado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Agendamento não está pendente ou já foi confirmado/cancelado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Agendamento não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/:id/confirm", confirmAppointment);

export default router;
