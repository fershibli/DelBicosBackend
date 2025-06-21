import express from "express";
import {
  getProfessionals,
  createProfessional,
  updateProfessional,
  deleteProfessional,
} from "../controllers/professionalController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Professionals
 *   description: Gerenciamento de profissionais
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Professional:
 *       type: object
 *       required:
 *         - user_id
 *         - cpf
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-gerado do profissional
 *         user_id:
 *           type: integer
 *           description: ID do usuário associado ao profissional
 *         main_address_id:
 *           type: integer
 *           nullable: true
 *           description: ID do endereço principal do profissional
 *         cpf:
 *           type: string
 *           description: CPF do profissional (somente números)
 *           example: "12345678901"
 *         cnpj:
 *           type: string
 *           nullable: true
 *           description: CNPJ do profissional (se aplicável)
 *           example: "12345678000199"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *       example:
 *         id: 1
 *         user_id: 5
 *         main_address_id: 3
 *         cpf: "12345678901"
 *         cnpj: "12345678000199"
 *         createdAt: "2023-01-01T00:00:00.000Z"
 *         updatedAt: "2023-01-01T00:00:00.000Z"
 * 
 *     ProfessionalInput:
 *       type: object
 *       required:
 *         - user_id
 *         - cpf
 *       properties:
 *         user_id:
 *           type: integer
 *         main_address_id:
 *           type: integer
 *           nullable: true
 *         cpf:
 *           type: string
 *         cnpj:
 *           type: string
 *           nullable: true
 *       example:
 *         user_id: 5
 *         main_address_id: 3
 *         cpf: "12345678901"
 *         cnpj: "12345678000199"
 */

/**
 * @swagger
 * /professionals:
 *   get:
 *     summary: Lista todos os profissionais com filtros opcionais
 *     tags: [Professionals]
 *     parameters:
 *       - in: query
 *         name: termo
 *         schema:
 *           type: string
 *         description: Termo para busca por nome, localização, categoria ou subcategoria
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *           format: float
 *         description: Latitude para cálculo de distância
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *           format: float
 *         description: Longitude para cálculo de distância
 *       - in: query
 *         name: raio_km
 *         schema:
 *           type: number
 *           format: float
 *           default: 10
 *         description: Raio em quilômetros para filtro de distância
 *     responses:
 *       200:
 *         description: Lista de profissionais retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Professional'
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/professionals", getProfessionals);

/**
 * @swagger
 * /professionals:
 *   post:
 *     summary: Cria um novo profissional
 *     tags: [Professionals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfessionalInput'
 *     responses:
 *       201:
 *         description: Profissional criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professional'
 *       400:
 *         description: Dados de entrada inválidos
 *       500:
 *         description: Erro ao criar profissional
 */
router.post("/professionals", createProfessional);

/**
 * @swagger
 * /professionals/{id}:
 *   put:
 *     summary: Atualiza um profissional existente
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do profissional a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfessionalInput'
 *     responses:
 *       200:
 *         description: Profissional atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professional'
 *       400:
 *         description: Dados de entrada inválidos
 *       404:
 *         description: Profissional não encontrado
 *       500:
 *         description: Erro ao atualizar profissional
 */
router.put("/professionals/:id", updateProfessional);

/**
 * @swagger
 * /professionals/{id}:
 *   delete:
 *     summary: Remove um profissional
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do profissional a ser removido
 *     responses:
 *       200:
 *         description: Profissional removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profissional deletado com sucesso
 *       404:
 *         description: Profissional não encontrado
 *       500:
 *         description: Erro ao remover profissional
 */
router.delete("/professionals/:id", deleteProfessional);

export default router;