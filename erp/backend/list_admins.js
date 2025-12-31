
import db from './db.js';

db.all("SELECT id, name, email, role, created_at FROM users", [], (err, rows) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(JSON.stringify(rows, null, 2));
});
