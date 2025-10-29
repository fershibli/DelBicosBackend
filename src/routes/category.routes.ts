import { Router } from "express";
import { getAllCategories } from "../controllers/category.controller";
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Gerenciamento de categorias
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-gerado da categoria
 *         title:
 *           type: string
 *           description: Nome da categoria
 *           minLength: 3
 *           maxLength: 100
 *         description:
 *           type: string
 *           nullable: true
 *           description: Descrição detalhada da categoria
 *           maxLength: 500
 *         active:
 *           type: boolean
 *           description: Indica se a categoria está ativa
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
 *         title: "Cabelo"
 *         description: "Serviços relacionados a cabelo"
 *         active: true
 *         createdAt: "2023-01-01T00:00:00.000Z"
 *         updatedAt: "2023-01-01T00:00:00.000Z"
 *
 *     CategoryInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *         description:
 *           type: string
 *           nullable: true
 *           maxLength: 500
 *         active:
 *           type: boolean
 *       example:
 *         title: "Cabelo"
 *         description: "Serviços relacionados a cabelo"
 *         active: true
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retorna todas as categorias ativas
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorias ativas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/", getAllCategories);

export default router;
