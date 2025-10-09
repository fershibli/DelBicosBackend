import { Router } from "express";
import { 
  createAmenity, 
  getAllAmenities, 
  getByIdAmenity, 
  updateAmenity, 
  deleteAmenity 
} from "../controllers/amenities.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Amenities
 *   description: API para gerenciamento de amenities (comodidades)
 */

/**
 * @swagger
 * /amenities:
 *   post:
 *     summary: Cria uma nova amenity
 *     tags: [Amenities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Frete grátis
 *     responses:
 *       201:
 *         description: Amenity criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Amenity'
 *       500:
 *         description: Erro interno ao criar amenity
 */
router.post("/", createAmenity);

/**
 * @swagger
 * /amenities:
 *   get:
 *     summary: Lista todas as amenities
 *     tags: [Amenities]
 *     responses:
 *       200:
 *         description: Lista de amenities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Amenity'
 *       500:
 *         description: Erro interno ao listar amenities
 */
router.get("/", getAllAmenities);

/**
 * @swagger
 * /amenities/{id}:
 *   get:
 *     summary: Busca uma amenity pelo ID
 *     tags: [Amenities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da amenity
 *     responses:
 *       200:
 *         description: Amenity encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Amenity'
 *       404:
 *         description: Amenity não encontrada
 *       500:
 *         description: Erro interno
 */
router.get("/:id", getByIdAmenity);

/**
 * @swagger
 * /amenities/{id}:
 *   put:
 *     summary: Atualiza uma amenity pelo ID
 *     tags: [Amenities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da amenity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Atendimento em libras
 *     responses:
 *       200:
 *         description: Amenity atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Amenity'
 *       404:
 *         description: Amenity não encontrada
 *       500:
 *         description: Erro interno
 */
router.put("/:id", updateAmenity);

/**
 * @swagger
 * /amenities/{id}:
 *   delete:
 *     summary: Exclui uma amenity pelo ID
 *     tags: [Amenities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da amenity
 *     responses:
 *       200:
 *         description: Amenity excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comodidade excluída com sucesso
 *       404:
 *         description: Amenity não encontrada
 *       500:
 *         description: Erro interno
 */
router.delete("/:id", deleteAmenity);

export default router;
