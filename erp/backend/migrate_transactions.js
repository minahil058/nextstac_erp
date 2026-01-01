import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'erp.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        migrate();
    }
});

function migrate() {
    db.serialize(() => {
        // Add category column
        db.run("ALTER TABLE transactions ADD COLUMN category TEXT", (err) => {
            if (err) {
                if (err.message.includes('duplicate column name')) {
                    console.log('Column "category" already exists.');
                } else {
                    console.error('Error adding category column:', err.message);
                }
            } else {
                console.log('Successfully added "category" column.');
            }
        });

        // Add reference column
        db.run("ALTER TABLE transactions ADD COLUMN reference TEXT", (err) => {
            if (err) {
                if (err.message.includes('duplicate column name')) {
                    console.log('Column "reference" already exists.');
                } else {
                    console.error('Error adding reference column:', err.message);
                }
            } else {
                console.log('Successfully added "reference" column.');
            }
        });
    });

    // Close DB after short delay to ensure query runs
    setTimeout(() => {
        db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Database connection closed.');
        });
    }, 1000);
}
