import { calculateAccountBalance } from '../utils/accountingCalculations';

const IncomeStatement = ({ transactions, accounts }) => {
    // Helper to get balance for an account
    const getBalance = (accountId) => {
        // Find account by ID (DB ID)
        const account = accounts.find(a => a.id === accountId);
        if (!account) return 0;
        const { balance } = calculateAccountBalance(account, transactions);
        return balance;
    };

    // Helper to get total balance for a type
    const getTotalByType = (type) => {
        return accounts
            .filter(a => a.type === type)
            .reduce((sum, account) => {
                const { balance } = calculateAccountBalance(account, transactions);
                return sum + balance;
            }, 0);
    };

    const totalRevenue = getTotalByType('Revenue');
    const totalExpenses = getTotalByType('Expense');

    // Calculate COGS specifically if it exists, otherwise 0
    // We need to find accounts with name "Cost of Goods Sold" or similar type if we had a subtype
    // For now, let's assume COGS is an Expense account with a specific name or we just sum all Expenses as Operating for simplicity
    // unless we have specific COGS accounts.
    // In the previous implementation, we might have filtered by name.
    // Let's stick to the previous logic: Revenue - COGS = Gross Profit.
    // We need to identify COGS accounts.
    const cogsAccounts = accounts.filter(a => a.name === 'Cost of Goods Sold');
    const cogsTotal = cogsAccounts.reduce((sum, account) => {
        const { balance } = calculateAccountBalance(account, transactions);
        return sum + balance;
    }, 0);

    const grossProfit = totalRevenue - cogsTotal;

    // Operating Expenses are all expenses MINUS COGS
    const operatingExpensesTotal = totalExpenses - cogsTotal;
    const netProfit = grossProfit - operatingExpensesTotal;

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-lg border border-gray-200 min-h-[800px] p-12 relative">
            {/* Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-widest mb-2">Income Statement</h2>
                <p className="text-gray-500 font-mono text-sm">For the Period Ended {new Date().toLocaleDateString()}</p>
                <div className="w-24 h-1 bg-gray-900 mx-auto mt-6"></div>
            </div>

            {/* Content */}
            <div className="space-y-8 font-mono text-gray-800">

                {/* Revenue Section */}
                <div>
                    <h3 className="font-bold text-gray-900 uppercase mb-4 border-b border-gray-300 pb-2">Revenue</h3>
                    {accounts.filter(a => a.type === 'Revenue').map(account => {
                        const { balance } = calculateAccountBalance(account, transactions);
                        if (balance === 0) return null;
                        return (
                            <div key={account.id} className="flex justify-between py-2 hover:bg-gray-50">
                                <span>{account.name}</span>
                                <span>{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </div>
                        );
                    })}
                    <div className="flex justify-between py-2 font-bold border-t border-gray-900 mt-2">
                        <span>Total Revenue</span>
                        <span>{totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>

                {/* Cost of Goods Sold */}
                <div>
                    <h3 className="font-bold text-gray-900 uppercase mb-4 border-b border-gray-300 pb-2">Cost of Sales</h3>
                    {cogsAccounts.map(account => {
                        const { balance } = calculateAccountBalance(account, transactions);
                        if (balance === 0) return null;
                        return (
                            <div key={account.id} className="flex justify-between py-2 hover:bg-gray-50">
                                <span>{account.name}</span>
                                <span>{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </div>
                        );
                    })}
                    <div className="flex justify-between py-2 font-bold border-t border-gray-900 mt-2">
                        <span>Total Cost of Goods Sold</span>
                        <span>{cogsTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>

                {/* Gross Profit */}
                <div className="flex justify-between py-4 font-bold text-lg bg-gray-50 px-4 border-y-2 border-gray-200">
                    <span>Gross Profit</span>
                    <span>{grossProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>

                {/* Operating Expenses */}
                <div>
                    <h3 className="font-bold text-gray-900 uppercase mb-4 border-b border-gray-300 pb-2">Operating Expenses</h3>
                    {accounts.filter(a => a.type === 'Expense' && a.name !== 'Cost of Goods Sold').map(account => {
                        const { balance } = calculateAccountBalance(account, transactions);
                        if (balance === 0) return null;
                        return (
                            <div key={account.id} className="flex justify-between py-2 hover:bg-gray-50">
                                <span>{account.name}</span>
                                <span>{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </div>
                        );
                    })}
                    <div className="flex justify-between py-2 font-bold border-t border-gray-900 mt-2">
                        <span>Total Operating Expenses</span>
                        <span>{operatingExpensesTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>

                {/* Net Profit */}
                <div className="mt-12">
                    <div className={`flex justify-between items-center p-6 border-4 border-double ${netProfit >= 0 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                        <span className="text-xl font-bold uppercase tracking-widest text-gray-900">Net Profit</span>
                        <span className={`text-2xl font-bold font-mono ${netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                            {netProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </span>
                    </div>
                </div>

            </div>

            {/* Footer Note */}
            <div className="absolute bottom-12 left-12 right-12 text-center text-xs text-gray-400 font-mono">
                Generated by Office Ledger Pro • Financial Reporting Module
            </div>
        </div>
    );
};

export default IncomeStatement;
