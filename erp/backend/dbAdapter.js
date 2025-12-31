import db from './db.js';
import supabase from './supabaseClient.js';

const isVercel = process.env.VERCEL === '1' || (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
const useSupabase = !!supabase;

const dbAdapter = {
    // --- User Operations ---

    // Get All Users
    getAllUsers: async () => {
        if (useSupabase) {
            if (!supabase) throw new Error('Supabase client not initialized (Missing Env Vars)');
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw new Error(error.message);
            return data || [];
        } else {
            return new Promise((resolve, reject) => {
                db.all("SELECT * FROM users ORDER BY created_at DESC", [], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
        }
    },

    // Find User By ID
    findUserById: async (id) => {
        if (useSupabase) {
            if (!supabase) throw new Error('Supabase client not initialized (Missing Env Vars)');
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw new Error(error.message);
            return data;
        } else {
            return new Promise((resolve, reject) => {
                db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
        }
    },

    // Find User By Email
    findUserByEmail: async (email) => {
        if (useSupabase) {
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
        if (useSupabase) {
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
        if (useSupabase) {
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
    },

    // Delete User
    deleteUser: async (id) => {
        if (useSupabase) {
            if (!supabase) throw new Error('Supabase client not initialized (Missing Env Vars)');
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', id);

            if (error) throw new Error(error.message);
            return true;
        } else {
            return new Promise((resolve, reject) => {
                const stmt = db.prepare("DELETE FROM users WHERE id = ?");
                stmt.run(id, function (err) {
                    if (err) reject(err);
                    else resolve(true);
                });
                stmt.finalize();
            });
        }
    }
};

export default dbAdapter;
