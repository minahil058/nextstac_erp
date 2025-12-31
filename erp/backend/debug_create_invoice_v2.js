
import db from './db.js';
import { v4 as uuidv4 } from 'uuid';

console.log("Attempting to create invoice with fake product ID...");

const id = uuidv4();
const invoiceNumber = `INV-TEST-${Date.now()}`;
const customer = "Test Customer";
const date = new Date().toISOString();
const dueDate = new Date().toISOString();

const sqlInvoice = `INSERT INTO invoices (id, invoice_number, customer_name, date, due_date, amount, status, items_count) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

db.serialize(() => {
    db.run(sqlInvoice, [id, invoiceNumber, customer, date, dueDate, 100, 'Pending', 1], function (err) {
        if (err) { console.error("Header Error:", err.message); return; }
        console.log("Header Inserted.");

        const sqlItem = `INSERT INTO invoice_items (id, invoice_id, product_id, description, quantity, unit_price, amount) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const itemId = uuidv4();
        const fakeProductId = "fake-product-id-123";

        db.run(sqlItem, [itemId, id, fakeProductId, 'Test Item', 1, 100, 100], function (err) {
            if (err) {
                console.error("Item Insert Failed:", err.message);
            } else {
                console.log("Item Inserted Successfully (Means NO FK to Products).");
            }
        });
    });
});
