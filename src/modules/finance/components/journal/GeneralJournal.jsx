import React from 'react';

const GeneralJournal = ({ transactions }) => {
    // Sort transactions by date descending
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/50 overflow-hidden">
            <div className="p-6 border-b border-slate-700/50 bg-slate-900/30">
                <h3 className="text-xl font-black text-white tracking-tight">General Journal</h3>
                <p className="text-slate-400 text-xs mt-1 font-medium">Double-entry bookkeeping records</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-900/50 border-b border-slate-700/50 text-slate-400">
                        <tr>
                            <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest w-32">Date</th>
                            <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest w-1/3">Description</th>
                            <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">Account</th>
                            <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-right w-32">Debit</th>
                            <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-right w-32">Credit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTransactions.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-16 text-center text-slate-500 font-medium">
                                    No entries found.
                                </td>
                            </tr>
                        ) : (
                            sortedTransactions.map((transaction, index) => (
                                <React.Fragment key={transaction.id}>
                                    {/* Debit Row */}
                                    <tr className="group hover:bg-slate-700/20 transition-colors border-t border-slate-700/30">
                                        <td className="px-6 py-3 text-slate-300 font-medium font-mono text-xs pt-5">
                                            {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-3 text-slate-200 font-medium pt-5">
                                            {transaction.description}
                                        </td>
                                        <td className="px-6 py-3 text-white font-bold pt-5">
                                            {transaction.debit_account?.name || transaction.debitAccount?.name}
                                        </td>
                                        <td className="px-6 py-3 text-right font-bold text-emerald-400 font-mono pt-5">
                                            {parseFloat(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-3 text-right text-slate-600 pt-5">
                                            -
                                        </td>
                                    </tr>
                                    {/* Credit Row */}
                                    <tr className="group hover:bg-slate-700/20 transition-colors border-b border-slate-700/50 last:border-0">
                                        <td className="px-6 py-2"></td>
                                        <td className="px-6 py-2"></td>
                                        <td className="px-6 py-2 pb-5 text-slate-400 pl-16 flex items-center gap-2">
                                            <div className="w-4 h-px bg-slate-600"></div>
                                            {transaction.credit_account?.name || transaction.creditAccount?.name}
                                        </td>
                                        <td className="px-6 py-2 pb-5 text-right text-slate-600">
                                            -
                                        </td>
                                        <td className="px-6 py-2 pb-5 text-right font-bold text-rose-400 font-mono">
                                            {parseFloat(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GeneralJournal;
