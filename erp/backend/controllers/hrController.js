import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';

export const getAllEmployees = (req, res) => {
    const sql = `SELECT 
        id, 
        first_name as firstName, 
        last_name as lastName, 
        email, 
        cnic,
        position, 
        department_name as department, 
        salary, 
        status, 
        avatar_url as avatar, 
        phone, 
        address, 
        join_date as joinDate,
        updated_at as updatedAt
    FROM employees ORDER BY created_at DESC`;

    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

export const getEmployeeById = (req, res) => {
    const sql = `SELECT 
        id, 
        first_name as firstName, 
        last_name as lastName, 
        email, 
        cnic,
        position, 
        department_name as department, 
        salary, 
        status, 
        avatar_url as avatar, 
        phone, 
        address, 
        join_date as joinDate,
        updated_at as updatedAt
    FROM employees WHERE id = ?`;

    db.get(sql, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Employee not found' });
        res.json(row);
    });
};

import supabase, { supabaseAdmin } from '../supabaseClient.js';

export const createEmployee = async (req, res) => {
    const { firstName, lastName, email, cnic, position, department, salary, status, avatar, phone, address } = req.body;
    const id = uuidv4();
    const joinDate = new Date().toISOString();

    console.log(`[HR] Creating employee: ${firstName} ${lastName} (${email})`);

    // 1. Create Employee Record in HR Module
    const sql = `INSERT INTO employees (id, first_name, last_name, email, cnic, position, department_name, salary, status, avatar_url, phone, address, join_date) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [id, firstName, lastName, email, cnic, position, department, salary, status || 'Active', avatar, phone, address, joinDate];

    db.run(sql, params, async function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed: employees.email')) {
                return res.status(400).json({ message: 'This email address is already registered to another employee.' });
            }
            return res.status(500).json({ error: err.message });
        }

        // 2. Auto-Create User Account in Supabase (and Users Table)
        let userCreationNote = '';
        if (cnic && supabaseAdmin) { // Use supabaseAdmin
            try {
                // Determine Dept for User
                let userDept = department;

                console.log(`[HR] Attempting to auto-create Auth User for ${email}...`);

                // Admin Create User (Confirmed automatically)
                const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                    email: email,
                    password: cnic,
                    email_confirm: true, // Bypass verification
                    user_metadata: {
                        name: `${firstName} ${lastName}`,
                        role: 'user',
                        department: userDept
                    }
                });

                if (authError) {
                    console.warn('[HR] Failed to create Supabase Auth User:', authError.message);
                    userCreationNote = ` (Warning: Login account creation failed: ${authError.message})`;
                } else if (authData.user) {
                    console.log('[HR] Supabase Auth User Created/Found:', authData.user.id);

                    // Create entry in 'users' table matching this Auth ID
                    const userRecord = {
                        id: authData.user.id,
                        name: `${firstName} ${lastName}`,
                        email: email,
                        role: 'user', // Default Role
                        status: 'Active',
                        department: userDept,
                        password_hash: 'supabased',
                    };

                    // Check if exists
                    db.get("SELECT id FROM users WHERE email = ?", [email], (err, row) => {
                        if (!row) {
                            // Insert new user record
                            const insertUserSql = `INSERT INTO users (id, name, email, role, status, department, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                            db.run(insertUserSql, [userRecord.id, userRecord.name, userRecord.email, userRecord.role, userRecord.status, userRecord.department, userRecord.password_hash], (e) => {
                                if (e) console.error('[HR] Failed to insert into users table:', e.message);
                                else console.log('[HR] Synced to users table successfully.');
                            });
                        } else {
                            console.log('[HR] User record already exists in users table. Skipping insert.');
                        }
                    });

                    // SYNC TO SUPABASE PUBLIC.USERS TABLE
                    const { error: dbError } = await supabaseAdmin
                        .from('users')
                        .insert([{
                            id: userRecord.id,
                            name: userRecord.name,
                            email: userRecord.email,
                            role: userRecord.role,
                            status: userRecord.status,
                            department: userRecord.department
                        }]);

                    if (dbError) {
                        // Keep going even if sync fails (it triggers on signup anyway usually, but duplicate key ignore is fine if manual)
                        console.error('[HR] Failed to sync to Supabase DB:', dbError.message);
                    } else {
                        console.log('[HR] Synced to Supabase DB users table successfully.');
                    }

                    userCreationNote = ' (Login Account Created)';
                }

            } catch (autoCreateErr) {
                console.error('[HR] Auto-create user error:', autoCreateErr);
                userCreationNote = ' (Error creating login account)';
            }
        } else if (cnic && !supabaseAdmin) {
            console.warn('[HR] Supabase Admin client not available. Cannot auto-create user.');
            userCreationNote = ' (Backend config missing for user creation)';
        }

        const newEmp = { id, firstName, lastName, email, cnic, position, department, salary, status, avatar, phone, address, joinDate };
        res.status(201).json({ ...newEmp, message: 'Employee created successfully' + userCreationNote });
    });
};

export const updateEmployee = (req, res) => {
    const { updates } = req.body;

    if (!updates || Object.keys(updates).length === 0) {
        return res.json({});
    }

    const keys = Object.keys(updates);
    const fields = keys.map((key) => {
        let col = key;
        if (key === 'firstName') col = 'first_name';
        if (key === 'lastName') col = 'last_name';
        if (key === 'department') col = 'department_name';
        if (key === 'avatar') col = 'avatar_url';
        // cnic matches key 'cnic' so no mapping needed
        return `${col} = ?`;
    });

    const values = keys.map(k => updates[k]);
    values.push(req.params.id);

    const sql = `UPDATE employees SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

    console.log('Update SQL:', sql, values);

    db.run(sql, values, function (err) {
        if (err) {
            console.error('Update Error:', err);
            return res.status(500).json({ error: err.message });
        }

        const returnSql = `SELECT 
            id, 
            first_name as firstName, 
            last_name as lastName, 
            email, 
            cnic,
            position, 
            department_name as department, 
            salary, 
            status, 
            avatar_url as avatar, 
            phone, 
            address, 
            join_date as joinDate,
            updated_at as updatedAt
        FROM employees WHERE id = ?`;

        db.get(returnSql, [req.params.id], (err, row) => {
            res.json(row);
        });
    });
};

export const deleteEmployee = (req, res) => {
    db.run("DELETE FROM employees WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted successfully' });
    });
};

// --- Leave Management ---

export const getAllLeaves = (req, res) => {
    const sql = `
        SELECT l.*, e.first_name, e.last_name, e.department_name
        FROM leaves l
        LEFT JOIN employees e ON l.employee_id = e.id
        ORDER BY l.created_at DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        // Transform for frontend consistency if needed
        const leaves = rows.map(leave => {
            const fullName = leave.first_name ? `${leave.first_name} ${leave.last_name}` : 'Unknown Employee';
            return {
                id: leave.id,
                employeeId: leave.employee_id,
                employeeName: fullName,
                department: leave.department_name || 'Unassigned',
                type: leave.type,
                startDate: leave.start_date,
                endDate: leave.end_date,
                days: Math.ceil((new Date(leave.end_date) - new Date(leave.start_date)) / (1000 * 60 * 60 * 24)) + 1,
                reason: leave.reason,
                status: leave.status,
                requestedOn: leave.created_at,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`
            };
        });
        res.json(leaves);
    });
};

export const createLeave = (req, res) => {
    const { employeeId, email, type, startDate, endDate, reason } = req.body;
    const id = uuidv4();

    // First, resolve the correct employee_id
    const findEmployeeSql = `SELECT id FROM employees WHERE id = ? OR email = ?`;

    db.get(findEmployeeSql, [employeeId, email], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });

        if (!row) {
            return res.status(400).json({
                error: 'Employee profile not found. Please ensure you have an employee record created in HR.'
            });
        }

        const validEmployeeId = row.id;
        const insertSql = `INSERT INTO leaves (id, employee_id, type, start_date, end_date, reason) VALUES (?, ?, ?, ?, ?, ?)`;

        db.run(insertSql, [id, validEmployeeId, type, startDate, endDate, reason], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id, status: 'Pending', message: 'Leave requested successfully' });
        });
    });
};

export const updateLeaveStatus = (req, res) => {
    const { status } = req.body;
    const sql = `UPDATE leaves SET status = ? WHERE id = ?`;

    db.run(sql, [status, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, status });
    });
};
