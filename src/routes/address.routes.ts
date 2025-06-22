import express from "express";
import {
  createAddress,
  getAllAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} from "../controllers/address.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: Gerenciamento de endereços
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       required:
 *         - lat
 *         - lng
 *         - street
 *         - number
 *         - neighborhood
 *         - city
 *         - state
 *         - country_iso
 *         - postal_code
 *         - user_id
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-gerado do endereço
 *         lat:
 *           type: number
 *           format: float
 *           description: Latitude geográfica
 *         lng:
 *           type: number
 *           format: float
 *           description: Longitude geográfica
 *         street:
 *           type: string
 *           description: Nome da rua/avenida
 *         number:
 *           type: string
 *           description: Número do endereço
 *         complement:
 *           type: string
 *           nullable: true
 *           description: Complemento do endereço
 *         neighborhood:
 *           type: string
 *           description: Bairro
 *         city:
 *           type: string
 *           description: Cidade
 *         state:
 *           type: string
 *           description: Estado/Província
 *         country_iso:
 *           type: string
 *           description: Código ISO do país
 *         postal_code:
 *           type: string
 *           description: Código postal/CEP
 *         user_id:
 *           type: integer
 *           description: ID do usuário associado
 *         active:
 *           type: boolean
 *           description: Status de ativação do endereço
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
 *         lat: -23.5505
 *         lng: -46.6333
 *         street: "Avenida Paulista"
 *         number: "1000"
 *         complement: "Apto 123"
 *         neighborhood: "Bela Vista"
 *         city: "São Paulo"
 *         state: "SP"
 *         country_iso: "BR"
 *         postal_code: "01310000"
 *         user_id: 1
 *         active: true
 *         createdAt: "2023-01-01T00:00:00.000Z"
 *         updatedAt: "2023-01-01T00:00:00.000Z"
 *
 *     AddressInput:
 *       type: object
 *       required:
 *         - lat
 *         - lng
 *         - street
 *         - number
 *         - neighborhood
 *         - city
 *         - state
 *         - country_iso
 *         - postal_code
 *         - user_id
 *       properties:
 *         lat:
 *           type: number
 *           format: float
 *         lng:
 *           type: number
 *           format: float
 *         street:
 *           type: string
 *         number:
 *           type: string
 *         complement:
 *           type: string
 *           nullable: true
 *         neighborhood:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         country_iso:
 *           type: string
 *         postal_code:
 *           type: string
 *         user_id:
 *           type: integer
 *       example:
 *         lat: -23.5505
 *         lng: -46.6333
 *         street: "Avenida Paulista"
 *         number: "1000"
 *         complement: "Apto 123"
 *         neighborhood: "Bela Vista"
 *         city: "São Paulo"
 *         state: "SP"
 *         country_iso: "BR"
 *         postal_code: "01310000"
 *         user_id: 1
 */

/**
 * @swagger
 * /addresses:
 *   post:
 *     summary: Cria um novo endereço
 *     tags: [Addresses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressInput'
 *     responses:
 *       201:
 *         description: Endereço criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/addresses", createAddress);

/**
 * @swagger
 * /addresses:
 *   get:
 *     summary: Retorna todos os endereços
 *     tags: [Addresses]
 *     responses:
 *       200:
 *         description: Lista de endereços
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/addresses", getAllAddresses);

/**
 * @swagger
 * /addresses/{id}:
 *   get:
 *     summary: Retorna um endereço por ID
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do endereço
 *     responses:
 *       200:
 *         description: Endereço encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       404:
 *         description: Endereço não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/addresses/:id", getAddressById);

/**
 * @swagger
 * /addresses/{id}:
 *   put:
 *     summary: Atualiza um endereço existente
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do endereço
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressInput'
 *     responses:
 *       200:
 *         description: Endereço atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Endereço não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put("/addresses/:id", updateAddress);

/**
 * @swagger
 * /addresses/{id}:
 *   delete:
 *     summary: Remove um endereço
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do endereço
 *     responses:
 *       200:
 *         description: Endereço removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Endereço deletado com sucesso
 *       404:
 *         description: Endereço não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/addresses/:id", deleteAddress);

export default router;
