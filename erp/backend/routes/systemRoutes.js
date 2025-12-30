import express from 'express';
import * as systemController from '../controllers/systemController.js';
import { verifySupabaseToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all system routes with JWT authentication
router.use(verifySupabaseToken);

router.get('/logs', systemController.getLogs);
router.get('/company-profile', systemController.getCompanyProfile);

export default router;
