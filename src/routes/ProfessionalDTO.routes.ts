import { Router } from "express";
import { ProfessionalDTOController } from "../controllers/ProfessionalDTOController";

const router = Router();
const controller = new ProfessionalDTOController();

/**
 * @swagger
 * tags:
 *   name: Professionals
 *   description: Gerenciamento de profissionais
 */

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
 *             $ref: '#/components/schemas/Professional'
 *     responses:
 *       201:
 *         description: Profissional criado com sucesso
 */
router.post("/", controller.create);

/**
 * @swagger
 * /professionals:
 *   get:
 *     summary: Lista todos os profissionais
 *     tags: [Professionals]
 *     responses:
 *       200:
 *         description: Lista de profissionais
 */
router.get("/", controller.findAll);

/**
 * @swagger
 * /professionals/{id}:
 *   get:
 *     summary: Busca profissional por ID
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Profissional encontrado
 *       404:
 *         description: Profissional não encontrado
 */
router.get("/:id", controller.findById);

/**
 * @swagger
 * /professionals/{id}:
 *   put:
 *     summary: Atualiza um profissional
 *     tags: [Professionals]
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
 *             $ref: '#/components/schemas/Professional'
 *     responses:
 *       200:
 *         description: Profissional atualizado
 */
router.put("/:id", controller.update);

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
 *     responses:
 *       204:
 *         description: Profissional removido com sucesso
 */
router.delete("/:id", controller.delete);

export default router;
