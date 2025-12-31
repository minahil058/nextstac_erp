import db from './db.js';

const clearTransactions = () => {
    db.serialize(() => {
        db.run('DELETE FROM transactions', (err) => {
            if (err) {
                console.error('Error clearing transactions:', err);
            } else {
                console.log('All transactions cleared successfully.');
            }
        });
    });
};

clearTransactions();
