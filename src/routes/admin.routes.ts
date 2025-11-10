import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import adminAuth from '../middlewares/admin.middleware';

const router = Router();

router.post('/login', AdminController.login);
router.get('/stats', adminAuth, AdminController.stats);

export default router;
