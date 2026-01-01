import dbAdapter from './dbAdapter.js';
import db from './db.js';
import { v4 as uuidv4 } from 'uuid';

const insertAdmins = async () => {
    console.log('Starting manual admin insertion...');

    const newAdmins = [
        {
            email: 'awaisties@gmail.com',
            name: 'Awais (E-com Admin)',
            role: 'ecommerce_admin',
            department: 'E-commerce',
            hash: 'SUPABASE_AUTH' // Uses Supabase Auth
        },
        {
            email: 'zuhairshad140@gmail.com',
            name: 'Zuhair (Web Dev Admin)',
            role: 'dev_admin',
            department: 'Web Development',
            hash: 'SUPABASE_AUTH' // Uses Supabase Auth
        }
    ];

    try {
        // Wait for DB connection
        setTimeout(async () => {
            console.log(`Checking for existing users...`);

            for (const admin of newAdmins) {
                const existing = await dbAdapter.findUserByEmail(admin.email);
                if (existing) {
                    console.log(`User ${admin.email} already exists. Updating role...`);
                    // Update role if it's wrong, but dbAdapter.updateUser might not expose role update easily depending on impl
                    // Let's use SQlite direct or just skip if exists?
                    // User says they are NOT in the list, so likely don't exist.
                    // But if they do, we should ensure role is correct.

                    // Since update_user implementation is limited, let's delete and re-add to be sure strictly for this fix?
                    // Or just log it.
                    console.warn(`Skipping insertion for ${admin.email}, user already found.`);
                } else {
                    const newUser = {
                        id: uuidv4(),
                        name: admin.name,
                        email: admin.email,
                        password_hash: admin.hash,
                        role: admin.role,
                        status: 'Active',
                        department: admin.department
                    };
                    await dbAdapter.createUser(newUser);
                    console.log(`✅ Created user: ${admin.email} as ${admin.role}`);
                }
            }

            console.log('Insertion complete.');
            process.exit(0);
        }, 1000);
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
};

insertAdmins();
