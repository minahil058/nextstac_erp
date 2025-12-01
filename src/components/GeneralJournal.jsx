const GeneralJournal = ({ transactions }) => {
    // Sort transactions by date descending
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculate statistics
    const totalAmount = sortedTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const transactionCount = sortedTransactions.length;

    return (
        <div className="space-y-6">
            {/* Header Section with Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-6 text-black shadow-lg shadow-accent-500/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-black/90 text-sm font-bold uppercase tracking-wider mb-1">Total Entries</p>
                            <p className="text-4xl font-black text-black">{transactionCount}</p>
                        </div>
                        <div className="w-14 h-14 bg-black/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-success-500 to-success-600 rounded-2xl p-6 text-black shadow-lg shadow-success-500/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-black/90 text-sm font-bold uppercase tracking-wider mb-1">Total Value</p>
                            <p className="text-4xl font-black text-black">${(totalAmount / 1000).toFixed(1)}k</p>
                        </div>
                        <div className="w-14 h-14 bg-black/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 text-black shadow-lg shadow-primary-500/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-black/90 text-sm font-bold uppercase tracking-wider mb-1">Latest Entry</p>
                            <p className="text-2xl font-black text-black">
                                {sortedTransactions.length > 0
                                    ? new Date(sortedTransactions[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                    : 'N/A'}
                            </p>
                        </div>
                        <div className="w-14 h-14 bg-black/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Journal Table */}
            <div className="bg-white rounded-2xl shadow-xl shadow-primary-900/5 border border-primary-100 overflow-hidden">
                <div className="p-6 border-b border-primary-100 bg-gradient-to-r from-primary-50 to-white">
                    <h3 className="text-lg font-bold text-primary-900 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-accent-500 rounded-full"></span>
                        General Journal
                    </h3>
                    <p className="text-xs text-primary-500 mt-1">Double-entry bookkeeping records</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-primary-50/80 border-b border-primary-100">
                            <tr>
                                <th scope="col" className="px-8 py-4 text-xs font-bold text-primary-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-8 py-4 text-xs font-bold text-primary-500 uppercase tracking-wider">Description</th>
                                <th scope="col" className="px-8 py-4 text-xs font-bold text-primary-500 uppercase tracking-wider">Account</th>
                                <th scope="col" className="px-8 py-4 text-xs font-bold text-primary-500 uppercase tracking-wider text-right">Debit</th>
                                <th scope="col" className="px-8 py-4 text-xs font-bold text-primary-500 uppercase tracking-wider text-right">Credit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary-50">
                            {sortedTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                                                <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <p className="text-primary-400 font-medium">No journal entries recorded yet.</p>
                                            <p className="text-xs text-primary-300">Start adding transactions to see them here</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                sortedTransactions.flatMap((transaction, index) => [
                                    // Debit Entry Row
                                    <tr key={`${transaction.id}-debit`} className={`group transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-primary-50/30'} hover:bg-primary-50`}>
                                        <td className="px-8 py-3 font-medium text-primary-900 blackspace-nowrap border-l-4 border-transparent group-hover:border-accent-500 transition-all">
                                            {new Date(transaction.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-8 py-3 text-primary-700 font-medium">
                                            {transaction.description}
                                        </td>
                                        <td className="px-8 py-3 font-semibold text-primary-900">
                                            {transaction.debit_account?.name || transaction.debitAccount?.name}
                                        </td>
                                        <td className="px-8 py-3 text-right font-mono font-bold text-primary-900">
                                            {parseFloat(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-8 py-3 text-right font-mono text-primary-300">
                                            -
                                        </td>
                                    </tr>,
                                    // Credit Entry Row
                                    <tr key={`${transaction.id}-credit`} className={`transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-primary-50/30'} hover:bg-primary-50`}>
                                        <td className="px-8 py-3 border-none"></td>
                                        <td className="px-8 py-3 border-none"></td>
                                        <td className="px-8 py-3 pl-16 text-primary-600 flex items-center gap-2">
                                            <span className="w-4 h-px bg-primary-300"></span>
                                            {transaction.credit_account?.name || transaction.creditAccount?.name}
                                        </td>
                                        <td className="px-8 py-3 text-right font-mono text-primary-300 border-none">
                                            -
                                        </td>
                                        <td className="px-8 py-3 text-right font-mono font-bold text-primary-900 border-none">
                                            {parseFloat(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ])
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GeneralJournal;
