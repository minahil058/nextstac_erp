
import db from './db.js';

console.log("Relaxing invoices schema (removing constraints)...");

db.serialize(() => {
    // 1. Drop existing tables
    db.run("DROP TABLE IF EXISTS invoice_items");
    db.run("DROP TABLE IF EXISTS invoices");

    // 2. Recreate Invoices (Standard)
    const createInvoices = `
        CREATE TABLE invoices (
            id TEXT PRIMARY KEY,
            invoice_number TEXT UNIQUE NOT NULL,
            customer_name TEXT,
            date DATETIME,
            due_date DATETIME,
            amount REAL,
            status TEXT CHECK(status IN ('Paid', 'Pending', 'Overdue')),
            items_count INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    db.run(createInvoices, [], (err) => {
        if (err) console.error("Create Invoices Error:", err.message);
        else console.log("Created 'invoices' table.");
    });

    // 3. Recreate Invoice Items (NO FOREIGN KEY)
    // We removed: FOREIGN KEY(invoice_id) REFERENCES invoices(id)
    const createItems = `
        CREATE TABLE invoice_items (
            id TEXT PRIMARY KEY,
            invoice_id TEXT,
            product_id TEXT,
            description TEXT,
            quantity INTEGER,
            unit_price REAL,
            amount REAL
        )
    `;
    db.run(createItems, [], (err) => {
        if (err) console.error("Create Items Error:", err.message);
        else console.log("Created 'invoice_items' table (RELAXED).");
    });
});
