
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'erp.db');
const db = new sqlite3.Database(dbPath);

const runMigration = () => {
    console.log('Running migration: Add status column to documents table');

    // Check if table exists
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='documents'", (err, row) => {
        if (err) {
            console.error('Error checking table:', err);
            return;
        }

        if (!row) {
            console.log('Table documents does not exist. Creating it...');
            db.run(`CREATE TABLE documents (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                type TEXT,
                size TEXT,
                path TEXT,
                uploaded_by TEXT,
                status TEXT DEFAULT 'Pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
                if (err) console.error('Error creating table:', err);
                else console.log('Table documents created successfully.');
            });
        } else {
            console.log('Table documents exists. Checking for status column...');
            // Check if column exists
            db.all("PRAGMA table_info(documents)", (err, columns) => {
                if (err) {
                    console.error('Error checking columns:', err);
                    return;
                }

                const hasStatus = columns.some(c => c.name === 'status');
                if (!hasStatus) {
                    console.log('Column status missing. Adding it...');
                    db.run("ALTER TABLE documents ADD COLUMN status TEXT DEFAULT 'Approved'", (err) => {
                        if (err) console.error('Error adding column:', err);
                        else console.log('Column status added successfully. Defaulted existing to Approved.');
                    });
                } else {
                    console.log('Column status already exists.');
                }
            });
        }
    });
};

runMigration();
