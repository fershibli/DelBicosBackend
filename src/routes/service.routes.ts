import { Router } from "express";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/service.controller";

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Gerenciamento de serviços
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - title
 *         - price
 *         - duration
 *         - subcategory_id
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-gerado do serviço
 *         title:
 *           type: string
 *           description: Nome do serviço
 *         description:
 *           type: string
 *           nullable: true
 *           description: Descrição detalhada do serviço
 *         price:
 *           type: number
 *           format: float
 *           description: Preço do serviço
 *         duration:
 *           type: integer
 *           description: Duração do serviço em minutos
 *         active:
 *           type: boolean
 *           description: Status de ativação do serviço
 *           default: true
 *         subcategory_id:
 *           type: integer
 *           description: ID da subcategoria a qual o serviço pertence
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data de última atualização
 *       example:
 *         id: 1
 *         title: Corte de Cabelo
 *         description: Corte profissional com lavagem incluída
 *         price: 50.00
 *         duration: 60
 *         active: true
 *         subcategory_id: 3
 *         createdAt: "2023-01-01T00:00:00.000Z"
 *         updatedAt: "2023-01-01T00:00:00.000Z"
 *
 *     ServiceInput:
 *       type: object
 *       required:
 *         - title
 *         - price
 *         - duration
 *         - subcategory_id
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         price:
 *           type: number
 *           format: float
 *         duration:
 *           type: integer
 *         active:
 *           type: boolean
 *         subcategory_id:
 *           type: integer
 *       example:
 *         title: Corte de Cabelo
 *         description: Corte profissional com lavagem incluída
 *         price: 50.00
 *         duration: 60
 *         active: true
 *         subcategory_id: 3
 */

const router = Router();

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Retorna todos os serviços
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Lista de todos os serviços
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 *       500:
 *         description: Erro ao buscar serviços
 */
router.get("/", getAllServices);

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Retorna um serviço pelo ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do serviço
 *     responses:
 *       200:
 *         description: Dados do serviço encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       404:
 *         description: Serviço não encontrado
 *       500:
 *         description: Erro ao buscar serviço
 */
router.get("/:id", getServiceById);

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Cria um novo serviço
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceInput'
 *     responses:
 *       201:
 *         description: Serviço criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       400:
 *         description: Campos obrigatórios faltando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 required:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: Subcategoria não encontrada
 *       500:
 *         description: Erro ao criar serviço
 */
router.post("/", createService);

/**
 * @swagger
 * /services/{id}:
 *   put:
 *     summary: Atualiza um serviço existente
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do serviço a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceInput'
 *     responses:
 *       200:
 *         description: Serviço atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       404:
 *         description: Serviço não encontrado
 *       500:
 *         description: Erro ao atualizar serviço
 */
router.put("/:id", updateService);

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Remove um serviço
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do serviço a ser removido
 *     responses:
 *       200:
 *         description: Serviço removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Serviço deletado com sucesso
 *       404:
 *         description: Serviço não encontrado
 *       500:
 *         description: Erro ao deletar serviço
 */
router.delete("/:id", deleteService);

export default router;
