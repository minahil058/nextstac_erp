import express from 'express';
import * as hrController from '../controllers/hrController.js';
import { verifySupabaseToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all HR routes with JWT authentication
router.use(verifySupabaseToken);

router.get('/employees', hrController.getAllEmployees);
router.get('/employees/:id', hrController.getEmployeeById);
router.post('/employees', hrController.createEmployee);
router.put('/employees/:id', hrController.updateEmployee);
router.delete('/employees/:id', hrController.deleteEmployee);

// Leaves
router.get('/leaves', hrController.getAllLeaves);
router.post('/leaves', hrController.createLeave);
router.put('/leaves/:id/status', hrController.updateLeaveStatus);

export default router;
