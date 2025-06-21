import express from "express";
import {
  createAddress,
  getAllAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController";

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
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
 *         active:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
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
 *     AddressInput:
 *       type: object
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
 */

/**
 * @openapi
 * /addresses:
 *   post:
 *     summary: Cria um novo endereço
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
 */
router.post("/addresses", createAddress);

/**
 * @openapi
 * /addresses:
 *   get:
 *     summary: Retorna todos os endereços
 *     responses:
 *       200:
 *         description: Lista de endereços
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 */
router.get("/addresses", getAllAddresses);

/**
 * @openapi
 * /addresses/{id}:
 *   get:
 *     summary: Retorna um endereço por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Endereço encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       404:
 *         description: Endereço não encontrado
 */
router.get("/addresses/:id", getAddressById);

/**
 * @openapi
 * /addresses/{id}:
 *   put:
 *     summary: Atualiza um endereço existente
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
 *             $ref: '#/components/schemas/AddressInput'
 *     responses:
 *       200:
 *         description: Endereço atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       404:
 *         description: Endereço não encontrado
 */
router.put("/addresses/:id", updateAddress);

/**
 * @openapi
 * /addresses/{id}:
 *   delete:
 *     summary: Remove um endereço
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Endereço removido com sucesso
 *       404:
 *         description: Endereço não encontrado
 */
router.delete("/addresses/:id", deleteAddress);

export default router;
