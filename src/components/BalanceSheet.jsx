import { calculateAccountBalance, calculateNetProfit } from '../utils/accountingCalculations';

const BalanceSheet = ({ transactions, accounts }) => {
    // Helper to get total balance for a type
    const getTotalByType = (type) => {
        return accounts
            .filter(a => a.type === type)
            .reduce((sum, account) => {
                const { balance } = calculateAccountBalance(account, transactions);
                return sum + balance;
            }, 0);
    };

    // Assets
    const totalAssets = getTotalByType('Asset');

    // Liabilities
    const totalLiabilities = getTotalByType('Liability');

    // Equity
    // 1. Capital
    const capitalAccount = accounts.find(a => a.name === "Owner's Capital");
    const capitalBalance = capitalAccount ? calculateAccountBalance(capitalAccount, transactions).balance : 0;

    // 2. Drawings (Contra Equity)
    const drawingsAccount = accounts.find(a => a.name === "Drawings");
    const drawingsBalance = drawingsAccount ? calculateAccountBalance(drawingsAccount, transactions).balance : 0;

    // 3. Net Profit (Revenue - Expenses)
    // We can use the utility or calculate it here. Let's use the utility if it works with our accounts array.
    // Assuming calculateNetProfit expects (accounts, transactions)
    const netProfit = calculateNetProfit(accounts, transactions);

    // Total Equity = Capital + Net Profit - Drawings
    // Note: Drawings is a Debit balance, so calculateAccountBalance returns a positive number for it.
    // We subtract it from Equity.
    const totalEquity = capitalBalance + netProfit - drawingsBalance;

    const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;
    const isBalanced = Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01;

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-lg border border-gray-200 min-h-[800px] p-12 relative">
            {/* Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-widest mb-2">Balance Sheet</h2>
                <p className="text-gray-500 font-mono text-sm">As of {new Date().toLocaleDateString()}</p>
                <div className="w-24 h-1 bg-gray-900 mx-auto mt-6"></div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-mono text-gray-800">

                {/* Left Column: Assets */}
                <div>
                    <h3 className="font-bold text-gray-900 uppercase mb-4 border-b-2 border-gray-900 pb-2">Assets</h3>
                    <div className="space-y-2">
                        {accounts.filter(a => a.type === 'Asset').map(account => {
                            const { balance } = calculateAccountBalance(account, transactions);
                            if (balance === 0) return null;
                            return (
                                <div key={account.id} className="flex justify-between py-1 hover:bg-gray-50">
                                    <span>{account.name}</span>
                                    <span>{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-between py-4 font-bold border-t-2 border-gray-900 mt-8 text-lg">
                        <span>Total Assets</span>
                        <span>{totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>

                {/* Right Column: Liabilities & Equity */}
                <div>
                    {/* Liabilities */}
                    <div className="mb-12">
                        <h3 className="font-bold text-gray-900 uppercase mb-4 border-b-2 border-gray-900 pb-2">Liabilities</h3>
                        <div className="space-y-2">
                            {accounts.filter(a => a.type === 'Liability').map(account => {
                                const { balance } = calculateAccountBalance(account, transactions);
                                if (balance === 0) return null;
                                return (
                                    <div key={account.id} className="flex justify-between py-1 hover:bg-gray-50">
                                        <span>{account.name}</span>
                                        <span>{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between py-2 font-bold border-t border-gray-300 mt-4">
                            <span>Total Liabilities</span>
                            <span>{totalLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>

                    {/* Equity */}
                    <div>
                        <h3 className="font-bold text-gray-900 uppercase mb-4 border-b-2 border-gray-900 pb-2">Equity</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between py-1">
                                <span>Owner's Capital</span>
                                <span>{capitalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between py-1 text-green-700">
                                <span>Add: Net Profit</span>
                                <span>{netProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between py-1 text-red-700">
                                <span>Less: Drawings</span>
                                <span>({drawingsBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })})</span>
                            </div>
                        </div>
                        <div className="flex justify-between py-2 font-bold border-t border-gray-300 mt-4">
                            <span>Total Equity</span>
                            <span>{totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>

                    {/* Total Liab & Equity */}
                    <div className="flex justify-between py-4 font-bold border-t-2 border-gray-900 mt-8 text-lg">
                        <span>Total Liab. & Equity</span>
                        <span>{totalLiabilitiesAndEquity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>

            {/* Validation Badge */}
            <div className={`absolute top-12 right-12 px-4 py-2 rounded-full text-sm font-bold border flex items-center gap-2 ${isBalanced
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                <span className={`w-2 h-2 rounded-full ${isBalanced ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {isBalanced ? 'BALANCED' : 'UNBALANCED'}
            </div>

            {/* Footer Note */}
            <div className="absolute bottom-12 left-12 right-12 text-center text-xs text-gray-400 font-mono">
                Generated by Office Ledger Pro • Financial Reporting Module
            </div>
        </div>
    );
};

export default BalanceSheet;
