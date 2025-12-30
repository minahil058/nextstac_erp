
import db from './db.js';

console.log("Checking for Users missing from Employees table...");

db.all("SELECT id, email, role, department FROM users", [], (err, allUsers) => {
    if (err) { console.error("User Load Error:", err); return; }

    db.all("SELECT id, email FROM employees", [], (err, allEmps) => {
        if (err) { console.error("Emp Load Error:", err); return; }

        const empEmails = new Set(allEmps.map(e => e.email.toLowerCase()));

        const missing = allUsers.filter(u => !empEmails.has(u.email.toLowerCase()));

        console.log(`Total Users: ${allUsers.length}`);
        console.log(`Total Employees: ${allEmps.length}`);
        console.log(`Users NOT in Employees: ${missing.length}`);

        if (missing.length > 0) {
            console.log("--- MISSING USERS (Login exists, can't file leave) ---");
            console.log(JSON.stringify(missing, null, 2));
        } else {
            console.log("All users have corresponding employee records.");
        }
    });
});
