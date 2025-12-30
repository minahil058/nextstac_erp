
import db from '../db.js';

const sql = `ALTER TABLE employees ADD COLUMN cnic VARCHAR(20)`;

db.run(sql, [], function (err) {
    if (err) {
        if (err.message.includes('duplicate column name')) {
            console.log('Column "cnic" already exists on table "employees". Skipping.');
        } else {
            console.error('Error adding column:', err.message);
        }
    } else {
        console.log('Successfully added "cnic" column to "employees" table.');
    }
});
