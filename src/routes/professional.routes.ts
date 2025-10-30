import { Router } from "express";
import {
  getProfessionals,
  getProfessionalById,
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

export default router;
