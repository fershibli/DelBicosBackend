import { Router } from "express";
import { getAllSubCategories } from "../controllers/subCategory.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Subcategories
 *   description: Gerenciamento de subcategorias
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Subcategory:
 *       type: object
 *       required:
 *         - title
 *         - category_id
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-gerado da subcategoria
 *         title:
 *           type: string
 *           description: Nome da subcategoria
 *           minLength: 3
 *           maxLength: 100
 *         description:
 *           type: string
 *           nullable: true
 *           description: Descrição detalhada da subcategoria
 *           maxLength: 500
 *         category_id:
 *           type: integer
 *           description: ID da categoria pai
 *         active:
 *           type: boolean
 *           description: Indica se a subcategoria está ativa
 *           default: true
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
 *         title: "Corte Masculino"
 *         description: "Cortes de cabelo para homens"
 *         category_id: 1
 *         active: true
 *         createdAt: "2023-01-01T00:00:00.000Z"
 *         updatedAt: "2023-01-01T00:00:00.000Z"
 *
 *     SubcategoryInput:
 *       type: object
 *       required:
 *         - title
 *         - category_id
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *         description:
 *           type: string
 *           nullable: true
 *           maxLength: 500
 *         category_id:
 *           type: integer
 *         active:
 *           type: boolean
 *       example:
 *         title: "Corte Masculino"
 *         description: "Cortes de cabelo para homens"
 *         category_id: 1
 *         active: true
 */

/**
 * @swagger
 * /subcategories/category/{id}:
 *   get:
 *     summary: Retorna todas as subcategorias ativas de uma categoria específica
 *     tags: [Subcategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Lista de subcategorias ativas da categoria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subcategory'
 *       404:
 *         description: Categoria não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/category/:id", getAllSubCategories);

export default router;
