import express from 'express';
import { getOrders, createOrder } from '../controllers/salesController.js';
import { verifySupabaseToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all sales routes with JWT authentication
router.use(verifySupabaseToken);

router.get('/orders', getOrders);
router.post('/orders', createOrder);

export default router;
