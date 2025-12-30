import express from 'express';
import * as crmController from '../controllers/crmController.js';
import { verifySupabaseToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all CRM routes with JWT authentication
router.use(verifySupabaseToken);

router.get('/customers', crmController.getCustomers);
router.post('/customers', crmController.createCustomer);
router.put('/customers/:id', crmController.updateCustomer);
router.delete('/customers/:id', crmController.deleteCustomer);

// Leads
router.get('/leads', crmController.getLeads);
router.post('/leads', crmController.createLead);
router.put('/leads/:id', crmController.updateLead);
router.delete('/leads/:id', crmController.deleteLead);

export default router;
