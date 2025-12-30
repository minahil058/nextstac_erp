import sqlite3Val from 'sqlite3';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const sqlite3 = sqlite3Val.verbose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isVercel = process.env.VERCEL === '1';

let db;

if (isVercel) {
    console.log('Running on Vercel: SQLite disabled, mocking DB object. Auth should use Supabase.');
    // Mock DB object to prevent crashes in non-migrated controllers
    db = {
        get: (sql, params, cb) => { if (cb) cb(new Error('SQLite is disabled on Vercel. Use Supabase.')); },
        run: (sql, params, cb) => { if (cb) cb(new Error('SQLite is disabled on Vercel. Use Supabase.')); },
        all: (sql, params, cb) => { if (cb) cb(new Error('SQLite is disabled on Vercel. Use Supabase.')); },
        prepare: () => ({
            run: (a, b, c, cb) => { if (typeof cb === 'function') cb(new Error('SQLite is disabled on Vercel.')); else if (typeof c === 'function') c(new Error('SQLite is disabled on Vercel.')); },
            finalize: () => { }
        }),
        serialize: (cb) => { if (cb) cb(); }
    };
} else {
    const dbPath = path.resolve(__dirname, 'erp.db');
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening database', err.message);
        } else {
            console.log('Connected to the SQLite database (Local File).');
            db.run('PRAGMA foreign_keys = ON');
            initSchema();
        }
    });
}

import { v4 as uuidv4 } from 'uuid';

function initSchema() {
    db.serialize(() => {
        // --- Users & Auth ---
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT CHECK(role IN ('super_admin', 'ecommerce_admin', 'dev_admin', 'user')) NOT NULL,
            avatar_url TEXT,
            status TEXT DEFAULT 'Active',
            share_percentage REAL DEFAULT 0.00,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // --- HR ---
        db.run(`CREATE TABLE IF NOT EXISTS departments (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            head_of_department TEXT,
            budget REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS employees (
            id TEXT PRIMARY KEY,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            position TEXT,
            department_id TEXT,
            department_name TEXT,
            salary REAL,
            join_date TEXT,
            status TEXT CHECK(status IN ('Active', 'On Leave', 'Terminated')),
            avatar_url TEXT,
            phone TEXT,
            address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS leaves (
            id TEXT PRIMARY KEY,
            employee_id TEXT,
            employee_name TEXT,
            type TEXT,
            start_date DATETIME,
            end_date DATETIME,
            reason TEXT,
            status TEXT DEFAULT 'Pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // --- Inventory ---
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            sku TEXT UNIQUE NOT NULL,
            category TEXT,
            price REAL NOT NULL,
            stock INTEGER DEFAULT 0,
            min_stock INTEGER DEFAULT 10,
            supplier TEXT,
            status TEXT DEFAULT 'Active',
            last_updated DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // --- CRM ---
        db.run(`CREATE TABLE IF NOT EXISTS customers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            company TEXT,
            email TEXT,
            phone TEXT,
            address TEXT,
            status TEXT,
            notes TEXT,
            total_orders INTEGER DEFAULT 0,
            last_order_date DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS leads (
            id TEXT PRIMARY KEY,
            name TEXT,
            company TEXT,
            email TEXT,
            phone TEXT,
            source TEXT, 
            status TEXT CHECK(status IN ('New', 'Contacted', 'Qualified', 'Lost')),
            estimated_value REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // --- Finance ---
        db.run(`CREATE TABLE IF NOT EXISTS invoices (
            id TEXT PRIMARY KEY,
            invoice_number TEXT UNIQUE NOT NULL,
            customer_name TEXT,
            date DATETIME,
            due_date DATETIME,
            amount REAL,
            status TEXT CHECK(status IN ('Paid', 'Pending', 'Overdue')),
            items_count INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS invoice_items (
            id TEXT PRIMARY KEY,
            invoice_id TEXT,
            product_id TEXT,
            description TEXT,
            quantity INTEGER,
            unit_price REAL,
            amount REAL
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS payments (
            id TEXT PRIMARY KEY,
            payment_number TEXT UNIQUE,
            vendor TEXT, 
            amount REAL,
            date DATETIME,
            method TEXT,
            status TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS transactions (
            id UUID PRIMARY KEY,
            date DATETIME DEFAULT CURRENT_TIMESTAMP,
            description TEXT,
            amount REAL NOT NULL,
            type TEXT, -- Income/Expense
            category TEXT,
            reference TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // --- Purchasing ---
        db.run(`CREATE TABLE IF NOT EXISTS purchase_orders (
            id TEXT PRIMARY KEY,
            po_number TEXT UNIQUE NOT NULL,
            vendor_id TEXT,
            vendor TEXT,
            date DATETIME,
            expected_date DATETIME,
            amount REAL,
            status TEXT CHECK(status IN ('Draft', 'Ordered', 'Received', 'Cancelled')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS bills (
            id TEXT PRIMARY KEY,
            bill_number TEXT UNIQUE NOT NULL,
            vendor_id TEXT,
            vendor TEXT,
            date DATETIME,
            due_date DATETIME,
            amount REAL,
            status TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS vendors (
            id TEXT PRIMARY KEY,
            company_name TEXT NOT NULL,
            contact_person TEXT,
            email TEXT,
            phone TEXT,
            address TEXT,
            rating INTEGER,
            status TEXT DEFAULT 'Active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // --- System ---
        db.run(`CREATE TABLE IF NOT EXISTS activity_logs (
            id UUID PRIMARY KEY,
            user_id UUID,
            user_name VARCHAR(255),
            action VARCHAR(255) NOT NULL,
            module VARCHAR(100),
            ip_address VARCHAR(45),
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // --- Documents ---
        db.run(`CREATE TABLE IF NOT EXISTS documents (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT,
            size TEXT,
            path TEXT NOT NULL,
            uploaded_by TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Seed Data (Only if empty)
        const adminId = uuidv4();
        db.get("SELECT count(*) as count FROM users", [], (err, row) => {
            if (!err && row.count === 0) {
                console.log('Seeding Initial Data for Demo...');
                // Admin
                const stmt = db.prepare("INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)");
                stmt.run(adminId, 'Super Admin', 'admin@test.com', 'password', 'super_admin');
                stmt.finalize();

                // Sample Employee
                const empStmt = db.prepare("INSERT INTO employees (id, first_name, last_name, email, position, department_name, salary, status, join_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                empStmt.run(uuidv4(), 'Demo', 'Employee', 'demo.emp@test.com', 'Developer', 'Development', 60000, 'Active', new Date().toISOString());
                empStmt.finalize();
            }
        });
    });
}

export default db;
