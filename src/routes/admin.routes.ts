import { Router } from 'express';
import { adminLogin, getAdminStats } from '../controllers/admin.controller';
import adminAuth from '../middlewares/admin.middleware';

const router = Router();

router.post('/login', adminLogin);
router.get('/stats', adminAuth, getAdminStats);

export default router;
