import { Router } from 'express';
import { confirmNumber } from '../controllers/confirmNumberController';
import { verifyCode } from '../controllers/confirmCodeController';
import { register } from '../controllers/registerController';

const router = Router();

router.post('/confirm-number', confirmNumber);
router.post('/verify-code', verifyCode);
router.post('/users', register); // Ajustado para /users conforme README

export default router;