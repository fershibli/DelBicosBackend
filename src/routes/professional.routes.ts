import { Router } from "express";
import {
  getProfessionals,
  getProfessionalById,
  createProfessional,
  updateProfessional,
  deleteProfessional,
} from "../controllers/professional.controller";

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

/**
 * @swagger
 * /professionals:
 *   post:
 *     summary: Cria um novo profissional
 *     tags: [Profissionais]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - cpf
 *             properties:
 *               user_id:
 *                 type: integer
 *               main_address_id:
 *                 type: integer
 *               cpf:
 *                 type: string
 *               cnpj:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Profissional criado com sucesso
 *       500:
 *         description: Erro ao criar profissional
 */
router.post("/", createProfessional);

/**
 * @swagger
 * /professionals/{id}:
 *   put:
 *     summary: Atualiza um profissional existente
 *     tags: [Profissionais]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do profissional
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               main_address_id:
 *                 type: integer
 *               cpf:
 *                 type: string
 *               cnpj:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profissional atualizado com sucesso
 *       404:
 *         description: Profissional não encontrado
 */
router.put("/:id", updateProfessional);

/**
 * @swagger
 * /professionals/{id}:
 *   delete:
 *     summary: Remove um profissional
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
 *         description: Profissional removido com sucesso
 *       404:
 *         description: Profissional não encontrado
 */
router.delete("/:id", deleteProfessional);

export default router;
