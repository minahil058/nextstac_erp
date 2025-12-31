
import sqlite3 from 'sqlite3';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { verbose } = sqlite3;
const db = new verbose().Database('./erp/backend/erp.db');

db.serialize(() => {
    console.log("--- SCHEMA ---");
    db.all("SELECT sql FROM sqlite_master WHERE type='table' AND name='leaves'", (err, rows) => {
        if (err) console.error(err);
        else console.log(JSON.stringify(rows, null, 2));
    });
    db.all("PRAGMA foreign_key_list(leaves);", (err, rows) => {
        if (err) console.error(err);
        else console.log("Foreign Keys:", JSON.stringify(rows, null, 2));
    });
});
