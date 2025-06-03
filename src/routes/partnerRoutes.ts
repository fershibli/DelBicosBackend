import express from 'express';
import { getPartnerProfile, createPartnerWithServices } from '../controllers/partnerController';
const router = express.Router();

router.get('/:id', getPartnerProfile);
router.post('/', createPartnerWithServices)

export default router;