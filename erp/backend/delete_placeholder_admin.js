
import db from './db.js';

const emailToDelete = 'admin@test.com';

db.run("DELETE FROM users WHERE email = ?", [emailToDelete], function (err) {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`Deleted user with email ${emailToDelete}. Rows affected: ${this.changes}`);
});
