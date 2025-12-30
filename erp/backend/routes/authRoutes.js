import express from 'express';
import * as authController from '../controllers/authController.js';
import { verifySupabaseToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// NOTE: login and register routes removed - now handled by Supabase Auth on frontend
// Only keeping invite route for admin-initiated user invitations
console.log('Registering /invite route');
router.post('/invite', verifySupabaseToken, authController.inviteUser);

console.log('Registering /sync-profile route');
router.post('/sync-profile', verifySupabaseToken, authController.syncProfile);

export default router;
