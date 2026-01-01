import dbAdapter from './dbAdapter.js';
import db from './db.js';

const cleanup = async () => {
    console.log('Starting cleanup...');
    try {
        // Wait for DB connection
        setTimeout(async () => {
            const users = await dbAdapter.getAllUsers();
            console.log(`Found ${users.length} users.`);

            const usersToDelete = users.filter(u => u.email === 'zuhair@gmail.com' || u.email === 'zuhair@test.com' || (u.role === 'super_admin' && u.email !== 'malikmubashiraslam@gmail.com'));

            if (usersToDelete.length === 0) {
                console.log('No users found to delete.');
            } else {
                console.log(`Found ${usersToDelete.length} users to delete:`, usersToDelete.map(u => u.email));

                for (const user of usersToDelete) {
                    await dbAdapter.deleteUser(user.id);
                    console.log(`Deleted user: ${user.email} (${user.id})`);
                }
            }
            console.log('Cleanup complete.');
            process.exit(0);
        }, 1000); // Small delay for DB connection
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
};

cleanup();
