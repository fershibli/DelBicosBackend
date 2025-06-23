import { Router } from "express";
import { confirmNumber } from "../controllers/confirmNumber.controller";
import { verifyCode } from "../controllers/confirmCode.controller";
import { getUserById, logInUser, signUpUser } from "../controllers/user.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Autenticação e registro de usuários
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PhoneNumberRequest:
 *       type: object
 *       required:
 *         - phoneNumber
 *       properties:
 *         phoneNumber:
 *           type: string
 *           description: Número de telefone do usuário
 *           minLength: 10
 *           example: "11999999999"
 *
 *     PhoneNumberResponse:
 *       type: object
 *       properties:
 *         exists:
 *           type: boolean
 *           description: Indica se o número já está registrado
 *         message:
 *           type: string
 *           description: Mensagem de status
 *       example:
 *         exists: true
 *         message: "Usuário existente, envie o código SMS"
 *
 *     VerifyCodeRequest:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - code
 *       properties:
 *         phoneNumber:
 *           type: string
 *           minLength: 10
 *         code:
 *           type: string
 *           minLength: 4
 *           maxLength: 4
 *           description: Código SMS de 4 dígitos
 *       example:
 *         phoneNumber: "11999999999"
 *         code: "1234"
 *
 *     VerifyCodeResponse:
 *       type: object
 *       properties:
 *         exists:
 *           type: boolean
 *         user:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             location:
 *               type: string
 *       examples:
 *         existsTrue:
 *           value:
 *             exists: true
 *             user:
 *               name: "João Silva"
 *               location: "São Paulo"
 *         existsFalse:
 *           value:
 *             exists: false
 *
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - firstName
 *         - lastName
 *         - birthDate
 *         - gender
 *         - location
 *         - email
 *         - password
 *       properties:
 *         phoneNumber:
 *           type: string
 *           minLength: 10
 *         firstName:
 *           type: string
 *           minLength: 2
 *         lastName:
 *           type: string
 *           minLength: 2
 *         birthDate:
 *           type: string
 *           format: date
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *         location:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 6
 *       example:
 *         phoneNumber: "11999999999"
 *         firstName: "João"
 *         lastName: "Silva"
 *         birthDate: "1990-01-01"
 *         gender: "male"
 *         location: "São Paulo"
 *         email: "joao@example.com"
 *         password: "senha123"
 *
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *       example:
 *         message: "Usuário registrado com sucesso"
 */

router.post("/register", signUpUser);

router.post("/login", logInUser);

/**
 * @swagger
 * /user/confirm-number:
 *   post:
 *     summary: Verifica se um número de telefone está registrado
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PhoneNumberRequest'
 *     responses:
 *       200:
 *         description: Resposta sobre a existência do número
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PhoneNumberResponse'
 *       400:
 *         description: Número de telefone inválido
 *       500:
 *         description: Erro no servidor
 */

router.post("/confirm-number", confirmNumber);

/**
 * @swagger
 * /auth/verify-code:
 *   post:
 *     summary: Verifica um código SMS e retorna informações do usuário se existir
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyCodeRequest'
 *     responses:
 *       200:
 *         description: Resposta sobre a existência do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerifyCodeResponse'
 *       400:
 *         description: Código ou número inválido
 *       500:
 *         description: Erro no servidor
 */
router.post("/verify-code", verifyCode);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao buscar usuário
 */
router.get("/:id", getUserById);


export default router;
