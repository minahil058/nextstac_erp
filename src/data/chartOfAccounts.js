// Chart of Accounts - Standard Accounting Structure
export const chartOfAccounts = [
    // ASSETS
    {
        id: 'cash',
        name: 'Cash',
        type: 'Asset',
        normalBalance: 'Debit'
    },
    {
        id: 'bank',
        name: 'Bank',
        type: 'Asset',
        normalBalance: 'Debit'
    },
    {
        id: 'accounts-receivable',
        name: 'Accounts Receivable',
        type: 'Asset',
        normalBalance: 'Debit'
    },
    {
        id: 'furniture',
        name: 'Furniture',
        type: 'Asset',
        normalBalance: 'Debit'
    },
    {
        id: 'office-equipment',
        name: 'Office Equipment',
        type: 'Asset',
        normalBalance: 'Debit'
    },

    // LIABILITIES
    {
        id: 'accounts-payable',
        name: 'Accounts Payable',
        type: 'Liability',
        normalBalance: 'Credit'
    },

    // EQUITY
    {
        id: 'owners-capital',
        name: "Owner's Capital",
        type: 'Equity',
        normalBalance: 'Credit'
    },
    {
        id: 'drawings',
        name: 'Drawings',
        type: 'Equity',
        normalBalance: 'Debit' // Contra-equity account
    },

    // REVENUE
    {
        id: 'service-revenue',
        name: 'Service Revenue',
        type: 'Revenue',
        normalBalance: 'Credit'
    },
    {
        id: 'sales-revenue',
        name: 'Sales Revenue',
        type: 'Revenue',
        normalBalance: 'Credit'
    },

    // EXPENSES
    {
        id: 'rent-expense',
        name: 'Rent Expense',
        type: 'Expense',
        normalBalance: 'Debit'
    },
    {
        id: 'salary-expense',
        name: 'Salary Expense',
        type: 'Expense',
        normalBalance: 'Debit'
    },
    {
        id: 'utilities',
        name: 'Utilities',
        type: 'Expense',
        normalBalance: 'Debit'
    },
    {
        id: 'cost-of-goods-sold',
        name: 'Cost of Goods Sold',
        type: 'Expense',
        normalBalance: 'Debit'
    }
];

// Helper function to get account by ID
export const getAccountById = (id) => {
    return chartOfAccounts.find(account => account.id === id);
};

// Helper function to get accounts by type
export const getAccountsByType = (type) => {
    return chartOfAccounts.filter(account => account.type === type);
};
