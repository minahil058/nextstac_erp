
import db from './db.js';

console.log("Force fixing leaves schema...");

db.serialize(() => {
    // 1. Drop old backup if exists
    db.run("DROP TABLE IF EXISTS leaves_old");

    // 2. Try to rename current to backup (if exists)
    db.run("ALTER TABLE leaves RENAME TO leaves_old", (err) => {
        if (err) console.log("Rename skipped/failed (maybe table missing): " + err.message);
        else console.log("Renamed current employees table to leaves_old");
    });

    // 3. Drop leaves JUST IN CASE it still exists (e.g. rename failed)
    db.run("DROP TABLE IF EXISTS leaves");

    // 4. Create correct table
    const createSql = `
        CREATE TABLE leaves (
            id TEXT PRIMARY KEY,
            employee_id TEXT,
            employee_name TEXT,
            type TEXT,
            start_date DATETIME,
            end_date DATETIME,
            reason TEXT,
            status TEXT DEFAULT 'Pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            department TEXT,
            FOREIGN KEY(employee_id) REFERENCES employees(id)
        )
    `;

    db.run(createSql, [], (err) => {
        if (err) {
            console.error("Create FATAL:", err);
        } else {
            console.log("SUCCESS: Created new leaves table referencing employees(id)");
        }
    });
});
