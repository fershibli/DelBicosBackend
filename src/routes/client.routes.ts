import { Router } from "express";
import {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
} from "../controllers/clientController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Gerenciamento de clientes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-gerado do cliente
 *         name:
 *           type: string
 *           description: Nome completo do cliente
 *           minLength: 3
 *           maxLength: 100
 *         email:
 *           type: string
 *           format: email
 *           description: E-mail do cliente
 *           maxLength: 100
 *         phone:
 *           type: string
 *           description: Telefone do cliente
 *           maxLength: 20
 *         address:
 *           type: string
 *           nullable: true
 *           description: Endereço do cliente
 *           maxLength: 200
 *         birth_date:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: Data de nascimento (YYYY-MM-DD)
 *         active:
 *           type: boolean
 *           description: Indica se o cliente está ativo
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data de atualização
 *       example:
 *         id: 1
 *         name: "João Silva"
 *         email: "joao@example.com"
 *         phone: "11999999999"
 *         address: "Rua Exemplo, 123"
 *         birth_date: "1990-01-01"
 *         active: true
 *         createdAt: "2023-01-01T00:00:00.000Z"
 *         updatedAt: "2023-01-01T00:00:00.000Z"
 * 
 *     ClientInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 100
 *         phone:
 *           type: string
 *           maxLength: 20
 *         address:
 *           type: string
 *           nullable: true
 *           maxLength: 200
 *         birth_date:
 *           type: string
 *           format: date
 *           nullable: true
 *         active:
 *           type: boolean
 *       example:
 *         name: "João Silva"
 *         email: "joao@example.com"
 *         phone: "11999999999"
 *         address: "Rua Exemplo, 123"
 *         birth_date: "1990-01-01"
 *         active: true
 */

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientInput'
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       400:
 *         description: Dados inválidos ou campos obrigatórios faltando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       409:
 *         description: E-mail já cadastrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/", createClient);

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Retorna todos os clientes
 *     tags: [Clients]
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filtrar por status ativo/inativo
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nome ou e-mail
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/", getAllClients);

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     summary: Retorna um cliente pelo ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Dados do cliente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", getClientById);

/**
 * @swagger
 * /clients/{id}:
 *   put:
 *     summary: Atualiza um cliente existente
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientInput'
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Cliente não encontrado
 *       409:
 *         description: Novo e-mail já está em uso por outro cliente
 *       500:
 *         description: Erro interno do servidor
 */
router.put("/:id", updateClient);

/**
 * @swagger
 * /clients/{id}:
 *   delete:
 *     summary: Remove um cliente
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cliente removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cliente deletado com sucesso
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/:id", deleteClient);

export default router;