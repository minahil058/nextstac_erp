
import db from './db.js';

console.log("Force fixing invoices schema...");

db.serialize(() => {
    // 1. Drop invoice_items (Child)
    db.run("DROP TABLE IF EXISTS invoice_items");

    // 2. Drop invoices (Parent)
    db.run("DROP TABLE IF EXISTS invoices");

    // 3. Recreate Invoices
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

    // 4. Recreate Invoice Items
    const createItems = `
        CREATE TABLE invoice_items (
            id TEXT PRIMARY KEY,
            invoice_id TEXT,
            product_id TEXT,
            description TEXT,
            quantity INTEGER,
            unit_price REAL,
            amount REAL,
            FOREIGN KEY(invoice_id) REFERENCES invoices(id)
        )
    `;
    db.run(createItems, [], (err) => {
        if (err) console.error("Create Items Error:", err.message);
        else console.log("Created 'invoice_items' table.");
    });
});
