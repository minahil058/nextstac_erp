import db from './db.js';
import supabase from './supabaseClient.js';

const isVercel = process.env.VERCEL === '1';

const dbAdapter = {
    // --- User Operations ---

    // Find User By Email
    findUserByEmail: async (email) => {
        if (isVercel) {
            if (!supabase) throw new Error('Supabase client not initialized (Missing Env Vars)');
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 is 'Row not found'
                throw new Error(error.message);
            }
            return data || null;
        } else {
            return new Promise((resolve, reject) => {
                db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
        }
    },

    // Create User (Invite)
    createUser: async (user) => {
        if (isVercel) {
            if (!supabase) throw new Error('Supabase client not initialized (Missing Env Vars)');
            // Map camelCase to snake_case if necessary, schema seems mixed but let's stick to what authController passed
            // The authController passes object keys that map to DB columns? 
            // SQLite Insert was: id, name, email, password_hash, role, status, department
            const { error } = await supabase
                .from('users')
                .insert([user]);

            if (error) throw new Error(error.message);
            return user;
        } else {
            return new Promise((resolve, reject) => {
                const stmt = db.prepare("INSERT INTO users (id, name, email, password_hash, role, status, department) VALUES (?, ?, ?, ?, ?, ?, ?)");
                stmt.run(user.id, user.name, user.email, user.password_hash, user.role, user.status, user.department, function (err) {
                    if (err) reject(err);
                    else resolve(user);
                });
                stmt.finalize();
            });
        }
    },

    // Update User (Register/Activate)
    updateUser: async (id, updates) => {
        if (isVercel) {
            if (!supabase) throw new Error('Supabase client not initialized (Missing Env Vars)');
            const { error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', id);

            if (error) throw new Error(error.message);
            return { id, ...updates }; // Return mocked updated object (simplification)
        } else {
            return new Promise((resolve, reject) => {
                // Determine what to update dynamically or specific fields?
                // authController updates: name, password_hash, status
                const keys = Object.keys(updates);
                const values = Object.values(updates);
                const setClause = keys.map(k => `${k} = ?`).join(', ');

                const stmt = db.prepare(`UPDATE users SET ${setClause} WHERE id = ?`);
                stmt.run(...values, id, function (err) {
                    if (err) reject(err);
                    else resolve({ id, ...updates });
                });
                stmt.finalize();
            });
        }
    }
};

export default dbAdapter;
