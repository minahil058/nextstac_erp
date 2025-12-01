// Calculate the balance for a specific account based on all transactions
export const calculateAccountBalance = (account, transactions) => {
    let debitTotal = 0;
    let creditTotal = 0;

    transactions.forEach(transaction => {
        // Handle both Supabase (snake_case) and legacy (camelCase) structures
        const debitId = transaction.debit_account_id || transaction.debitAccount?.id;
        const creditId = transaction.credit_account_id || transaction.creditAccount?.id;

        if (debitId === account.id) {
            debitTotal += parseFloat(transaction.amount);
        }
        if (creditId === account.id) {
            creditTotal += parseFloat(transaction.amount);
        }
    });

    const balance = debitTotal - creditTotal;

    return {
        debitTotal,
        creditTotal,
        balance,
        balanceType: balance >= 0 ? 'Debit' : 'Credit',
        balanceAmount: Math.abs(balance)
    };
};

// Calculate Net Profit from Income Statement
export const calculateNetProfit = (accounts, transactions) => {
    // Revenue accounts
    const revenueAccounts = accounts.filter(acc => acc.type === 'Revenue');
    const totalRevenue = revenueAccounts.reduce((sum, account) => {
        const { creditTotal, debitTotal } = calculateAccountBalance(account, transactions);
        return sum + (creditTotal - debitTotal); // Revenue is credit balance
    }, 0);

    // Expense accounts
    const expenseAccounts = accounts.filter(acc => acc.type === 'Expense');
    const totalExpenses = expenseAccounts.reduce((sum, account) => {
        const { debitTotal, creditTotal } = calculateAccountBalance(account, transactions);
        return sum + (debitTotal - creditTotal); // Expenses are debit balance
    }, 0);

    return totalRevenue - totalExpenses;
};

// Get accounts with balances for Trial Balance
export const getAccountsWithBalances = (accounts, transactions) => {
    return accounts.map(account => {
        const balanceInfo = calculateAccountBalance(account, transactions);
        return {
            ...account,
            ...balanceInfo
        };
    }).filter(account => account.balanceAmount > 0); // Only show accounts with balances
};
