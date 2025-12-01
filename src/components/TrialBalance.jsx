import { calculateAccountBalance } from '../utils/accountingCalculations';

const TrialBalance = ({ transactions, accounts }) => {
    // Calculate balances for all accounts
    const accountBalances = accounts.map(account => {
        const { balanceAmount, balanceType } = calculateAccountBalance(account, transactions);
        return {
            ...account,
            balance: balanceAmount,
            balanceType: balanceType
        };
    }).filter(acc => acc.balance > 0); // Only show accounts with non-zero balance

    const totalDebits = accountBalances
        .filter(a => a.balanceType === 'Debit')
        .reduce((sum, a) => sum + a.balance, 0);

    const totalCredits = accountBalances
        .filter(a => a.balanceType === 'Credit')
        .reduce((sum, a) => sum + a.balance, 0);

    const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-lg border border-gray-200 min-h-[800px] p-12 relative">
            {/* Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-widest mb-2">Trial Balance</h2>
                <p className="text-gray-500 font-mono text-sm">As of {new Date().toLocaleDateString()}</p>
                <div className="w-24 h-1 bg-gray-900 mx-auto mt-6"></div>
            </div>

            {/* Table */}
            <div className="relative">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-900">
                            <th className="text-left py-4 font-bold text-gray-900 uppercase tracking-wider w-1/2">Account Title</th>
                            <th className="text-right py-4 font-bold text-gray-900 uppercase tracking-wider w-1/4">Debit</th>
                            <th className="text-right py-4 font-bold text-gray-900 uppercase tracking-wider w-1/4">Credit</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {accountBalances.map((account) => (
                            <tr key={account.id} className="group hover:bg-gray-50 transition-colors">
                                <td className="py-3 text-gray-700 font-medium group-hover:text-gray-900">{account.name}</td>
                                <td className="py-3 text-right font-mono text-gray-600">
                                    {account.balanceType === 'Debit' ? account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}
                                </td>
                                <td className="py-3 text-right font-mono text-gray-600">
                                    {account.balanceType === 'Credit' ? account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}
                                </td>
                            </tr>
                        ))}
                        {/* Empty rows for paper feel */}
                        {[...Array(5)].map((_, i) => (
                            <tr key={`empty-${i}`} className="h-12">
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2 border-gray-900 border-double">
                            <td className="py-4 font-bold text-gray-900 uppercase tracking-wider">Total</td>
                            <td className="py-4 text-right font-bold font-mono text-gray-900 border-b-4 border-double border-gray-900">
                                ${totalDebits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-4 text-right font-bold font-mono text-gray-900 border-b-4 border-double border-gray-900">
                                ${totalCredits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                        </tr>
                    </tfoot>
                </table>

                {/* Validation Badge */}
                <div className={`absolute -top-20 right-0 px-4 py-2 rounded-full text-sm font-bold border flex items-center gap-2 ${isBalanced
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                    <span className={`w-2 h-2 rounded-full ${isBalanced ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {isBalanced ? 'BALANCED' : `UNBALANCED (${Math.abs(totalDebits - totalCredits).toFixed(2)})`}
                </div>
            </div>

            {/* Footer Note */}
            <div className="absolute bottom-12 left-12 right-12 text-center text-xs text-gray-400 font-mono">
                Generated by Office Ledger Pro • Financial Reporting Module
            </div>
        </div>
    );
};

export default TrialBalance;
