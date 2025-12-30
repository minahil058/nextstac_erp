
import db from './db.js';
import { v4 as uuidv4 } from 'uuid';

console.log("Attempting strict controller simulation...");

const id = uuidv4();
const invoiceNumber = `INV-SIM-${Date.now()}`;
const customer = "Test Customer";
const date = new Date().toISOString();
const dueDate = new Date().toISOString();
const totalAmount = 100;
const itemsCount = 1;

const sqlInvoice = `INSERT INTO invoices (id, invoice_number, customer_name, date, due_date, amount, status, items_count) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

const paramsInvoice = [id, invoiceNumber, customer, date, dueDate, totalAmount, 'Pending', itemsCount];

db.serialize(() => {
    // Enable FKs just to be absolutely sure
    db.run("PRAGMA foreign_keys = ON");

    db.run(sqlInvoice, paramsInvoice, function (err) {
        if (err) {
            console.error("Invoice Header Failed:", err.message);
            return;
        }
        console.log("Invoice Header Inserted. ID:", id);

        const items = [{ name: 'Test Item', price: 100, quantity: 1, id: 'fake-prod-id' }];

        if (items && items.length > 0) {
            const sqlItem = `INSERT INTO invoice_items (id, invoice_id, product_id, description, quantity, unit_price, amount) VALUES (?, ?, ?, ?, ?, ?, ?)`;

            const stmt = db.prepare(sqlItem);
            items.forEach(item => {
                const itemId = uuidv4();
                const itemAmount = item.price * item.quantity;
                console.log(`Inserting item referencing Invoice ID: ${id}`);
                stmt.run(itemId, id, item.id || null, item.name || 'Item', item.quantity, item.price, itemAmount, (err) => {
                    if (err) console.error("Item Insert Failed:", err.message);
                    else console.log("Item Inserted.");
                });
            });
            stmt.finalize();
        }
    });
});
