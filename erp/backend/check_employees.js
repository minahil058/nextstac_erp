import dbAdapter from './dbAdapter.js';

const checkEmployees = async () => {
    try {
        // Wait for DB interactions
        setTimeout(async () => {
            const employees = await dbAdapter.hr.getAllEmployees();
            console.log('Total Employees:', employees.length);

            // Check for specific emails
            const targets = ['awaisties@gmail.com', 'zuhairshad140@gmail.com', 'malikmubashiraslam@gmail.com'];
            const found = employees.filter(e => targets.includes(e.email));

            if (found.length > 0) {
                console.log('Found existing employees:', found.map(e => `${e.email} (Dept: ${e.department || e.department_name}, Status: ${e.status})`));
            } else {
                console.log('No conflict found with admin emails.');
            }

            process.exit(0);
        }, 1000);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

checkEmployees();
