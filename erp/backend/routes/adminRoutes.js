import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { verifySupabaseToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all admin routes with JWT authentication and admin role
router.use(verifySupabaseToken);
router.use(requireAdmin);

// Admin user management
router.get('/users', adminController.getAdmins);
router.put('/users/:id', adminController.updateAdmin);
router.delete('/users/:id', adminController.deleteAdmin);

// Compensation config
router.get('/compensation-config', adminController.getCompensationConfig);
router.put('/compensation-config', adminController.updateCompensationConfig);

export default router;
