import { Router } from "express";
import {
  getProfessionals,
  getProfessionalById,
  searchProfessionalAvailability,
  createProfessional,
  updateProfessional,
  getProfessionalRadius,
  updateProfessionalRadius,
} from "../controllers/professional.controller";
import authMiddleware from "../middlewares/auth.middleware";
import availabilityRouter from "./professionalAvailability.routes";
import availabilityLockRouter from "./professionalAvailabilityLock.routes";
import serviceRouter from "./professionalService.routes";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Profissionais
 *   description: Endpoints para gerenciamento de profissionais
 */

/**
 * @swagger
 * /professionals:
 *   get:
 *     summary: Lista todos os profissionais
 *     tags: [Profissionais]
 *     parameters:
 *       - in: query
 *         name: termo
 *         schema:
 *           type: string
 *         description: Termo para busca (nome, email ou CPF)
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         description: Latitude para ordenação por proximidade
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         description: Longitude para ordenação por proximidade
 *       - in: query
 *         name: raio_km
 *         schema:
 *           type: number
 *         description: "Raio em quilômetros (padrão: 10)"
 *     responses:
 *       200:
 *         description: Lista de profissionais
 */
router.get("/", getProfessionals);

router.get("/search-availability", searchProfessionalAvailability);

/**
 * @swagger
 * /professionals:
 *   post:
 *     summary: Cria um novo profissional (usuário comum se torna profissional/colaborador)
 *     tags: [Profissionais]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cpf
 *               - description
 *             properties:
 *               cpf:
 *                 type: string
 *                 example: "123.456.789-00"
 *               cnpj:
 *                 type: string
 *                 example: "12.345.678/0001-99"
 *               description:
 *                 type: string
 *                 example: "Descrição do serviço que ele presta..."
 *     responses:
 *       201:
 *         description: Profissional criado com sucesso
 *       400:
 *         description: Dados inválidos ou incompletos
 *       401:
 *         description: Usuário não autenticado
 *       409:
 *         description: CPF/CNPJ já registrado ou usuário já é profissional
 */
router.post("/", authMiddleware, createProfessional);

/**
 * @swagger
 * /professionals/{id}:
 *   get:
 *     summary: Busca um profissional pelo ID
 *     tags: [Profissionais]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do profissional
 *     responses:
 *       200:
 *         description: Profissional encontrado
 *       404:
 *         description: Profissional não encontrado
 */
router.get("/:id", getProfessionalById);

router.get("/:id/radius", authMiddleware, getProfessionalRadius);
router.put("/:id/radius", authMiddleware, updateProfessionalRadius);

/**
 * @swagger
 * /professionals/{id}:
 *   put:
 *     summary: Atualiza dados do profissional (somente o próprio profissional)
 *     tags: [Profissionais]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               main_address_id:
 *                 type: integer
 *               service_radius_km:
 *                 type: integer
 *                 description: Raio de atuação em km
 *     responses:
 *       200:
 *         description: Profissional atualizado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Não autorizado
 */
router.put("/:id", authMiddleware, updateProfessional);

// Serviços do profissional
router.use("/:professionalId/services", serviceRouter);

// Disponibilidades (CRUD) — path plural para compatibilidade com o front
router.use("/:professionalId/availabilities", availabilityRouter);

// Bloqueios de disponibilidade (criação)
router.use("/:professionalId/availability-locks", availabilityLockRouter);

export default router;
