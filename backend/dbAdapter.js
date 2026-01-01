import db from './db.js';
import supabase from './supabaseClient.js';

const isVercel = process.env.VERCEL === '1';

const dbAdapter = {
    // --- User Operations ---

    // Find User By Email
    findUserByEmail: async (email) => {
        if (isVercel) {
            if (!supabase) throw new Error('Supabase client not initialized (Missing Env Vars)');
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 is 'Row not found'
                throw new Error(error.message);
            }
            return data || null;
        } else {
            return new Promise((resolve, reject) => {
                db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
        }
    },

    // Create User (Invite)
    createUser: async (user) => {
        if (isVercel) {
            if (!supabase) throw new Error('Supabase client not initialized (Missing Env Vars)');
            // Map camelCase to snake_case if necessary, schema seems mixed but let's stick to what authController passed
            // The authController passes object keys that map to DB columns? 
            // SQLite Insert was: id, name, email, password_hash, role, status, department
            const { error } = await supabase
                .from('users')
                .insert([user]);

            if (error) throw new Error(error.message);
            return user;
        } else {
            return new Promise((resolve, reject) => {
                const stmt = db.prepare("INSERT INTO users (id, name, email, password_hash, role, status, department) VALUES (?, ?, ?, ?, ?, ?, ?)");
                stmt.run(user.id, user.name, user.email, user.password_hash, user.role, user.status, user.department, function (err) {
                    if (err) reject(err);
                    else resolve(user);
                });
                stmt.finalize();
            });
        }
    },

    // Update User (Register/Activate)
    updateUser: async (id, updates) => {
        if (isVercel) {
            if (!supabase) throw new Error('Supabase client not initialized (Missing Env Vars)');
            const { error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', id);

            if (error) throw new Error(error.message);
            return { id, ...updates }; // Return mocked updated object (simplification)
        } else {
            return new Promise((resolve, reject) => {
                // Determine what to update dynamically or specific fields?
                // authController updates: name, password_hash, status
                const keys = Object.keys(updates);
                const values = Object.values(updates);
                const setClause = keys.map(k => `${k} = ?`).join(', ');

                const stmt = db.prepare(`UPDATE users SET ${setClause} WHERE id = ?`);
                stmt.run(...values, id, function (err) {
                    if (err) reject(err);
                    else resolve({ id, ...updates });
                });
                stmt.finalize();
            });
        }
    }
};

// --- HR Operations ---
dbAdapter.hr = {
    // Employees
    getAllEmployees: async () => {
        if (isVercel) {
            if (!supabase) throw new Error('Supabase client not initialized');
            const { data, error } = await supabase.from('employees').select('*').order('created_at', { ascending: false });
            if (error) throw new Error(error.message);
            return data;
        } else {
            return new Promise((resolve, reject) => {
                db.all(`SELECT id, first_name as firstName, last_name as lastName, email, position, department_name as department, salary, status, avatar_url as avatar, phone, address, join_date as joinDate, updated_at as updatedAt FROM employees ORDER BY created_at DESC`, [], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
        }
    },

    getEmployeeById: async (id) => {
        if (isVercel) {
            const { data, error } = await supabase.from('employees').select('*').eq('id', id).single();
            if (error) throw new Error(error.message);
            return data;
        } else {
            return new Promise((resolve, reject) => {
                db.get(`SELECT id, first_name as firstName, last_name as lastName, email, position, department_name as department, salary, status, avatar_url as avatar, phone, address, join_date as joinDate, updated_at as updatedAt FROM employees WHERE id = ?`, [id], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
        }
    },

    createEmployee: async (emp) => {
        if (isVercel) {
            // Unmap camelCase to snake_case for DB is handled by Supabase IF column names match, or we mapped them manually?
            // The schema in db.js uses snake_case (first_name), but Supabase usually matches JSON keys if columns are same.
            // Let's assume we need to map OR the frontend/controller sends matching keys.
            // hrController sends: id, firstName, lastName...
            // better to map explicitly to be safe
            const dbPayload = {
                id: emp.id,
                first_name: emp.firstName,
                last_name: emp.lastName,
                email: emp.email,
                position: emp.position,
                department_name: emp.department,
                salary: emp.salary,
                status: emp.status,
                avatar_url: emp.avatar,
                phone: emp.phone,
                address: emp.address,
                join_date: emp.joinDate
            };
            const { error } = await supabase.from('employees').insert([dbPayload]);
            if (error) throw new Error(error.message);
            return emp;
        } else {
            return new Promise((resolve, reject) => {
                const stmt = db.prepare("INSERT INTO employees (id, first_name, last_name, email, position, department_name, salary, status, avatar_url, phone, address, join_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                stmt.run(emp.id, emp.firstName, emp.lastName, emp.email, emp.position, emp.department, emp.salary, emp.status, emp.avatar, emp.phone, emp.address, emp.joinDate, function (err) {
                    if (err) reject(err);
                    else resolve(emp);
                });
                stmt.finalize();
            });
        }
    },

    // Leaves
    getAllLeaves: async () => {
        if (isVercel) {
            const { data, error } = await supabase.from('leaves').select('*').order('created_at', { ascending: false });
            if (error) throw new Error(error.message);
            // Transform snake_case to camelCase for consistency if needed? 
            // Controller expects: leave.employee_id etc.
            return data;
        } else {
            return new Promise((resolve, reject) => {
                db.all("SELECT * FROM leaves ORDER BY created_at DESC", [], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
        }
    },

    createLeave: async (leave) => {
        if (isVercel) {
            const payload = {
                id: leave.id,
                employee_id: leave.employeeId,
                employee_name: leave.employeeName,
                type: leave.type,
                start_date: leave.startDate,
                end_date: leave.endDate,
                reason: leave.reason
            };
            const { error } = await supabase.from('leaves').insert([payload]);
            if (error) throw new Error(error.message);
            return leave;
        } else {
            return new Promise((resolve, reject) => {
                const stmt = db.prepare("INSERT INTO leaves (id, employee_id, employee_name, type, start_date, end_date, reason) VALUES (?, ?, ?, ?, ?, ?, ?)");
                stmt.run(leave.id, leave.employeeId, leave.employeeName, leave.type, leave.startDate, leave.endDate, leave.reason, function (err) {
                    if (err) reject(err);
                    else resolve(leave);
                });
                stmt.finalize();
            });
        }
    }
};

// --- Inventory Operations ---
dbAdapter.inventory = {
    getProducts: async () => {
        if (isVercel) {
            const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
            if (error) throw new Error(error.message);
            return data;
        } else {
            return new Promise((resolve, reject) => {
                db.all(`SELECT id, name, sku, category, price, stock, min_stock as minStock, supplier, status, last_updated as lastUpdated FROM products ORDER BY created_at DESC`, [], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
        }
    },

    createProduct: async (product) => {
        if (isVercel) {
            const payload = {
                id: product.id,
                name: product.name,
                sku: product.sku,
                category: product.category,
                price: product.price,
                stock: product.stock,
                min_stock: product.minStock,
                supplier: product.supplier,
                status: product.status,
                last_updated: product.lastUpdated
            };
            const { error } = await supabase.from('products').insert([payload]);
            if (error) throw new Error(error.message);
            return product;
        } else {
            return new Promise((resolve, reject) => {
                const stmt = db.prepare("INSERT INTO products (id, name, sku, category, price, stock, min_stock, supplier, status, last_updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                stmt.run(product.id, product.name, product.sku, product.category, product.price, product.stock, product.minStock, product.supplier, product.status, product.lastUpdated, function (err) {
                    if (err) reject(err);
                    else resolve(product);
                });
                stmt.finalize();
            });
        }
    },

    updateProduct: async (id, updates) => {
        if (isVercel) {
            const mappedUpdates = {};
            for (const [key, val] of Object.entries(updates)) {
                if (key === 'minStock') mappedUpdates.min_stock = val;
                else if (key === 'lastUpdated') mappedUpdates.last_updated = val;
                else mappedUpdates[key] = val;
            }

            const { error } = await supabase.from('products').update(mappedUpdates).eq('id', id);
            if (error) throw new Error(error.message);
            const { data } = await supabase.from('products').select('*').eq('id', id).single();
            return data;
        } else {
            return new Promise((resolve, reject) => {
                const keys = Object.keys(updates);
                if (keys.length === 0) return resolve({});

                const fields = keys.map((key) => {
                    let col = key;
                    if (key === 'minStock') col = 'min_stock';
                    if (key === 'lastUpdated') col = 'last_updated';
                    return `${col} = ?`;
                });
                const values = keys.map(k => updates[k]);
                values.push(id);

                const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
                db.run(sql, values, function (err) {
                    if (err) reject(err);
                    else {
                        db.get("SELECT id, name, sku, category, price, stock, min_stock as minStock, supplier, status, last_updated as lastUpdated FROM products WHERE id = ?", [id], (err, row) => resolve(row));
                    }
                });
            });
        }
    },

    deleteProduct: async (id) => {
        if (isVercel) {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw new Error(error.message);
            return true;
        } else {
            return new Promise((resolve, reject) => {
                db.run("DELETE FROM products WHERE id = ?", [id], (err) => {
                    if (err) reject(err);
                    else resolve(true);
                });
            });
        }
    }
};

// --- Finance Operations ---
dbAdapter.finance = {
    // Transactions
    getTransactions: async () => {
        if (isVercel) {
            const { data, error } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
            if (error) throw new Error(error.message);
            return data;
        } else {
            return new Promise((resolve, reject) => {
                db.all(`SELECT id, date, description, amount, type, category, reference FROM transactions ORDER BY created_at DESC`, [], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
        }
    },
    createTransactions: async (transactions) => {
        if (!transactions || transactions.length === 0) return [];

        if (isVercel) {
            const payload = transactions.map(t => ({
                id: t.id,
                date: t.date,
                description: t.description,
                amount: t.amount,
                type: t.type,
                category: t.category,
                reference: t.reference
            }));
            const { data, error } = await supabase.from('transactions').insert(payload);
            if (error) throw new Error(error.message);
            return payload;
        } else {
            return new Promise((resolve, reject) => {
                const placeholders = transactions.map(() => '(?, ?, ?, ?, ?, ?, ?)').join(', ');
                const values = [];
                transactions.forEach(t => {
                    values.push(t.id, t.date, t.description, t.amount, t.type, t.category, t.reference);
                });
                const sql = `INSERT INTO transactions (id, date, description, amount, type, category, reference) VALUES ${placeholders}`;
                db.run(sql, values, function (err) {
                    if (err) reject(err);
                    else resolve(transactions);
                });
            });
        }
    },

    getInvoices: async () => {
        if (isVercel) {
            const { data, error } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
            if (error) throw new Error(error.message);
            return data;
        } else {
            return new Promise((resolve, reject) => {
                db.all(`SELECT id, invoice_number as invoiceNumber, customer_name as customer, date, due_date as dueDate, amount, status, items_count as items FROM invoices ORDER BY created_at DESC`, [], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
        }
    },

    createInvoice: async (invoice, items) => {
        if (isVercel) {
            const invPayload = {
                id: invoice.id,
                invoice_number: invoice.invoiceNumber,
                customer_name: invoice.customer,
                date: invoice.date,
                due_date: invoice.dueDate,
                amount: invoice.amount,
                status: invoice.status,
                items_count: invoice.itemsCount
            };

            const { error: invError } = await supabase.from('invoices').insert([invPayload]);
            if (invError) throw new Error(invError.message);
            // Invoice items skipped for Supabase mvp as table missing or complex, matches previous logic
            return invoice;
        } else {
            return new Promise((resolve, reject) => {
                const sql = `INSERT INTO invoices (id, invoice_number, customer_name, date, due_date, amount, status, items_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                db.run(sql, [invoice.id, invoice.invoiceNumber, invoice.customer, invoice.date, invoice.dueDate, invoice.amount, invoice.status, invoice.itemsCount], function (err) {
                    if (err) reject(err);
                    else resolve(invoice);
                });
            });
        }
    },

    getPayments: async () => {
        if (isVercel) {
            const { data, error } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
            if (error) throw new Error(error.message);
            return data;
        } else {
            return new Promise((resolve, reject) => {
                db.all(`SELECT id, payment_number as paymentNumber, vendor, amount, date, method, status FROM payments ORDER BY created_at DESC`, [], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
        }
    },

    createPayment: async (payment) => {
        if (isVercel) {
            const payload = {
                id: payment.id,
                payment_number: payment.paymentNumber,
                vendor: payment.vendor,
                amount: payment.amount,
                date: payment.date,
                method: payment.method,
                status: payment.status
            };
            const { error } = await supabase.from('payments').insert([payload]);
            if (error) throw new Error(error.message);
            return payment;
        } else {
            return new Promise((resolve, reject) => {
                const sql = `INSERT INTO payments (id, payment_number, vendor, amount, date, method, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                db.run(sql, [payment.id, payment.paymentNumber, payment.vendor, payment.amount, payment.date, payment.method, payment.status], function (err) {
                    if (err) reject(err);
                    else resolve(payment);
                });
            });
        }
    },

    updatePaymentStatus: async (id, status) => {
        if (isVercel) {
            const { error } = await supabase.from('payments').update({ status }).eq('id', id);
            if (error) throw new Error(error.message);
            return { id, status };
        } else {
            return new Promise((resolve, reject) => {
                db.run(`UPDATE payments SET status = ? WHERE id = ?`, [status, id], function (err) {
                    if (err) reject(err);
                    else resolve({ id, status });
                });
            });
        }
    },

    deletePayment: async (id) => {
        if (isVercel) {
            const { error } = await supabase.from('payments').delete().eq('id', id);
            if (error) throw new Error(error.message);
            return true;
        } else {
            return new Promise((resolve, reject) => {
                db.run("DELETE FROM payments WHERE id = ?", [id], (err) => {
                    if (err) reject(err);
                    else resolve(true);
                });
            });
        }
    }
};

// --- CRM Operations ---
dbAdapter.crm = {
    getCustomers: async () => {
        if (isVercel) {
            const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
            if (error) throw new Error(error.message);
            return data;
        } else {
            return new Promise((resolve, reject) => {
                db.all(`SELECT id, name, company, email, phone, address, status, notes, total_orders as totalOrders, last_order_date as lastOrderDate FROM customers ORDER BY created_at DESC`, [], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
        }
    },
    createCustomer: async (customer) => {
        if (isVercel) {
            const payload = {
                id: customer.id,
                name: customer.name,
                company: customer.company,
                email: customer.email,
                phone: customer.phone,
                address: customer.address,
                status: customer.status,
                notes: customer.notes
            };
            const { error } = await supabase.from('customers').insert([payload]);
            if (error) throw new Error(error.message);
            return { ...customer, totalOrders: 0 };
        } else {
            return new Promise((resolve, reject) => {
                const sql = `INSERT INTO customers (id, name, company, email, phone, address, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                db.run(sql, [customer.id, customer.name, customer.company, customer.email, customer.phone, customer.address, customer.status, customer.notes], function (err) {
                    if (err) reject(err);
                    else resolve({ ...customer, totalOrders: 0 });
                });
            });
        }
    },
    updateCustomer: async (id, updates) => {
        if (isVercel) {
            const mapped = {};
            for (const [key, val] of Object.entries(updates)) {
                if (key === 'totalOrders') mapped.total_orders = val;
                else if (key === 'lastOrderDate') mapped.last_order_date = val;
                else mapped[key] = val;
            }
            const { error } = await supabase.from('customers').update(mapped).eq('id', id);
            if (error) throw new Error(error.message);
            const { data } = await supabase.from('customers').select('*').eq('id', id).single();
            return data;
        } else {
            return new Promise((resolve, reject) => {
                const keys = Object.keys(updates);
                if (keys.length === 0) return resolve({});
                const fields = keys.map((key) => {
                    let col = key;
                    if (key === 'totalOrders') col = 'total_orders';
                    if (key === 'lastOrderDate') col = 'last_order_date';
                    return `${col} = ?`;
                });
                const values = keys.map(k => updates[k]);
                values.push(id);
                const sql = `UPDATE customers SET ${fields.join(', ')} WHERE id = ?`;
                db.run(sql, values, function (err) {
                    if (err) reject(err);
                    else {
                        db.get("SELECT id, name, company, email, phone, address, status, notes, total_orders as totalOrders, last_order_date as lastOrderDate FROM customers WHERE id = ?", [id], (err, row) => resolve(row));
                    }
                });
            });
        }
    },
    deleteCustomer: async (id) => {
        if (isVercel) {
            const { error } = await supabase.from('customers').delete().eq('id', id);
            if (error) throw new Error(error.message);
            return true;
        } else {
            return new Promise((resolve, reject) => {
                db.run("DELETE FROM customers WHERE id = ?", [id], (err) => {
                    if (err) reject(err);
                    else resolve(true);
                });
            });
        }
    },
    getLeads: async () => {
        if (isVercel) {
            const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
            if (error) throw new Error(error.message);
            return data;
        } else {
            return new Promise((resolve, reject) => {
                db.all(`SELECT * FROM leads ORDER BY created_at DESC`, [], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
        }
    },
    createLead: async (lead) => {
        if (isVercel) {
            const payload = {
                id: lead.id,
                name: lead.name,
                company: lead.company,
                email: lead.email,
                phone: lead.phone,
                source: lead.source,
                status: lead.status,
                estimated_value: lead.estimatedValue
            };
            const { error } = await supabase.from('leads').insert([payload]);
            if (error) throw new Error(error.message);
            return lead;
        } else {
            return new Promise((resolve, reject) => {
                const sql = `INSERT INTO leads (id, name, company, email, phone, source, status, estimated_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                db.run(sql, [lead.id, lead.name, lead.company, lead.email, lead.phone, lead.source, lead.status, lead.estimatedValue], function (err) {
                    if (err) reject(err);
                    else resolve(lead);
                });
            });
        }
    },
    updateLead: async (id, updates) => {
        if (isVercel) {
            const mapped = {};
            for (const [key, val] of Object.entries(updates)) {
                if (key === 'estimatedValue' || key === 'value') mapped.estimated_value = val;
                else mapped[key] = val;
            }
            const { error } = await supabase.from('leads').update(mapped).eq('id', id);
            if (error) throw new Error(error.message);
            return { id, ...updates };
        } else {
            return new Promise((resolve, reject) => {
                const keys = Object.keys(updates);
                if (keys.length === 0) return resolve({});
                const fields = keys.map((key) => {
                    if (key === 'estimatedValue' || key === 'value') return 'estimated_value = ?';
                    return `${key} = ?`;
                });
                const values = keys.map(k => updates[k]);
                values.push(id);
                const sql = `UPDATE leads SET ${fields.join(', ')} WHERE id = ?`;
                db.run(sql, values, function (err) {
                    if (err) reject(err);
                    else resolve({ id, ...updates });
                });
            });
        }
    },
    deleteLead: async (id) => {
        if (isVercel) {
            const { error } = await supabase.from('leads').delete().eq('id', id);
            if (error) throw new Error(error.message);
            return true;
        } else {
            return new Promise((resolve, reject) => {
                db.run("DELETE FROM leads WHERE id = ?", [id], (err) => {
                    if (err) reject(err);
                    else resolve(true);
                });
            });
        }
    }
};

// --- Purchasing Operations ---
dbAdapter.purchasing = {
    getVendors: async () => {
        if (isVercel) {
            const { data, error } = await supabase.from('vendors').select('*').order('created_at', { ascending: false });
            if (error) throw new Error(error.message);
            return data;
        } else {
            return new Promise((resolve, reject) => {
                db.all(`SELECT id, company_name as companyName, contact_person as contactPerson, email, phone, address, rating, status FROM vendors ORDER BY created_at DESC`, [], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
        }
    },
    createVendor: async (vendor) => {
        if (isVercel) {
            const payload = {
                id: vendor.id,
                company_name: vendor.companyName,
                contact_person: vendor.contactPerson,
                email: vendor.email,
                phone: vendor.phone,
                address: vendor.address,
                rating: vendor.rating,
                status: vendor.status
            };
            const { error } = await supabase.from('vendors').insert([payload]);
            if (error) throw new Error(error.message);
            return vendor;
        } else {
            return new Promise((resolve, reject) => {
                const sql = `INSERT INTO vendors (id, company_name, contact_person, email, phone, address, rating, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                db.run(sql, [vendor.id, vendor.companyName, vendor.contactPerson, vendor.email, vendor.phone, vendor.address, vendor.rating, vendor.status], function (err) {
                    if (err) reject(err);
                    else resolve(vendor);
                });
            });
        }
    },
    updateVendor: async (id, updates) => {
        if (isVercel) {
            const mapped = {};
            for (const [key, val] of Object.entries(updates)) {
                if (key === 'companyName') mapped.company_name = val;
                else if (key === 'contactPerson') mapped.contact_person = val;
                else mapped[key] = val;
            }
            const { error } = await supabase.from('vendors').update(mapped).eq('id', id);
            if (error) throw new Error(error.message);
            return { id, ...updates };
        } else {
            return new Promise((resolve, reject) => {
                const keys = Object.keys(updates);
                if (keys.length === 0) return resolve({});
                const fields = keys.map((key) => {
                    if (key === 'companyName') return 'company_name = ?';
                    if (key === 'contactPerson') return 'contact_person = ?';
                    return `${key} = ?`;
                });
                const values = keys.map(k => updates[k]);
                values.push(id);
                db.run(`UPDATE vendors SET ${fields.join(', ')} WHERE id = ?`, values, function (err) {
                    if (err) reject(err);
                    else resolve({ id, ...updates });
                });
            });
        }
    },
    deleteVendor: async (id) => {
        if (isVercel) {
            const { error } = await supabase.from('vendors').delete().eq('id', id);
            if (error) throw new Error(error.message);
            return true;
        } else {
            return new Promise((resolve, reject) => {
                db.run("DELETE FROM vendors WHERE id = ?", [id], (err) => {
                    if (err) reject(err);
                    else resolve(true);
                });
            });
        }
    },

    // --- Purchase Orders ---
    getPurchaseOrders: async () => {
        if (isVercel) {
            const { data, error } = await supabase.from('purchase_orders').select('*').order('created_at', { ascending: false });
            if (error) throw new Error(error.message);
            return data;
        } else {
            return new Promise((resolve, reject) => {
                db.all(`SELECT id, po_number as poNumber, vendor, date, expected_date as expectedDate, amount, status FROM purchase_orders ORDER BY created_at DESC`, [], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
        }
    },
    createPurchaseOrder: async (po) => {
        if (isVercel) {
            const payload = {
                id: po.id,
                po_number: po.poNumber,
                vendor: po.vendor,
                date: po.date,
                expected_date: po.expectedDate,
                amount: po.amount,
                status: po.status
            };
            const { error } = await supabase.from('purchase_orders').insert([payload]);
            if (error) throw new Error(error.message);
            return po;
        } else {
            return new Promise((resolve, reject) => {
                const sql = `INSERT INTO purchase_orders (id, po_number, vendor, date, expected_date, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                db.run(sql, [po.id, po.poNumber, po.vendor, po.date, po.expectedDate, po.amount, po.status], function (err) {
                    if (err) reject(err);
                    else resolve(po);
                });
            });
        }
    },
    updatePurchaseOrder: async (id, updates) => {
        if (isVercel) {
            const mapped = {};
            for (const [key, val] of Object.entries(updates)) {
                if (key === 'expectedDate') mapped.expected_date = val;
                else mapped[key] = val;
            }
            const { error } = await supabase.from('purchase_orders').update(mapped).eq('id', id);
            if (error) throw new Error(error.message);
            return { id, ...updates };
        } else {
            return new Promise((resolve, reject) => {
                const keys = Object.keys(updates);
                if (keys.length === 0) return resolve({});
                const fields = keys.map((key) => {
                    if (key === 'expectedDate') return 'expected_date = ?';
                    return `${key} = ?`;
                });
                const values = keys.map(k => updates[k]);
                values.push(id);
                db.run(`UPDATE purchase_orders SET ${fields.join(', ')} WHERE id = ?`, values, function (err) {
                    if (err) reject(err);
                    else resolve({ id, ...updates });
                });
            });
        }
    },
    deletePurchaseOrder: async (id) => {
        if (isVercel) {
            const { error } = await supabase.from('purchase_orders').delete().eq('id', id);
            if (error) throw new Error(error.message);
            return true;
        } else {
            return new Promise((resolve, reject) => {
                db.run("DELETE FROM purchase_orders WHERE id = ?", [id], (err) => {
                    if (err) reject(err);
                    else resolve(true);
                });
            });
        }
    },

    // --- Bills ---
    getBills: async () => {
        if (isVercel) {
            const { data, error } = await supabase.from('bills').select('*').order('created_at', { ascending: false });
            if (error) throw new Error(error.message);
            return data;
        } else {
            return new Promise((resolve, reject) => {
                db.all(`SELECT id, bill_number as billNumber, vendor, date, due_date as dueDate, amount, status FROM bills ORDER BY created_at DESC`, [], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
        }
    },
    createBill: async (bill) => {
        if (isVercel) {
            const payload = {
                id: bill.id,
                bill_number: bill.billNumber,
                vendor: bill.vendor,
                date: bill.date,
                due_date: bill.dueDate,
                amount: bill.amount,
                status: bill.status
            };
            const { error } = await supabase.from('bills').insert([payload]);
            if (error) throw new Error(error.message);
            return bill;
        } else {
            return new Promise((resolve, reject) => {
                const sql = `INSERT INTO bills (id, bill_number, vendor, date, due_date, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                db.run(sql, [bill.id, bill.billNumber, bill.vendor, bill.date, bill.dueDate, bill.amount, bill.status], function (err) {
                    if (err) reject(err);
                    else resolve(bill);
                });
            });
        }
    },
    updateBill: async (id, updates) => {
        if (isVercel) {
            const mapped = {};
            for (const [key, val] of Object.entries(updates)) {
                if (key === 'dueDate') mapped.due_date = val;
                else mapped[key] = val;
            }
            const { error } = await supabase.from('bills').update(mapped).eq('id', id);
            if (error) throw new Error(error.message);
            return { id, ...updates };
        } else {
            return new Promise((resolve, reject) => {
                const keys = Object.keys(updates);
                if (keys.length === 0) return resolve({});
                const fields = keys.map((key) => {
                    if (key === 'dueDate') return 'due_date = ?';
                    return `${key} = ?`;
                });
                const values = keys.map(k => updates[k]);
                values.push(id);
                db.run(`UPDATE bills SET ${fields.join(', ')} WHERE id = ?`, values, function (err) {
                    if (err) reject(err);
                    else resolve({ id, ...updates });
                });
            });
        }
    },
    deleteBill: async (id) => {
        if (isVercel) {
            const { error } = await supabase.from('bills').delete().eq('id', id);
            if (error) throw new Error(error.message);
            return true;
        } else {
            return new Promise((resolve, reject) => {
                db.run("DELETE FROM bills WHERE id = ?", [id], (err) => {
                    if (err) reject(err);
                    else resolve(true);
                });
            });
        }
    }
};

// --- System Operations ---
dbAdapter.system = {
    getLogs: async () => {
        if (isVercel) {
            const { data, error } = await supabase.from('activity_logs').select('*').order('timestamp', { ascending: false }).limit(50);
            if (error) return []; // Return empty if error or table missing
            return data;
        } else {
            return new Promise((resolve, reject) => {
                db.all(`SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT 50`, [], (err, rows) => {
                    // Resolve empty if generic error (e.g. table not found in early dev)
                    if (err) resolve([]);
                    else resolve(rows);
                });
            });
        }
    },
    getCompanyProfile: async () => {
        if (isVercel) {
            // Try fetching, if fail return mock
            try {
                const { data, error } = await supabase.from('company_profile').select('*').limit(1).single();
                if (error || !data) throw error;
                return data;
            } catch (e) {
                return {
                    name: 'Financa Global',
                    legalName: 'Financa Technologies Pvt Ltd',
                    email: 'admin@financa.com'
                };
            }
        } else {
            return new Promise((resolve, reject) => {
                db.get(`SELECT * FROM company_profile LIMIT 1`, [], (err, row) => {
                    if (err || !row) {
                        resolve({
                            name: 'Financa Global',
                            legalName: 'Financa Technologies Pvt Ltd',
                            email: 'admin@financa.com'
                        });
                    } else {
                        resolve(row);
                    }
                });
            });
        }
    }
};


























export default dbAdapter;
