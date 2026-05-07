"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const professional_controller_1 = require("../controllers/professional.controller");
const router = (0, express_1.Router)();
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
router.get("/", professional_controller_1.getProfessionals);
router.get("/search-availability", professional_controller_1.searchProfessionalAvailability);
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
router.get("/:id", professional_controller_1.getProfessionalById);
exports.default = router;
