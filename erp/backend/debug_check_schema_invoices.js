
import db from './db.js';

console.log("Checking Invoice Schemas...");

db.serialize(() => {
    // Invoices
    db.all("SELECT sql FROM sqlite_master WHERE type='table' AND name='invoices'", (err, rows) => {
        if (err) console.error("Invoices Schema Error:", err);
        else console.log("INVOICES SCHEMA:", JSON.stringify(rows, null, 2));
    });
    db.all("PRAGMA foreign_key_list(invoices);", (err, rows) => {
        if (err) console.error("Invoices FK Error:", err);
        else console.log("Invoices FKs:", JSON.stringify(rows, null, 2));
    });

    // Invoice Items
    db.all("SELECT sql FROM sqlite_master WHERE type='table' AND name='invoice_items'", (err, rows) => {
        if (err) console.error("Items Schema Error:", err);
        else console.log("ITEMS SCHEMA:", JSON.stringify(rows, null, 2));
    });
    db.all("PRAGMA foreign_key_list(invoice_items);", (err, rows) => {
        if (err) console.error("Items FK Error:", err);
        else console.log("Items FKs:", JSON.stringify(rows, null, 2));
    });
});
