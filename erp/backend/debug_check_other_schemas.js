
import db from './db.js';

console.log("Checking Products/Customers Schemas...");

db.serialize(() => {
    db.all("SELECT sql FROM sqlite_master WHERE type='table' AND (name='products' OR name='customers')", (err, rows) => {
        if (err) console.error(err);
        else console.log("SCHEMAS:", JSON.stringify(rows, null, 2));
    });
});
