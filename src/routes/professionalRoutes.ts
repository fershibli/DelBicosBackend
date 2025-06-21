import express from "express";
import {
  getProfessionals,
  createProfessional,
  updateProfessional,
  deleteProfessional,
} from "../controllers/professionalController";

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Professional:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
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
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - user_id
 *         - cpf
 *     ProfessionalInput:
 *       type: object
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
 *       required:
 *         - user_id
 *         - cpf
 */

/**
 * @openapi
 * /professionals:
 *   get:
 *     summary: Lista profissionais com filtros opcionais
 *     parameters:
 *       - in: query
 *         name: termo
 *         schema:
 *           type: string
 *         description: Termo para busca por nome, localização categoria ou subcategoria
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         description: Latitude para cálculo de distância
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         description: Longitude para cálculo de distância
 *       - in: query
 *         name: raio_km
 *         schema:
 *           type: number
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
 * @openapi
 * /professionals:
 *   post:
 *     summary: Cria um novo profissional
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
 *       500:
 *         description: Erro ao criar profissional
 */
router.post("/professionals", createProfessional);

/**
 * @openapi
 * /professionals/{id}:
 *   put:
 *     summary: Atualiza um profissional existente
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
 *       404:
 *         description: Profissional não encontrado
 *       500:
 *         description: Erro ao atualizar profissional
 */
router.put("/professionals/:id", updateProfessional);

/**
 * @openapi
 * /professionals/{id}:
 *   delete:
 *     summary: Remove um profissional
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
 *       404:
 *         description: Profissional não encontrado
 *       500:
 *         description: Erro ao remover profissional
 */
router.delete("/professionals/:id", deleteProfessional);

export default router;
