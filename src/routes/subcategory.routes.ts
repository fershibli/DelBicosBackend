import { Router } from "express";
import {
  createSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  getByIdSubCategory,
  updateSubCategory,
} from "../controllers/subCategory.controller";

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
 * /subcategories:
 *   post:
 *     summary: Cria uma nova subcategoria
 *     tags: [Subcategories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubcategoryInput'
 *     responses:
 *       201:
 *         description: Subcategoria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subcategory'
 *       400:
 *         description: Dados inválidos ou título/category_id não informado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 message:
 *                   type: string
 *                 sql:
 *                   type: string
 *                 sqlMessage:
 *                   type: string
 *       404:
 *         description: Categoria pai não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", createSubCategory);

/**
 * @swagger
 * /subcategories:
 *   get:
 *     summary: Retorna todas as subcategorias ativas
 *     tags: [Subcategories]
 *     parameters:
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: Filtrar subcategorias por ID de categoria
 *     responses:
 *       200:
 *         description: Lista de subcategorias ativas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subcategory'
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/", getAllSubCategories);

/**
 * @swagger
 * /subcategories/{id}:
 *   get:
 *     summary: Retorna uma subcategoria pelo ID
 *     tags: [Subcategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da subcategoria
 *     responses:
 *       200:
 *         description: Dados da subcategoria
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subcategory'
 *       404:
 *         description: Subcategoria não encontrada ou inativa
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", getByIdSubCategory);

/**
 * @swagger
 * /subcategories/{id}:
 *   put:
 *     summary: Atualiza uma subcategoria existente
 *     tags: [Subcategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da subcategoria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubcategoryInput'
 *     responses:
 *       200:
 *         description: Subcategoria atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subcategory'
 *       400:
 *         description: Dados inválidos ou título/category_id não informado
 *       404:
 *         description: Subcategoria ou categoria pai não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put("/:id", updateSubCategory);

/**
 * @swagger
 * /subcategories/{id}:
 *   delete:
 *     summary: Desativa uma subcategoria (exclusão lógica)
 *     tags: [Subcategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da subcategoria
 *     responses:
 *       204:
 *         description: Subcategoria desativada com sucesso
 *       404:
 *         description: Subcategoria não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/:id", deleteSubCategory);

export default router;
