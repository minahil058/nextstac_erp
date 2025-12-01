import { useState } from 'react';

const TAccountView = ({ account, transactions, onClose }) => {
    // Filter transactions for this account
    const accountTransactions = transactions.filter(t =>
        t.debit_account_id === account.id || t.credit_account_id === account.id
    ).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate running balance
    let runningBalance = 0;
    const transactionsWithBalance = accountTransactions.map(t => {
        const isDebit = t.debit_account_id === account.id;
        const amount = parseFloat(t.amount);

        // For Asset and Expense: Debit increases, Credit decreases
        // For Liability, Equity, Revenue: Credit increases, Debit decreases
        // Standard T-Account logic: Left is Debit, Right is Credit.
        // We just need to track the net balance based on normal balance type.

        if (account.normal_balance === 'Debit' || account.normalBalance === 'Debit') {
            runningBalance += isDebit ? amount : -amount;
        } else {
            runningBalance += isDebit ? -amount : amount;
        }

        return { ...t, isDebit, runningBalance };
    });

    const totalDebits = accountTransactions
        .filter(t => t.debit_account_id === account.id)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalCredits = accountTransactions
        .filter(t => t.credit_account_id === account.id)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const endingBalance = Math.abs(totalDebits - totalCredits);
    const balanceSide = totalDebits > totalCredits ? 'Debit' : 'Credit';

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{account.name}</h2>
                    <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">
                        {account.type} • {account.normal_balance || account.normalBalance} Balance
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* T-Account Visual */}
            <div className="p-6">
                <div className="flex justify-center mb-6">
                    <div className="w-full max-w-3xl">
                        {/* T-Shape Header */}
                        <div className="flex border-b-4 border-gray-800 pb-2 mb-4">
                            <div className="w-1/2 text-center font-bold text-lg uppercase tracking-widest border-r-4 border-gray-800">Debit</div>
                            <div className="w-1/2 text-center font-bold text-lg uppercase tracking-widest">Credit</div>
                        </div>

                        {/* Transactions List */}
                        <div className="flex relative min-h-[300px]">
                            {/* Vertical Line */}
                            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-800 transform -translate-x-1/2"></div>

                            {/* Debits Column */}
                            <div className="w-1/2 pr-4 space-y-2">
                                {transactionsWithBalance.filter(t => t.isDebit).map(t => (
                                    <div key={t.id} className="flex justify-between text-sm group hover:bg-blue-50 p-1 rounded">
                                        <span className="text-gray-500">{new Date(t.date).toLocaleDateString()}</span>
                                        <span className="text-gray-600 truncate max-w-[120px]" title={t.description}>{t.description}</span>
                                        <span className="font-mono font-medium text-gray-900">{parseFloat(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Credits Column */}
                            <div className="w-1/2 pl-4 space-y-2">
                                {transactionsWithBalance.filter(t => !t.isDebit).map(t => (
                                    <div key={t.id} className="flex justify-between text-sm group hover:bg-red-50 p-1 rounded">
                                        <span className="font-mono font-medium text-gray-900">{parseFloat(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                        <span className="text-gray-600 truncate max-w-[120px]" title={t.description}>{t.description}</span>
                                        <span className="text-gray-500">{new Date(t.date).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totals Footer */}
                        <div className="flex border-t-4 border-gray-800 pt-2 mt-4">
                            <div className="w-1/2 pr-4 text-right">
                                <span className="font-mono font-bold text-gray-900 text-lg">
                                    {totalDebits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="w-1/2 pl-4 text-left">
                                <span className="font-mono font-bold text-gray-900 text-lg">
                                    {totalCredits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>

                        {/* Ending Balance */}
                        <div className="flex justify-center mt-6">
                            <div className={`
                px-6 py-2 rounded-full font-bold text-lg border-2 shadow-sm
                ${balanceSide === (account.normal_balance || account.normalBalance)
                                    ? 'bg-green-50 text-green-800 border-green-200'
                                    : 'bg-yellow-50 text-yellow-800 border-yellow-200'}
              `}>
                                Ending Balance: {endingBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} ({balanceSide})
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TAccountView;
