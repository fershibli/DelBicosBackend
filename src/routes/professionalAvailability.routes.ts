import { Router } from "express";
import {
  createAvailability,
  getAllAvailabilities,
  getAvailabilityById,
  updateAvailability,
  deleteAvailability,
} from "../controllers/professionalAvailabilityController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Professional Availabilities
 *   description: Gerenciamento de disponibilidade de profissionais
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProfessionalAvailability:
 *       type: object
 *       required:
 *         - professional_id
 *         - weekday
 *         - start_time
 *         - end_time
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-gerado da disponibilidade
 *         professional_id:
 *           type: integer
 *           description: ID do profissional
 *         weekday:
 *           type: integer
 *           description: Dia da semana (0=Domingo, 1=Segunda, ..., 6=Sábado)
 *           minimum: 0
 *           maximum: 6
 *         start_time:
 *           type: string
 *           format: time
 *           description: Hora de início do atendimento (HH:MM:SS)
 *         end_time:
 *           type: string
 *           format: time
 *           description: Hora de término do atendimento (HH:MM:SS)
 *         active:
 *           type: boolean
 *           description: Indica se a disponibilidade está ativa
 *           default: true
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
 *         weekday: 1
 *         start_time: "09:00:00"
 *         end_time: "18:00:00"
 *         active: true
 *         createdAt: "2023-01-01T00:00:00.000Z"
 *         updatedAt: "2023-01-01T00:00:00.000Z"
 * 
 *     ProfessionalAvailabilityInput:
 *       type: object
 *       required:
 *         - professional_id
 *         - weekday
 *         - start_time
 *         - end_time
 *       properties:
 *         professional_id:
 *           type: integer
 *         weekday:
 *           type: integer
 *           minimum: 0
 *           maximum: 6
 *         start_time:
 *           type: string
 *           format: time
 *         end_time:
 *           type: string
 *           format: time
 *         active:
 *           type: boolean
 *       example:
 *         professional_id: 5
 *         weekday: 1
 *         start_time: "09:00:00"
 *         end_time: "18:00:00"
 *         active: true
 */

/**
 * @swagger
 * /availabilities:
 *   post:
 *     summary: Cria uma nova disponibilidade para um profissional
 *     tags: [Professional Availabilities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfessionalAvailabilityInput'
 *     responses:
 *       201:
 *         description: Disponibilidade criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfessionalAvailability'
 *       400:
 *         description: Dados inválidos ou conflito de horário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Profissional não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", createAvailability);

/**
 * @swagger
 * /availabilities:
 *   get:
 *     summary: Retorna todas as disponibilidades
 *     tags: [Professional Availabilities]
 *     parameters:
 *       - in: query
 *         name: professional_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID do profissional
 *       - in: query
 *         name: weekday
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 6
 *         description: Filtrar por dia da semana (0=Domingo, 1=Segunda, ..., 6=Sábado)
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filtrar por status ativo/inativo
 *     responses:
 *       200:
 *         description: Lista de disponibilidades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProfessionalAvailability'
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/", getAllAvailabilities);

/**
 * @swagger
 * /availabilities/{id}:
 *   get:
 *     summary: Retorna uma disponibilidade pelo ID
 *     tags: [Professional Availabilities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da disponibilidade
 *     responses:
 *       200:
 *         description: Dados da disponibilidade
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfessionalAvailability'
 *       404:
 *         description: Disponibilidade não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", getAvailabilityById);

/**
 * @swagger
 * /availabilities/{id}:
 *   put:
 *     summary: Atualiza uma disponibilidade existente
 *     tags: [Professional Availabilities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da disponibilidade
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfessionalAvailabilityInput'
 *     responses:
 *       200:
 *         description: Disponibilidade atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfessionalAvailability'
 *       400:
 *         description: Dados inválidos ou conflito de horário
 *       404:
 *         description: Disponibilidade não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put("/:id", updateAvailability);

/**
 * @swagger
 * /availabilities/{id}:
 *   delete:
 *     summary: Remove uma disponibilidade
 *     tags: [Professional Availabilities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da disponibilidade
 *     responses:
 *       200:
 *         description: Disponibilidade removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Disponibilidade deletada com sucesso
 *       404:
 *         description: Disponibilidade não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/:id", deleteAvailability);

export default router;