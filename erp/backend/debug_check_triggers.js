
import db from './db.js';

console.log("Checking Triggers...");

db.serialize(() => {
    db.all("SELECT name, tbl_name, sql FROM sqlite_master WHERE type = 'trigger' AND (tbl_name = 'invoices' OR tbl_name = 'invoice_items')", (err, rows) => {
        if (err) console.error("Trigger Error:", err);
        else console.log("TRIGGERS:", JSON.stringify(rows, null, 2));
    });
});
