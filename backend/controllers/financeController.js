import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import xlsx from 'xlsx';

// --- Helper: Fuzzy column matching ---
const getValue = (row, ...keys) => {
    const rowKeys = Object.keys(row);
    for (const key of keys) {
        const foundKey = rowKeys.find(k => k.toLowerCase().trim() === key.toLowerCase());
        if (foundKey) return row[foundKey];
    }
    return null;
};

// --- Multi-Section Excel Upload ---
export const uploadFinanceData = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const results = {
            transactions: 0,
            invoices: 0,
            payments: 0,
            products: 0,
            customers: 0,
            leads: 0,
            employees: 0,
            vendors: 0,
            purchaseOrders: 0,
            bills: 0,
            errors: []
        };

        // Process each sheet
        workbook.SheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet);
            const normalized = sheetName.toLowerCase();

            try {
                if (normalized.includes('transaction')) {
                    results.transactions += processTransactions(data);
                } else if (normalized.includes('invoice')) {
                    results.invoices += processInvoices(data);
                } else if (normalized.includes('payment')) {
                    results.payments += processPayments(data);
                } else if (normalized.includes('product') || normalized.includes('inventory')) {
                    results.products += processProducts(data);
                } else if (normalized.includes('customer')) {
                    results.customers += processCustomers(data);
                } else if (normalized.includes('lead')) {
                    results.leads += processLeads(data);
                } else if (normalized.includes('employee')) {
                    results.employees += processEmployees(data);
                } else if (normalized.includes('vendor')) {
                    results.vendors += processVendors(data);
                } else if (normalized.includes('purchase') || normalized.includes('po')) {
                    results.purchaseOrders += processPurchaseOrders(data);
                } else if (normalized.includes('bill')) {
                    results.bills += processBills(data);
                }
            } catch (error) {
                results.errors.push(`Error in sheet "${sheetName}": ${error.message}`);
            }
        });

        res.json({
            message: 'File processed successfully',
            results
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to process file' });
    }
};

// --- Process Functions ---

function processTransactions(data) {
    let count = 0;
    const stmt = db.prepare(`INSERT INTO transactions (id, date, description, amount, type, reference, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`);

    data.forEach(row => {
        const description = getValue(row, 'description', 'desc', 'narrative') || 'Transaction';
        const amountVal = getValue(row, 'amount', 'amt', 'value', 'total');
        const type = getValue(row, 'type', 'category') || (amountVal < 0 ? 'Expense' : 'Income');
        const dateVal = getValue(row, 'date', 'transaction date') || new Date().toISOString();

        let amount = parseFloat(amountVal);
        if (isNaN(amount)) amount = 0;

        stmt.run(uuidv4(), dateVal, description, amount, type, 'Excel Import', new Date().toISOString());
        count++;
    });

    stmt.finalize();
    return count;
}

function processInvoices(data) {
    let count = 0;
    const stmt = db.prepare(`INSERT OR IGNORE INTO invoices (id, invoice_number, customer_name, date, due_date, amount, status, items_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

    data.forEach(row => {
        const invoiceNumber = getValue(row, 'invoice number', 'invoice_number', 'number') || `INV-${Date.now()}-${count}`;
        const customer = getValue(row, 'customer', 'customer_name', 'client') || 'Unknown';
        const date = getValue(row, 'date', 'invoice_date') || new Date().toISOString();
        const dueDate = getValue(row, 'due date', 'due_date') || new Date().toISOString();
        const amount = parseFloat(getValue(row, 'amount', 'total')) || 0;
        const status = getValue(row, 'status') || 'Pending';

        stmt.run(uuidv4(), invoiceNumber, customer, date, dueDate, amount, status, 0);
        count++;
    });

    stmt.finalize();
    return count;
}

function processPayments(data) {
    let count = 0;
    const stmt = db.prepare(`INSERT OR IGNORE INTO payments (id, payment_number, vendor, amount, date, method, status) VALUES (?, ?, ?, ?, ?, ?, ?)`);

    data.forEach(row => {
        const paymentNumber = getValue(row, 'payment number', 'payment_number', 'number') || `PAY-${Date.now()}-${count}`;
        const vendor = getValue(row, 'vendor', 'supplier', 'payee') || 'Unknown';
        const amount = parseFloat(getValue(row, 'amount', 'total')) || 0;
        const date = getValue(row, 'date', 'payment_date') || new Date().toISOString();
        const method = getValue(row, 'method', 'payment_method') || 'Bank Transfer';
        const status = getValue(row, 'status') || 'Completed';

        stmt.run(uuidv4(), paymentNumber, vendor, amount, date, method, status);
        count++;
    });

    stmt.finalize();
    return count;
}

function processProducts(data) {
    let count = 0;
    const stmt = db.prepare(`INSERT OR IGNORE INTO products (id, name, sku, category, price, stock, min_stock, supplier, status, last_updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    data.forEach(row => {
        const name = getValue(row, 'name', 'product name', 'product') || 'Product';
        const sku = getValue(row, 'sku', 'code', 'product code') || `SKU-${Date.now()}-${count}`;
        const category = getValue(row, 'category', 'type') || 'General';
        const price = parseFloat(getValue(row, 'price', 'unit price')) || 0;
        const stock = parseInt(getValue(row, 'stock', 'quantity', 'qty')) || 0;
        const minStock = parseInt(getValue(row, 'min stock', 'min_stock', 'minimum')) || 10;
        const supplier = getValue(row, 'supplier', 'vendor') || '';
        const status = getValue(row, 'status') || 'Active';

        stmt.run(uuidv4(), name, sku, category, price, stock, minStock, supplier, status, new Date().toISOString());
        count++;
    });

    stmt.finalize();
    return count;
}

function processCustomers(data) {
    let count = 0;
    const stmt = db.prepare(`INSERT INTO customers (id, name, company, email, phone, address, status, notes, total_orders) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    data.forEach(row => {
        const name = getValue(row, 'name', 'customer name', 'client') || 'Customer';
        const company = getValue(row, 'company', 'organization') || '';
        const email = getValue(row, 'email', 'email address') || '';
        const phone = getValue(row, 'phone', 'telephone', 'mobile') || '';
        const address = getValue(row, 'address', 'location') || '';
        const status = getValue(row, 'status') || 'Active';
        const notes = getValue(row, 'notes', 'remarks') || '';

        stmt.run(uuidv4(), name, company, email, phone, address, status, notes, 0);
        count++;
    });

    stmt.finalize();
    return count;
}

function processLeads(data) {
    let count = 0;
    const stmt = db.prepare(`INSERT INTO leads (id, name, company, email, phone, source, status, estimated_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

    data.forEach(row => {
        const name = getValue(row, 'name', 'lead name') || 'Lead';
        const company = getValue(row, 'company', 'organization') || '';
        const email = getValue(row, 'email') || '';
        const phone = getValue(row, 'phone', 'mobile') || '';
        const source = getValue(row, 'source', 'channel') || 'Excel Import';
        const status = getValue(row, 'status') || 'New';
        const estimatedValue = parseFloat(getValue(row, 'estimated value', 'value')) || 0;

        stmt.run(uuidv4(), name, company, email, phone, source, status, estimatedValue);
        count++;
    });

    stmt.finalize();
    return count;
}

function processEmployees(data) {
    let count = 0;
    const stmt = db.prepare(`INSERT OR IGNORE INTO employees (id, first_name, last_name, email, position, department_name, salary, join_date, status, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    data.forEach(row => {
        const firstName = getValue(row, 'first name', 'first_name', 'fname') || 'Employee';
        const lastName = getValue(row, 'last name', 'last_name', 'lname') || '';
        const email = getValue(row, 'email') || `employee${count}@company.com`;
        const position = getValue(row, 'position', 'role', 'job title') || 'Staff';
        const department = getValue(row, 'department', 'dept') || 'General';
        const salary = parseFloat(getValue(row, 'salary', 'compensation')) || 0;
        const joinDate = getValue(row, 'join date', 'start date') || new Date().toISOString();
        const status = getValue(row, 'status') || 'Active';
        const phone = getValue(row, 'phone', 'mobile') || '';
        const address = getValue(row, 'address') || '';

        stmt.run(uuidv4(), firstName, lastName, email, position, department, salary, joinDate, status, phone, address);
        count++;
    });

    stmt.finalize();
    return count;
}

function processVendors(data) {
    let count = 0;
    const stmt = db.prepare(`INSERT INTO vendors (id, company_name, contact_person, email, phone, address, rating, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

    data.forEach(row => {
        const companyName = getValue(row, 'company', 'company name', 'vendor name') || 'Vendor';
        const contactPerson = getValue(row, 'contact', 'contact person') || '';
        const email = getValue(row, 'email') || '';
        const phone = getValue(row, 'phone', 'telephone') || '';
        const address = getValue(row, 'address') || '';
        const rating = parseInt(getValue(row, 'rating')) || 3;
        const status = getValue(row, 'status') || 'Active';

        stmt.run(uuidv4(), companyName, contactPerson, email, phone, address, rating, status);
        count++;
    });

    stmt.finalize();
    return count;
}

function processPurchaseOrders(data) {
    let count = 0;
    const stmt = db.prepare(`INSERT OR IGNORE INTO purchase_orders (id, po_number, vendor, date, expected_date, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?)`);

    data.forEach(row => {
        const poNumber = getValue(row, 'po number', 'po_number', 'number') || `PO-${Date.now()}-${count}`;
        const vendor = getValue(row, 'vendor', 'supplier') || 'Unknown';
        const date = getValue(row, 'date', 'order date') || new Date().toISOString();
        const expectedDate = getValue(row, 'expected date', 'delivery date') || new Date().toISOString();
        const amount = parseFloat(getValue(row, 'amount', 'total')) || 0;
        const status = getValue(row, 'status') || 'Draft';

        stmt.run(uuidv4(), poNumber, vendor, date, expectedDate, amount, status);
        count++;
    });

    stmt.finalize();
    return count;
}

function processBills(data) {
    let count = 0;
    const stmt = db.prepare(`INSERT OR IGNORE INTO bills (id, bill_number, vendor, date, due_date, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?)`);

    data.forEach(row => {
        const billNumber = getValue(row, 'bill number', 'bill_number', 'number') || `BILL-${Date.now()}-${count}`;
        const vendor = getValue(row, 'vendor', 'supplier') || 'Unknown';
        const date = getValue(row, 'date', 'bill date') || new Date().toISOString();
        const dueDate = getValue(row, 'due date', 'due_date') || new Date().toISOString();
        const amount = parseFloat(getValue(row, 'amount', 'total')) || 0;
        const status = getValue(row, 'status') || 'Pending';

        stmt.run(uuidv4(), billNumber, vendor, date, dueDate, amount, status);
        count++;
    });

    stmt.finalize();
    return count;
}

export const getTransactions = (req, res) => {
    const sql = 'SELECT * FROM transactions ORDER BY date DESC LIMIT 100';
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

// --- Invoices ---
export const getInvoices = (req, res) => {
    const sql = `SELECT 
        id, 
        invoice_number as invoiceNumber, 
        customer_name as customer, 
        date, 
        due_date as dueDate, 
        amount, 
        status, 
        items_count as items 
    FROM invoices ORDER BY created_at DESC`;

    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

export const createInvoice = (req, res) => {
    const { customer, date, dueDate, items } = req.body;

    // Auto-generate ID and Invoice Number if not provided
    const id = uuidv4();
    const invoiceNumber = `INV-${Math.floor(10000 + Math.random() * 90000)}`;

    // Calculate totals
    const itemsCount = items ? items.length : 0;
    const totalAmount = items ? items.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0;

    const sqlInvoice = `INSERT INTO invoices (id, invoice_number, customer_name, date, due_date, amount, status, items_count) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const paramsInvoice = [id, invoiceNumber, customer, date, dueDate, totalAmount, 'Pending', itemsCount];

    // Transaction-like approach
    db.serialize(() => {
        db.run(sqlInvoice, paramsInvoice, function (err) {
            if (err) {
                console.error("Error creating invoice:", err);
                return res.status(500).json({ error: err.message });
            }

            if (items && items.length > 0) {
                const sqlItem = `INSERT INTO invoice_items (id, invoice_id, product_id, description, quantity, unit_price, amount) VALUES (?, ?, ?, ?, ?, ?, ?)`;

                const stmt = db.prepare(sqlItem);
                items.forEach(item => {
                    const itemId = uuidv4();
                    const itemAmount = item.price * item.quantity;
                    // item might be just { name, price, quantity } from simple form
                    stmt.run(itemId, id, item.id || null, item.name || 'Item', item.quantity, item.price, itemAmount);
                });
                stmt.finalize();
            }

            res.status(201).json({
                id,
                invoiceNumber,
                customer,
                date,
                dueDate,
                amount: totalAmount,
                status: 'Pending',
                items: itemsCount
            });
        });
    });
};

export const updateInvoiceStatus = (req, res) => {
    const { status } = req.body;
    const sql = `UPDATE invoices SET status = ? WHERE id = ?`;

    db.run(sql, [status, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: req.params.id, status });
    });
};

export const deleteInvoice = (req, res) => {
    db.run("DELETE FROM invoices WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted successfully' });
    });
};

// --- Payments ---
export const getPayments = (req, res) => {
    const sql = `SELECT 
        id, 
        payment_number as paymentNumber, 
        vendor, 
        amount, 
        date, 
        method, 
        status 
    FROM payments ORDER BY created_at DESC`;

    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

export const createPayment = (req, res) => {
    const { vendor, amount, method, status } = req.body;
    const id = uuidv4();
    const paymentNumber = `PAY-${Math.floor(10000 + Math.random() * 90000)}`; // Simple auto-gen
    const date = new Date().toISOString();

    const sql = `INSERT INTO payments (id, payment_number, vendor, amount, date, method, status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const params = [id, paymentNumber, vendor, amount, date, method, status || 'Completed'];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id, paymentNumber, vendor, amount, date, method, status });
    });
};

export const updatePaymentStatus = (req, res) => {
    const { status } = req.body;
    const sql = `UPDATE payments SET status = ? WHERE id = ?`;

    db.run(sql, [status, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: req.params.id, status });
    });
};

export const deletePayment = (req, res) => {
    db.run("DELETE FROM payments WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted successfully' });
    });
};
