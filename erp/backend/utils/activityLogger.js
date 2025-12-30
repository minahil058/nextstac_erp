import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Log a system activity
 * @param {Object} req - The Express request object (contains user info)
 * @param {string} action - Describe the action (e.g. 'Created Invoice', 'Deleted File')
 * @param {string} module - The module name (e.g. 'Finance', 'Documents', 'Auth')
 */
export const logActivity = (req, action, module) => {
    try {
        const id = uuidv4();
        // Fallback if req.user is missing (e.g. public action or internal system job)
        const userId = req.userId || null;
        const userEmail = req.userEmail || 'System';
        const userName = req.user?.user_metadata?.full_name || req.userEmail || 'System';
        const ip = req.ip || req.connection.remoteAddress || 'Unknown';

        const sql = `INSERT INTO activity_logs (id, user_id, user_name, action, module, ip_address, timestamp) 
                     VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`;

        db.run(sql, [id, userId, userName, action, module, ip], (err) => {
            if (err) {
                console.error('Failed to write activity log:', err.message);
            }
        });

    } catch (error) {
        console.error('Logger Error:', error);
    }
};
