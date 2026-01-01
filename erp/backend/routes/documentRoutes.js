import express from 'express';
import { upload, uploadFile, getFiles, deleteFile, downloadFile, approveFile, rejectFile } from '../controllers/documentController.js';

import { verifySupabaseToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public download (optional, or protect it?)
// For now, let's protect everything to ensure user context is available
router.use(verifySupabaseToken);

router.post('/upload', upload.single('file'), uploadFile);
router.get('/', getFiles);
router.put('/:id/approve', approveFile);
router.put('/:id/reject', rejectFile); // Rejecting essentially deletes it
router.delete('/:id', deleteFile);
router.get('/download/:id', downloadFile);

export default router;
