
import db from './db.js';

console.log("Checking DB...");

db.all("SELECT id, first_name, email FROM employees", [], (err, empRows) => {
    if (err) console.error("Emp Error:", err);
    else console.log("EMPLOYEES:", JSON.stringify(empRows, null, 2));

    db.all("SELECT id, name, email FROM users", [], (err, userRows) => {
        if (err) console.error("User Error:", err);
        else console.log("USERS:", JSON.stringify(userRows, null, 2));
    });
});
