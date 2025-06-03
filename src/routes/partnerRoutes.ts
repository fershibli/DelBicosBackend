import express from 'express';
import { getPartnerProfile } from '../controllers/partnerController';
const router = express.Router();

router.get('/:id', getPartnerProfile);

export default router;