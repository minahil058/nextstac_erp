import React, { useMemo } from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Wallet, PiggyBank, Sparkles } from 'lucide-react';
import { calculateAccountBalance } from '../../../utils/accountingCalculations';
import { FloatingOrbs, AnimatedGrid } from '../../../components/shared/BackgroundEffects';
import { StatCard, PremiumCard } from '../../../components/shared/PremiumComponents';

const HomeDashboard = ({ accounts, transactions, loading }) => {
    // Calculate Financial Data
    const financialData = useMemo(() => {
        if (loading || !accounts || accounts.length === 0) return null;

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

        const monthlyData = {};

        transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { month: monthKey, revenue: 0, expenses: 0 };
            }

            const debitAccountId = transaction.debit_account_id || transaction.debitAccount?.id;
            const creditAccountId = transaction.credit_account_id || transaction.creditAccount?.id;

            const debitAccount = accounts?.find(a => a.id === debitAccountId);
            const creditAccount = accounts?.find(a => a.id === creditAccountId);

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

    // Chart Data: Expense Breakdown
    const expenseBreakdownData = useMemo(() => {
        if (!accounts || !transactions) return [];

        const expenseAccounts = accounts.filter(a => a.type === 'Expense');
        const expenseTotals = expenseAccounts.map(account => {
            const { balanceAmount } = calculateAccountBalance(account, transactions);
            return {
                name: account.name,
                value: Math.round(balanceAmount)
            };
        }).filter(item => item.value > 0);

        return expenseTotals.sort((a, b) => b.value - a.value).slice(0, 5);
    }, [accounts, transactions]);

    const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!financialData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-400 text-lg">No financial data available</p>
                    <p className="text-slate-500 text-sm mt-2">Add accounts and transactions to see your dashboard</p>
                </div>
            </div>
        );
    }

    const { totalAssets, totalLiabilities, totalEquity, totalRevenue, totalExpenses, netProfit, isBalanced } = financialData;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <div className="relative min-h-screen">
            <FloatingOrbs count={12} />
            <AnimatedGrid />

            <motion.div
                className="relative z-10 space-y-8 p-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header with Balance Badge */}
                <motion.div variants={itemVariants} className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                            <Sparkles className="w-8 h-8 text-indigo-400" />
                            Financial Overview
                        </h1>
                        <p className="text-slate-400">Real-time accounting insights at your fingertips</p>
                    </div>
                    {isBalanced && (
                        <motion.div
                            className="bg-emerald-500/20 backdrop-blur-xl text-emerald-300 px-6 py-3 rounded-2xl font-bold border border-emerald-500/30 flex items-center gap-2"
                            initial={scale: 0}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.5 }}
                        >
                    <span>⚖️</span>
                    Equation Balanced
                </motion.div>
                    )}
            </motion.div>

            {/* Accounting Equation Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={Wallet}
                    label="Total Assets"
                    value={`$${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    trend={15}
                    color="emerald"
                />
                <StatCard
                    icon={DollarSign}
                    label="Total Liabilities"
                    value={`$${totalLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    trend={-5}
                    color="pink"
                />
                <StatCard
                    icon={PiggyBank}
                    label="Owner's Equity"
                    value={`$${totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    trend={12}
                    color="indigo"
                />
            </motion.div>

            {/* Performance Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Revenue', value: totalRevenue, icon: TrendingUp, color: 'emerald' },
                    { label: 'Total Expenses', value: totalExpenses, icon: TrendingDown, color: 'amber' },
                    { label: 'Net Profit', value: netProfit, icon: netProfit >= 0 ? TrendingUp : TrendingDown, color: netProfit >= 0 ? 'blue' : 'pink' },
                    { label: 'Profit Margin', value: `${totalRevenue ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0}%`, icon: DollarSign, color: 'purple' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                    >
                        <PremiumCard className="p-6">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-bold text-slate-400">{stat.label}</p>
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-${stat.color}-500/20 to-${stat.color}-500/5 flex items-center justify-center`}>
                                    <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                                </div>
                            </div>
                            <p className="text-2xl font-black text-white">
                                {typeof stat.value === 'number'
                                    ? `$${stat.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                                    : stat.value
                                }
                            </p>
                        </PremiumCard>
                    </motion.div>
                ))}
            </motion.div>

            {/* Charts Section */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue vs Expenses Trend */}
                <PremiumCard className="p-6">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-400" />
                        Revenue & Expenses Trend
                    </h3>
                    {trendChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={trendChartData}>
                                <defs>
                                    <linearGradient id="colorRevenueDark" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpensesDark" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                                <YAxis stroke="#94A3B8" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1E293B',
                                        border: '1px solid #334155',
                                        borderRadius: '12px',
                                        color: '#F1F5F9'
                                    }}
                                />
                                <Legend />
                                <Area type="monotone" dataKey="Revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenueDark)" />
                                <Area type="monotone" dataKey="Expenses" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorExpensesDark)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-72 flex items-center justify-center text-slate-500">
                            No transaction data available
                        </div>
                    )}
                </PremiumCard>

                {/* Expense Breakdown */}
                <PremiumCard className="p-6">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <PiggyBank className="w-5 h-5 text-purple-400" />
                        Top Expense Categories
                    </h3>
                    {expenseBreakdownData.length > 0 ? (
                        <div className="flex items-center justify-between">
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
                                            backgroundColor: '#1E293B',
                                            border: '1px solid #334155',
                                            borderRadius: '12px',
                                            color: '#F1F5F9'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-3 flex-1">
                                {expenseBreakdownData.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                                            <span className="text-sm text-slate-300 font-medium">{item.name}</span>
                                        </div>
                                        <span className="text-sm font-bold text-white">
                                            ${item.value.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-72 flex items-center justify-center text-slate-500">
                            No expense data available
                        </div>
                    )}
                </PremiumCard>
            </motion.div>
        </motion.div>
        </div >
    );
};

export default HomeDashboard;
