
import db from './db.js';

console.log("Checking Schema via db.js...");

db.serialize(() => {
    db.all("SELECT sql FROM sqlite_master WHERE type='table' AND name='leaves'", (err, rows) => {
        if (err) console.error("Schema Error:", err);
        else console.log("SCHEMA:", JSON.stringify(rows, null, 2));
    });

    db.all("PRAGMA foreign_key_list(leaves);", (err, rows) => {
        if (err) console.error("FK Error:", err);
        else console.log("Foreign Keys:", JSON.stringify(rows, null, 2));
    });
});
