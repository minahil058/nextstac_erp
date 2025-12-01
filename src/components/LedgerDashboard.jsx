import { useState } from 'react';

const LedgerDashboard = ({ onAccountClick, transactions, accounts }) => {
    // Group accounts by type
    const accountGroups = {
        Asset: accounts.filter(a => a.type === 'Asset'),
        Liability: accounts.filter(a => a.type === 'Liability'),
        Equity: accounts.filter(a => a.type === 'Equity'),
        Revenue: accounts.filter(a => a.type === 'Revenue'),
        Expense: accounts.filter(a => a.type === 'Expense'),
    };

    const getGroupColor = (type) => {
        switch (type) {
            case 'Asset': return 'from-blue-500 to-blue-600 shadow-blue-500/30';
            case 'Liability': return 'from-red-500 to-red-600 shadow-red-500/30';
            case 'Equity': return 'from-purple-500 to-purple-600 shadow-purple-500/30';
            case 'Revenue': return 'from-emerald-500 to-emerald-600 shadow-emerald-500/30';
            case 'Expense': return 'from-orange-500 to-orange-600 shadow-orange-500/30';
            default: return 'from-gray-500 to-gray-600 shadow-gray-500/30';
        }
    };

    return (
        <div className="space-y-10">
            {Object.entries(accountGroups).map(([type, groupAccounts]) => (
                groupAccounts.length > 0 && (
                    <div key={type} className="space-y-4">
                        <div className="flex items-center gap-3 px-1">
                            <div className={`w-3 h-8 rounded-full bg-gradient-to-b ${getGroupColor(type).split(' ')[0]} ${getGroupColor(type).split(' ')[1]}`}></div>
                            <h3 className="text-xl font-bold text-primary-900 tracking-tight">
                                {type} Accounts
                            </h3>
                            <span className="bg-primary-100 text-primary-600 px-2.5 py-0.5 rounded-full text-xs font-bold border border-primary-200">
                                {groupAccounts.length}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {groupAccounts.map(account => (
                                <button
                                    key={account.id}
                                    onClick={() => onAccountClick(account)}
                                    className="group relative flex flex-col items-start p-6 rounded-2xl border border-primary-100 bg-white hover:border-transparent hover:shadow-xl transition-all duration-300 text-left w-full overflow-hidden"
                                >
                                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getGroupColor(type).split(' ')[0]} ${getGroupColor(type).split(' ')[1]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                    <div className="w-full flex justify-between items-start mb-4">
                                        <div className={`p-2 rounded-lg bg-primary-50 text-primary-400 group-hover:bg-white group-hover:text-accent-600 transition-colors duration-300`}>
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary-400 group-hover:text-accent-500 transition-colors">
                                            {account.normal_balance || account.normalBalance}
                                        </span>
                                    </div>

                                    <h4 className="text-lg font-bold text-primary-900 group-hover:text-accent-600 transition-colors mb-1">
                                        {account.name}
                                    </h4>

                                    <p className="text-xs text-primary-400 font-medium mb-6">
                                        ID: <span className="font-mono text-primary-500">#{account.id.toString().slice(0, 8)}</span>
                                    </p>

                                    <div className="mt-auto w-full flex items-center justify-between text-xs font-semibold text-primary-400 group-hover:text-accent-500 transition-colors pt-4 border-t border-primary-50 group-hover:border-primary-100">
                                        <span>View Ledger</span>
                                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )
            ))}
        </div>
    );
};

export default LedgerDashboard;
