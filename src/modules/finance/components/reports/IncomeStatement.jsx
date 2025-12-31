import React from 'react';
import { calculateAccountBalance } from '../../../../utils/accountingCalculations';

const IncomeStatement = ({ transactions, accounts }) => {

    const getRevenueBalance = (account) => {
        const { creditTotal, debitTotal } = calculateAccountBalance(account, transactions);
        return creditTotal - debitTotal;
    };

    const getExpenseBalance = (account) => {
        const { debitTotal, creditTotal } = calculateAccountBalance(account, transactions);
        return debitTotal - creditTotal;
    };

    // Revenue accounts
    const revenueAccounts = accounts.filter(a => a.type === 'Revenue');
    const totalRevenue = revenueAccounts.reduce((sum, account) => sum + getRevenueBalance(account), 0);

    // COGS
    const cogsAccounts = accounts.filter(a => a.name === 'Cost of Goods Sold');
    const cogsTotal = cogsAccounts.reduce((sum, account) => sum + getExpenseBalance(account), 0);

    // Gross Profit
    const grossProfit = totalRevenue - cogsTotal;

    // Operating Expenses
    const operatingExpenseAccounts = accounts.filter(a =>
        a.type === 'Expense' && a.name !== 'Cost of Goods Sold'
    );
    const operatingExpensesTotal = operatingExpenseAccounts.reduce((sum, account) => sum + getExpenseBalance(account), 0);

    // Net Profit
    const netProfit = grossProfit - operatingExpensesTotal;

    const formatCurrency = (amount) => {
        return amount.toLocaleString('en-US', { minimumFractionDigits: 2 });
    };

    return (
        <div className="max-w-5xl mx-auto bg-slate-800/50 backdrop-blur-xl shadow-sm border border-slate-700/50 rounded-xl overflow-hidden print:bg-white print:border-slate-200 print:shadow-none">
            <div className="p-8 border-b border-slate-700/50 bg-slate-900/50 text-center print:bg-slate-50 print:border-slate-100">
                <h2 className="text-2xl font-bold text-white print:text-slate-900 uppercase tracking-widest mb-2">Income Statement</h2>
                <p className="text-slate-400 print:text-slate-500 font-mono text-sm">For the Period Ended {new Date().toLocaleDateString()}</p>
            </div>

            <div className="p-8 space-y-8 font-mono text-slate-300 print:text-slate-800">

                {/* Revenue Section */}
                <div>
                    <h3 className="font-bold text-white print:text-slate-900 uppercase mb-4 border-b border-slate-700/50 print:border-slate-200 pb-2">Revenue</h3>
                    {revenueAccounts.map(account => {
                        const balance = getRevenueBalance(account);
                        if (balance === 0) return null;
                        return (
                            <div key={account.id} className="flex justify-between py-2 hover:bg-slate-700/30 print:hover:bg-slate-50 pl-4 rounded transition-colors">
                                <span>{account.name}</span>
                                <span className="text-emerald-400 print:text-emerald-700 font-medium">{formatCurrency(balance)}</span>
                            </div>
                        );
                    })}
                    <div className="flex justify-between py-2 font-bold border-t border-white print:border-slate-900 mt-2 text-white print:text-slate-900">
                        <span>Total Revenue</span>
                        <span className="text-emerald-400 print:text-emerald-700">${formatCurrency(totalRevenue)}</span>
                    </div>
                </div>

                {/* COGS */}
                {cogsAccounts.length > 0 && (
                    <div>
                        <h3 className="font-bold text-white print:text-slate-900 uppercase mb-4 border-b border-slate-700/50 print:border-slate-200 pb-2">Cost of Sales</h3>
                        {cogsAccounts.map(account => {
                            const balance = getExpenseBalance(account);
                            if (balance === 0) return null;
                            return (
                                <div key={account.id} className="flex justify-between py-2 hover:bg-slate-700/30 print:hover:bg-slate-50 pl-4 rounded transition-colors">
                                    <span>{account.name}</span>
                                    <span className="text-rose-400 print:text-red-600">({formatCurrency(balance)})</span>
                                </div>
                            );
                        })}
                        <div className="flex justify-between py-2 font-bold border-t border-white print:border-slate-900 mt-2 text-white print:text-slate-900">
                            <span>Total Cost of Goods Sold</span>
                            <span className="text-rose-400 print:text-red-600">({formatCurrency(cogsTotal)})</span>
                        </div>
                    </div>
                )}

                {/* Gross Profit */}
                <div className="flex justify-between py-4 font-bold text-lg bg-slate-900/50 print:bg-slate-50 px-4 border-y-2 border-slate-700/50 print:border-slate-200 rounded-lg text-white print:text-slate-900">
                    <span>Gross Profit</span>
                    <span className={grossProfit >= 0 ? 'text-emerald-400 print:text-emerald-700' : 'text-rose-400 print:text-red-700'}>
                        ${formatCurrency(grossProfit)}
                    </span>
                </div>

                {/* Operating Expenses */}
                <div>
                    <h3 className="font-bold text-white print:text-slate-900 uppercase mb-4 border-b border-slate-700/50 print:border-slate-200 pb-2">Operating Expenses</h3>
                    {operatingExpenseAccounts.map(account => {
                        const balance = getExpenseBalance(account);
                        if (balance === 0) return null;
                        return (
                            <div key={account.id} className="flex justify-between py-2 hover:bg-slate-700/30 print:hover:bg-slate-50 pl-4 rounded transition-colors">
                                <span>{account.name}</span>
                                <span className="text-rose-400 print:text-red-600">({formatCurrency(balance)})</span>
                            </div>
                        );
                    })}
                    <div className="flex justify-between py-2 font-bold border-t border-white print:border-slate-900 mt-2 text-white print:text-slate-900">
                        <span>Total Operating Expenses</span>
                        <span className="text-rose-400 print:text-red-600">({formatCurrency(operatingExpensesTotal)})</span>
                    </div>
                </div>

                {/* Net Profit/Loss */}
                <div className="mt-8">
                    <div className={`flex justify-between items-center p-6 border-4 border-double rounded-xl ${netProfit >= 0 ? 'border-emerald-500/20 bg-emerald-500/10 print:bg-emerald-50 print:border-emerald-200' : 'border-rose-500/20 bg-rose-500/10 print:bg-red-50 print:border-red-200'}`}>
                        <span className="text-xl font-bold uppercase tracking-widest text-white print:text-slate-900">
                            {netProfit >= 0 ? 'Net Profit' : 'Net Loss'}
                        </span>
                        <span className={`text-2xl font-bold font-mono ${netProfit >= 0 ? 'text-emerald-400 print:text-emerald-700' : 'text-rose-400 print:text-red-700'}`}>
                            ${formatCurrency(Math.abs(netProfit))}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncomeStatement;
