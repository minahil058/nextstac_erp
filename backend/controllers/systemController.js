import dbAdapter from '../dbAdapter.js';

// --- System Logs ---
export const getLogs = async (req, res) => {
    try {
        const logs = await dbAdapter.system.getLogs();
        res.json(logs);
    } catch (err) {
        // Fallback or empty if error
        res.json([]);
    }
};

// --- Company Profile ---
export const getCompanyProfile = async (req, res) => {
    try {
        const profile = await dbAdapter.system.getCompanyProfile();
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
