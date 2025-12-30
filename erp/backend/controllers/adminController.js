import dbAdapter from '../dbAdapter.js';

// Get all admin users
export const getAdmins = async (req, res) => {
    try {
        // Fetch all users from database
        const users = await dbAdapter.getAllUsers();

        // Transform to match frontend expectations  
        const admins = users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status || 'Active',
            sharePercentage: user.share_percentage || 0,
            department: user.department
        }));

        res.json(admins);
    } catch (error) {
        console.error('Get admins error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update admin user
export const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Convert camelCase to snake_case for database
        const dbUpdates = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.email !== undefined) dbUpdates.email = updates.email;
        if (updates.role !== undefined) dbUpdates.role = updates.role;
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.sharePercentage !== undefined) dbUpdates.share_percentage = updates.sharePercentage;
        if (updates.department !== undefined) dbUpdates.department = updates.department;

        await dbAdapter.updateUser(id, dbUpdates);

        const updatedUser = await dbAdapter.findUserById(id);

        res.json({
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            status: updatedUser.status,
            sharePercentage: updatedUser.share_percentage,
            department: updatedUser.department
        });
    } catch (error) {
        console.error('Update admin error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Delete admin user
export const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        await dbAdapter.deleteUser(id);

        res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        console.error('Delete admin error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get compensation config (stored in a config table or settings)
export const getCompensationConfig = async (req, res) => {
    try {
        // For now, return a default config
        // TODO: Store this in a settings/config table
        const config = {
            basePool: 10000 // Default value
        };

        res.json(config);
    } catch (error) {
        console.error('Get config error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update compensation config
export const updateCompensationConfig = async (req, res) => {
    try {
        const { basePool } = req.body;

        // TODO: Store this in a database table
        // For now, just return success
        res.json({ basePool });
    } catch (error) {
        console.error('Update config error:', error);
        res.status(500).json({ error: error.message });
    }
};
