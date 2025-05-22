import { Router } from 'express';
import { getUser, getAllUsers, getUserById, updateUser } from '../controllers/homeController';

const router = Router();

router.get('/user/:phoneNumber', getUser);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);

export default router;