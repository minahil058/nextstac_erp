import React, { useMemo } from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { calculateAccountBalance } from '../utils/accountingCalculations';

const HomeDashboard = ({ accounts, transactions, loading }) => {
    // Calculate Financial Data
    const financialData = useMemo(() => {
        if (loading || accounts.length === 0) return null;

        // Helper to get total balance for a group of accounts
        const getGroupTotal = (type) => {
            return accounts
                .filter(a => a.type === type)
                .reduce((sum, account) => {
                    const { balanceAmount } = calculateAccountBalance(account, transactions);
                    return sum + balanceAmount;
                }, 0);
        };

        const totalAssets = getGroupTotal('Asset');
        const totalLiabilities = getGroupTotal('Liability');
        const totalRevenue = getGroupTotal('Revenue');
        const totalExpenses = getGroupTotal('Expense');

        const getSignedBalance = (account) => {
            const { debitTotal, creditTotal } = calculateAccountBalance(account, transactions);
            if (account.type === 'Asset' || account.type === 'Expense') {
                return debitTotal - creditTotal;
            } else {
                return creditTotal - debitTotal;
            }
        };

        const totalEquityAccounts = accounts
            .filter(a => a.type === 'Equity')
            .reduce((sum, account) => sum + getSignedBalance(account), 0);

        const netProfit = totalRevenue - totalExpenses;
        const totalEquity = totalEquityAccounts + netProfit;

        const isBalanced = Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01;

        return {
            totalAssets,
            totalLiabilities,
            totalEquity,
            totalRevenue,
            totalExpenses,
            netProfit,
            isBalanced
        };
    }, [accounts, transactions, loading]);

    // Chart Data: Revenue vs Expenses Over Time
    const trendChartData = useMemo(() => {
        if (!transactions || transactions.length === 0) return [];

        // Group transactions by month
        const monthlyData = {};

        transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { month: monthKey, revenue: 0, expenses: 0 };
            }

            // Get account types
            const debitAccount = accounts.find(a => a.id === (transaction.debit_account_id || transaction.debitAccount?.id));
            const creditAccount = accounts.find(a => a.id === (transaction.credit_account_id || transaction.creditAccount?.id));

            const amount = parseFloat(transaction.amount);

            if (debitAccount?.type === 'Expense') {
                monthlyData[monthKey].expenses += amount;
            }
            if (creditAccount?.type === 'Revenue') {
                monthlyData[monthKey].revenue += amount;
            }
        });

        return Object.values(monthlyData)
            .sort((a, b) => a.month.localeCompare(b.month))
            .map(item => ({
                month: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                Revenue: Math.round(item.revenue),
                Expenses: Math.round(item.expenses)
            }));
    }, [transactions, accounts]);

    // Chart Data: Expense Breakdown by Account
    const expenseBreakdownData = useMemo(() => {
        if (!accounts || !transactions) return [];

        const expenseAccounts = accounts.filter(a => a.type === 'Expense');

        return expenseAccounts
            .map(account => {
                const { debitTotal, creditTotal } = calculateAccountBalance(account, transactions);
                const balance = debitTotal - creditTotal;
                return {
                    name: account.name,
                    value: Math.round(balance)
                };
            })
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value)
            .slice(0, 5); // Top 5 expenses
    }, [accounts, transactions]);

    // Recent Transactions
    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    // Chart Colors
    const COLORS = ['#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16'];

    // Skeleton Loader
    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                {/* Top Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-40 bg-gray-200 rounded-2xl"></div>
                    ))}
                </div>
                {/* Charts Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-80 bg-gray-200 rounded-2xl"></div>
                    <div className="h-80 bg-gray-200 rounded-2xl"></div>
                </div>
                {/* Performance Section Skeleton */}
                <div className="h-48 bg-gray-200 rounded-2xl"></div>
                {/* Bottom Section Skeleton */}
                <div className="h-80 bg-gray-200 rounded-2xl"></div>
            </div>
        );
    }

    if (!financialData) return null;

    const { totalAssets, totalLiabilities, totalEquity, totalRevenue, totalExpenses, netProfit, isBalanced } = financialData;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* 1. Accounting Equation Cards */}
            <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Assets */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl shadow-primary-900/5 border border-primary-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-24 h-24 text-success-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" /></svg>
                        </div>
                        <h3 className="text-primary-500 text-sm font-bold uppercase tracking-wider mb-2">Total Assets</h3>
                        <p className="text-3xl font-bold text-primary-900">
                            ${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                        <div className="mt-4 flex items-center text-success-600 text-sm font-medium">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            <span>Asset Value</span>
                        </div>
                    </div>

                    {/* Liabilities */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl shadow-primary-900/5 border border-primary-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-24 h-24 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
                        </div>
                        <h3 className="text-primary-500 text-sm font-bold uppercase tracking-wider mb-2">Total Liabilities</h3>
                        <p className="text-3xl font-bold text-primary-900">
                            ${totalLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                        <div className="mt-4 flex items-center text-red-500 text-sm font-medium">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                            <span>Outstanding Debt</span>
                        </div>
                    </div>

                    {/* Equity */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl shadow-primary-900/5 border border-primary-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-24 h-24 text-accent-500" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
                        </div>
                        <h3 className="text-primary-500 text-sm font-bold uppercase tracking-wider mb-2">Owner's Equity</h3>
                        <p className="text-3xl font-bold text-primary-900">
                            ${totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                        <div className="mt-4 flex items-center text-accent-600 text-sm font-medium">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>Net Value</span>
                        </div>
                    </div>
                </div>

                {/* Balance Badge */}
                {isBalanced && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-success-50 text-success-700 px-4 py-1 rounded-full text-xs font-bold border border-success-200 shadow-sm flex items-center gap-1 animate-bounce">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        Equation Balanced
                    </div>
                )}
            </div>

            {/* 2. Financial Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue vs Expenses Trend */}
                <div className="bg-white rounded-2xl shadow-xl shadow-primary-900/5 border border-primary-100 p-6">
                    <h3 className="text-lg font-bold text-primary-900 mb-6 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-success-500 rounded-full"></span>
                        Revenue & Expense Trend
                    </h3>
                    {trendChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={trendChartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                                <YAxis stroke="#64748B" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #E2E8F0',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Legend />
                                <Area type="monotone" dataKey="Revenue" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                                <Area type="monotone" dataKey="Expenses" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-72 flex items-center justify-center text-primary-400">
                            No transaction data available
                        </div>
                    )}
                </div>

                {/* Expense Breakdown */}
                <div className="bg-white rounded-2xl shadow-xl shadow-primary-900/5 border border-primary-100 p-6">
                    <h3 className="text-lg font-bold text-primary-900 mb-6 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-red-500 rounded-full"></span>
                        Top Expense Categories
                    </h3>
                    {expenseBreakdownData.length > 0 ? (
                        <div className="flex items-center justify-between gap-8">
                            <ResponsiveContainer width="50%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={expenseBreakdownData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {expenseBreakdownData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #E2E8F0',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex-1 space-y-3">
                                {expenseBreakdownData.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                            <span className="text-sm text-primary-600 font-medium truncate">{item.name}</span>
                                        </div>
                                        <span className="text-sm font-bold text-primary-900">${item.value.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-72 flex items-center justify-center text-primary-400">
                            No expense data available
                        </div>
                    )}
                </div>
            </div>

            {/* 3. Performance Overview */}
            <div className="bg-white rounded-2xl shadow-xl shadow-primary-900/5 border border-primary-100 p-8">
                <h3 className="text-lg font-bold text-primary-900 mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-accent-500 rounded-full"></span>
                    Performance Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-primary-500 uppercase tracking-wider">Total Revenue</p>
                        <p className="text-2xl font-bold text-success-600">
                            +${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-primary-500 uppercase tracking-wider">Total Expenses</p>
                        <p className="text-2xl font-bold text-red-500">
                            -${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="bg-primary-50 p-6 rounded-xl border border-primary-100 text-center">
                        <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-2">Net Profit</p>
                        <p className={`text-4xl font-black ${netProfit >= 0 ? 'text-success-600' : 'text-red-600'}`}>
                            {netProfit >= 0 ? '+' : '-'}${Math.abs(netProfit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>
            </div>

            {/* 4. Recent Activity Feed */}
            <div className="bg-white rounded-2xl shadow-xl shadow-primary-900/5 border border-primary-100 overflow-hidden">
                <div className="p-6 border-b border-primary-50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-primary-900 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-primary-900 rounded-full"></span>
                        Recent Journal Entries
                    </h3>
                    <button className="text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors">
                        View All
                    </button>
                </div>
                <div className="divide-y divide-primary-50">
                    {recentTransactions.map(transaction => (
                        <div key={transaction.id} className="p-4 hover:bg-primary-50/50 transition-colors flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs">
                                    {new Date(transaction.date).getDate()}
                                </div>
                                <div>
                                    <p className="font-bold text-primary-900 group-hover:text-accent-600 transition-colors">{transaction.description}</p>
                                    <p className="text-xs text-primary-500">
                                        {transaction.debit_account?.name || transaction.debitAccount?.name}
                                        <span className="mx-1 text-primary-300">→</span>
                                        {transaction.credit_account?.name || transaction.creditAccount?.name}
                                    </p>
                                </div>
                            </div>
                            <span className="font-mono font-bold text-primary-900">
                                ${parseFloat(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    ))}
                    {recentTransactions.length === 0 && (
                        <div className="p-8 text-center text-primary-400">No recent transactions</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomeDashboard;
