import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import {
    DollarSign,
    ShoppingCart,
    Package,
    Users,
    TrendingUp,
    TrendingDown,
    Activity,
    Clock,
    AlertCircle,
    Upload,
    Sparkles,
    Zap
} from 'lucide-react';
import { FloatingOrbs, AnimatedGrid } from '../../../components/shared/BackgroundEffects';
import { PremiumCard, PremiumButton, StatCard } from '../../../components/shared/PremiumComponents';
import { api } from '../../../lib/api';

const DashboardHome = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const fileInputRef = useRef(null);

    const { data: transactions = [] } = useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            try {
                return await api.get('/finance/transactions');
            } catch (e) {
                console.error('Failed to fetch transactions:', e);
                return [];
            }
        },
    });

    const { data: employees = [] } = useQuery({
        queryKey: ['employees'],
        queryFn: async () => {
            try {
                return await api.get('/hr/employees');
            } catch (e) {
                console.error('Failed to fetch employees:', e);
                return [];
            }
        }
    });

    const { data: products = [] } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            try {
                return await api.get('/inventory/products');
            } catch (e) {
                console.error('Failed to fetch products:', e);
                return [];
            }
        }
    });

    const { data: orders = [] } = useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            try {
                return await api.get('/sales/orders');
            } catch (e) {
                console.error('Failed to fetch orders:', e);
                return [];
            }
        }
    });

    const totalRevenue = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const activeOrders = orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length;
    const lowStockCount = products.filter(p => (p.stock || 0) <= (p.minStock || 10)).length;
    const totalEmployees = employees.length;

    const uploadMutation = useMutation({
        mutationFn: async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch(`${baseUrl}/finance/upload`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('Upload failed');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['transactions']);
            alert('Data imported successfully!');
        },
        onError: (err) => {
            alert('Failed to import: ' + err.message);
        }
    });

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            uploadMutation.mutate(file);
        }
    };

    const processChartData = () => {
        if (!transactions.length) return [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dataMap = new Map();

        transactions.forEach(t => {
            const date = new Date(t.date);
            if (!isNaN(date)) {
                const monthName = months[date.getMonth()];
                if (!dataMap.has(monthName)) {
                    dataMap.set(monthName, { name: monthName, revenue: 0, expenses: 0, order: date.getMonth() });
                }
                const amount = Number(t.amount) || 0;
                if (amount >= 0) {
                    dataMap.get(monthName).revenue += amount;
                } else {
                    dataMap.get(monthName).expenses += Math.abs(amount);
                }
            }
        });

        return Array.from(dataMap.values()).sort((a, b) => a.order - b.order);
    };

    const revenueData = processChartData();

    const mockActivities = [
        { id: 1, user: "Sarah Wilson", action: "created new order", target: "#ORD-2024-001", time: "2 mins ago", type: "order" },
        { id: 2, user: "Mike Brown", action: "updated stock for", target: "Wireless Headphones", time: "15 mins ago", type: "inventory" },
        { id: 3, user: "System", action: "generated report", target: "Finance_Report.pdf", time: "1 hour ago", type: "system" },
        { id: 4, user: "Jane Doe", action: "approved leave request", target: "John Smith", time: "3 hours ago", type: "hr" },
    ];

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
                className="relative z-10 p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                            <Sparkles className="w-8 h-8 text-indigo-400" />
                            Dashboard
                        </h1>
                        <p className="text-slate-400">Welcome back, Admin. Here's what's happening today.</p>
                    </div>
                    <div className="flex gap-3">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".xlsx, .xls"
                            className="hidden"
                        />
                        <PremiumButton
                            variant="secondary"
                            onClick={() => fileInputRef.current.click()}
                            disabled={uploadMutation.isPending}
                        >
                            <Upload className="w-4 h-4" />
                            {uploadMutation.isPending ? 'Importing...' : 'Import Excel'}
                        </PremiumButton>
                        <PremiumButton onClick={() => navigate('/finance/reports')}>
                            <Zap className="w-4 h-4" />
                            Generate Report
                        </PremiumButton>
                    </div>
                </motion.div>

                {/* KPI Cards */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={DollarSign}
                        label="Total Revenue"
                        value={`$${totalRevenue.toLocaleString()}`}
                        trend={12.5}
                        color="emerald"
                    />
                    <StatCard
                        icon={ShoppingCart}
                        label="Active Orders"
                        value={activeOrders.toString()}
                        trend={3.2}
                        color="blue"
                    />
                    <StatCard
                        icon={Package}
                        label="Low Stock Items"
                        value={lowStockCount.toString()}
                        trend={-5}
                        color="amber"
                    />
                    <StatCard
                        icon={Users}
                        label="Total Employees"
                        value={totalEmployees.toString()}
                        trend={0}
                        color="indigo"
                    />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Chart */}
                    <motion.div variants={itemVariants} className="lg:col-span-2">
                        <PremiumCard className="p-6 h-full">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                                    Revenue Analytics
                                </h3>
                            </div>
                            <div className="h-[300px] w-full">
                                {revenueData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={revenueData}>
                                            <defs>
                                                <linearGradient id="colorRevenueDark" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorExpensesDark" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                                            <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
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
                                            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenueDark)" />
                                            <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorExpensesDark)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-500">
                                        No transaction data available
                                    </div>
                                )}
                            </div>
                        </PremiumCard>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div variants={itemVariants}>
                        <PremiumCard className="p-6 h-full">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                                <button
                                    onClick={() => navigate('/audit')}
                                    className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold"
                                >
                                    View All
                                </button>
                            </div>
                            <div className="space-y-6">
                                {mockActivities.map((activity) => (
                                    <div key={activity.id} className="flex gap-4 relative group">
                                        <div className="absolute left-[19px] top-8 bottom-[-24px] w-px bg-slate-700/50 group-last:hidden"></div>

                                        <div className="flex-shrink-0 relative z-10">
                                            <div className="w-10 h-10 rounded-full bg-slate-700/50 backdrop-blur-xl flex items-center justify-center border border-slate-600/50">
                                                {activity.type === 'order' && <ShoppingCart className="w-4 h-4 text-blue-400" />}
                                                {activity.type === 'inventory' && <Package className="w-4 h-4 text-amber-400" />}
                                                {activity.type === 'system' && <Activity className="w-4 h-4 text-slate-400" />}
                                                {activity.type === 'hr' && <Users className="w-4 h-4 text-emerald-400" />}
                                            </div>
                                        </div>
                                        <div className="flex-1 pb-1">
                                            <p className="text-sm text-slate-200">
                                                <span className="font-semibold text-white">{activity.user}</span> {activity.action} <span className="font-medium text-slate-300">"{activity.target}"</span>
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
                                                <Clock className="w-3 h-3" />
                                                {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PremiumCard>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pending Actions */}
                    <motion.div variants={itemVariants}>
                        <PremiumCard className="p-6 h-full">
                            <h3 className="text-xl font-bold text-white mb-6">Pending Actions</h3>
                            <div className="space-y-4">
                                <div className="bg-amber-500/10 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-amber-300 text-sm mb-1">Purchase Orders Review</h4>
                                            <p className="text-amber-200/80 text-xs mb-3">3 orders &gt; $1,000 awaiting approval</p>
                                            <PremiumButton
                                                size="sm"
                                                onClick={() => navigate('/purchasing/orders')}
                                            >
                                                Review Now
                                            </PremiumButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </PremiumCard>
                    </motion.div>

                    {/* Quick Access */}
                    <motion.div variants={itemVariants}>
                        <PremiumCard className="p-6 h-full bg-gradient-to-br from-slate-800/80 to-indigo-900/30">
                            <h3 className="text-xl font-bold text-white mb-2">Quick Access</h3>
                            <p className="text-slate-400 text-sm mb-6">Frequently used tools and modules</p>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: ShoppingCart, label: 'New Order', path: '/sales/orders', color: 'blue' },
                                    { icon: Users, label: 'Add Employee', path: '/hr/employees', color: 'emerald' },
                                    { icon: Package, label: 'Add Product', path: '/inventory/products', color: 'amber' },
                                    { icon: DollarSign, label: 'Record Expense', path: '/finance/journal', color: 'purple' },
                                ].map((item, i) => (
                                    <motion.button
                                        key={i}
                                        onClick={() => navigate(item.path)}
                                        className="p-5 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl backdrop-blur-sm transition-all flex flex-col items-center gap-3 group border border-slate-600/30 hover:border-indigo-500/50"
                                        whileHover={{ scale: 1.05, y: -4 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className={`p-2.5 rounded-full bg-${item.color}-500/20 text-${item.color}-300 group-hover:text-${item.color}-200 group-hover:bg-${item.color}-500/30 transition-colors`}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-medium text-slate-300 group-hover:text-white">{item.label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </PremiumCard>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default DashboardHome;
