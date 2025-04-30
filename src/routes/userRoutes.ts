import { Router } from 'express';
import { getUser } from '../controllers/homeController';

const router = Router();

router.get('/user/:phoneNumber', getUser);

export default router;