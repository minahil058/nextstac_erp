
import db from './db.js';
import { v4 as uuidv4 } from 'uuid';

console.log("Fixing missing employees...");

db.all("SELECT id, name, email, role, department FROM users", [], (err, allUsers) => {
    if (err) { console.error("User Load Error:", err); return; }

    db.all("SELECT email FROM employees", [], (err, allEmps) => {
        if (err) { console.error("Emp Load Error:", err); return; }

        const empEmails = new Set(allEmps.map(e => e.email.toLowerCase()));
        const missing = allUsers.filter(u => !empEmails.has(u.email.toLowerCase()));

        console.log(`Found ${missing.length} users needing employee profiles.`);

        if (missing.length === 0) {
            console.log("No missing employees found.");
            return;
        }

        const stmt = db.prepare(`INSERT INTO employees (id, first_name, last_name, email, position, department_name, status, salary, join_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

        missing.forEach(user => {
            const names = user.name ? user.name.split(' ') : ['Unknown', 'User'];
            const firstName = names[0];
            const lastName = names.slice(1).join(' ') || '';
            const empId = uuidv4();
            const dept = user.department || user.department_name || 'Unassigned'; // user table might have department?

            // Note: users table usually has 'department' column.

            console.log(`Creating employee for ${user.email} (${user.role})...`);

            stmt.run(
                empId,
                firstName,
                lastName,
                user.email,
                user.role === 'user' ? 'Employee' : 'Admin',
                dept,
                'Active',
                50000,
                new Date().toISOString(),
                (err) => {
                    if (err) console.error(`Failed to create ${user.email}:`, err.message);
                    else console.log(`Created ${user.email}`);
                }
            );
        });

        stmt.finalize();
    });
});
