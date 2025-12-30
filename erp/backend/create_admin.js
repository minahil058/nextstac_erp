
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load Env BEFORE importing dbAdapter
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('Env Loaded. SUPABASE_URL present:', !!process.env.SUPABASE_URL);

// Dynamic Import
const { default: dbAdapter } = await import('./dbAdapter.js');

const admins = [
    { email: 'malikmubashiraslam@gmail.com', role: 'super_admin', name: 'Malik Super Admin', department: 'Management' },
    { email: 'awaisties@gmail.com', role: 'ecommerce_admin', name: 'Awais Ecom', department: 'E-commerce' },
    { email: 'zuhairshad140@gmail.com', role: 'dev_admin', name: 'Zuhair Dev', department: 'Web Development' }
];

const seed = async () => {
    console.log('--- Seeding Admins (Supabase Target) ---');
    for (const admin of admins) {
        try {
            // Force create/update. 
            // Since we want to FIX permissions, we check if exists.

            const existing = await dbAdapter.findUserByEmail(admin.email);

            if (existing) {
                console.log(`User ${admin.email} found. Updating role to ${admin.role}...`);
                // Ensure they have the correct role and status='Invited' (or active if we want)
                // If they are Active, we just fix the role.
                // If they are Invited, we keep Invited.
                // We use 'Invited' to trigger syncProfile? No, syncProfile triggers if (Invited OR ID mismatch).
                // If mismatched ID (placeholder), we need it to trigger.
                // If we update here, we don't change ID.

                await dbAdapter.updateUser(existing.id, {
                    role: admin.role,
                    department: admin.department
                });
                console.log('Updated.');
            } else {
                console.log(`Creating Invite for: ${admin.email} -> ${admin.role}`);
                await dbAdapter.createUser({
                    id: crypto.randomUUID(),
                    email: admin.email,
                    name: admin.name,
                    role: admin.role,
                    status: 'Invited',
                    department: admin.department,
                    password_hash: 'placeholder'
                });
                console.log('Created.');
            }
        } catch (e) {
            console.error(`Error processing ${admin.email}:`, e.message);
        }
    }
    console.log('--- Done ---');
    process.exit(0);
};

seed();
