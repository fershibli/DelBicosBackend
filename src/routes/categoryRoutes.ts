import { Router } from "express";import { CategoryController } from "../controllers/categoryController";
;

const router = Router();
const controller = new CategoryController();

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
 *   post:
 *     summary: Cria uma nova categoria
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Dados inválidos ou título muito curto/longo
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", controller.create.bind(controller));

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
router.get("/", controller.getAll.bind(controller));

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Retorna uma categoria pelo ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Dados da categoria
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Categoria não encontrada ou inativa
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", controller.getById.bind(controller));

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Atualiza uma categoria existente
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Dados inválidos ou título muito curto/longo
 *       404:
 *         description: Categoria não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put("/:id", controller.update.bind(controller));

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Desativa uma categoria (exclusão lógica)
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria
 *     responses:
 *       204:
 *         description: Categoria desativada com sucesso
 *       404:
 *         description: Categoria não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/:id", controller.delete.bind(controller));

export default router;