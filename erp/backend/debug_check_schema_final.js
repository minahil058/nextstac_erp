
import db from './db.js';

console.log("Checking Invoice Schemas (FINAL)...");

db.serialize(() => {
    db.all("SELECT sql FROM sqlite_master WHERE type='table' AND name='invoice_items'", (err, rows) => {
        if (err) console.error("Items Schema Error:", err);
        else console.log("ITEMS SCHEMA:", JSON.stringify(rows, null, 2));
    });
});
