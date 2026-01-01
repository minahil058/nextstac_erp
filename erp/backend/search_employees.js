import dbAdapter from './dbAdapter.js';
import db from './db.js';

const searchEmployees = async () => {
    try {
        setTimeout(() => {
            db.all("SELECT * FROM employees WHERE email LIKE '%awais%' OR email LIKE '%zuhair%'", [], (err, rows) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Search Results:', rows);
                }
                process.exit(0);
            });
        }, 1000);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

searchEmployees();
