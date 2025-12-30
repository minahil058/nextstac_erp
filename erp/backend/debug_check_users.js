
import sqlite3 from 'sqlite3';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { verbose } = sqlite3;
const db = new verbose().Database('./erp/backend/erp.db');

db.serialize(() => {
    console.log("--- EMPLOYEES ---");
    db.all("SELECT id, first_name, email, department_name FROM employees", (err, rows) => {
        if (err) console.error(err);
        else console.log(JSON.stringify(rows, null, 2));
    });

    console.log("--- USERS ---");
    db.all("SELECT id, name, email, role, department FROM users", (err, rows) => {
        if (err) console.error(err);
        else console.log(JSON.stringify(rows, null, 2));
    });
});
