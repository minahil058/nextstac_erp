import dbAdapter from './dbAdapter.js';
import db from './db.js';

const fixDepartments = async () => {
    try {
        setTimeout(() => {
            console.log('Fixing employee departments...');

            // Fix Awais
            db.run("UPDATE employees SET department_name = 'E-commerce' WHERE email LIKE '%awais%' OR first_name = 'Awais'", [], (err) => {
                if (err) console.error(err);
                else console.log('Updated Awais to E-commerce');
            });

            // Fix Zuhair
            db.run("UPDATE employees SET department_name = 'Web Development' WHERE email LIKE '%zuhair%'", [], (err) => {
                if (err) console.error(err);
                else console.log('Updated Zuhair to Web Development');
            });

            // Fix generic unassigned if needed, but let's stick to specific

            setTimeout(() => {
                console.log('Done.');
                process.exit(0);
            }, 1000);
        }, 1000);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

fixDepartments();
