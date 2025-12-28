import express from 'express';
import { getOrders, createOrder } from '../controllers/salesController.js';

const router = express.Router();

router.get('/orders', getOrders);
router.post('/orders', createOrder);

export default router;
