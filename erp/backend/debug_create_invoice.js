
import db from './db.js';
import { v4 as uuidv4 } from 'uuid';

console.log("Attempting to create invoice...");

const id = uuidv4();
const invoiceNumber = `INV-TEST-${Date.now()}`;
const customer = "Test Customer";
const date = new Date().toISOString();
const dueDate = new Date().toISOString();
const totalAmount = 100;
const itemsCount = 1;

const sqlInvoice = `INSERT INTO invoices (id, invoice_number, customer_name, date, due_date, amount, status, items_count) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

const paramsInvoice = [id, invoiceNumber, customer, date, dueDate, totalAmount, 'Pending', itemsCount];

db.serialize(() => {
    console.log("Inserting Invoice Header...");
    db.run(sqlInvoice, paramsInvoice, function (err) {
        if (err) {
            console.error("Invoice Header Insert Failed:", err.message);
            return;
        }
        console.log("Invoice Header Inserted. ID:", id);

        const sqlItem = `INSERT INTO invoice_items (id, invoice_id, product_id, description, quantity, unit_price, amount) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const itemId = uuidv4();

        // Simulating item with NULL product_id (as per controller fallback)
        const paramsItem = [itemId, id, null, 'Test Item', 1, 100, 100];

        console.log("Inserting Invoice Item...");
        db.run(sqlItem, paramsItem, function (err) {
            if (err) {
                console.error("Invoice Item Insert Failed:", err.message);
            } else {
                console.log("Invoice Item Inserted Successfully.");
            }
        });
    });
});
