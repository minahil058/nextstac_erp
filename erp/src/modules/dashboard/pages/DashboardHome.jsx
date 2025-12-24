import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { mockDataService } from '../../../services/mockDataService';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
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
    ArrowRight,
    AlertCircle
} from 'lucide-react';
import PendingLeaveWidget from '../components/PendingLeaveWidget';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const DashboardHome = () => {
    const navigate = useNavigate();

    // Keep existing queries for real data integration later
    const { data: accounts } = useQuery({
        queryKey: ['accounts'],
        queryFn: mockDataService.getAccounts,
    });

    const { data: transactions } = useQuery({
        queryKey: ['transactions'],
        queryFn: mockDataService.getTransactions,
    });

    // MOCK DATA FOR VISUALIZATION
    const mockKPIs = [
        {
            title: "Total Revenue",
            value: "$124,500.00",
            change: "+12.5%",
            trend: "up",
            icon: DollarSign,
            color: "emerald"
        },
        {
            title: "Active Orders",
            value: "45",
            change: "+3.2%",
            trend: "up",
            icon: ShoppingCart,
            color: "blue"
        },
        {
            title: "Low Stock Items Shortage", // Renamed for clarity in UI if text improved, but keeping content similar
            value: "12",
            change: "-2",
            trend: "down", // positive in this context actually, but let's keep simple
            icon: Package,
            color: "amber"
        },
        {
            title: "Total Employees",
            value: "28",
            change: "+2",
            trend: "up",
            icon: Users,
            color: "indigo"
        }
    ];

    const mockRevenueData = [
        { name: 'Jan', revenue: 40000, expenses: 24000 },
        { name: 'Feb', revenue: 30000, expenses: 13980 },
        { name: 'Mar', revenue: 20000, expenses: 9800 },
        { name: 'Apr', revenue: 27800, expenses: 3908 },
        { name: 'May', revenue: 18900, expenses: 4800 },
        { name: 'Jun', revenue: 23900, expenses: 3800 },
        { name: 'Jul', revenue: 34900, expenses: 4300 },
    ];

    const mockActivities = [
        { id: 1, user: "Sarah Wilson", action: "created new order", target: "#ORD-2024-001", time: "2 mins ago", type: "order" },
        { id: 2, user: "Mike Brown", action: "updated stock for", target: "Wireless Headphones", time: "15 mins ago", type: "inventory" },
        { id: 3, user: "System", action: "generated monthly report", target: "Finance_May_2024.pdf", time: "1 hour ago", type: "system" },
        { id: 4, user: "Jane Doe", action: "approved leave request", target: "John Smith", time: "3 hours ago", type: "hr" },
        { id: 5, user: "Alex Jones", action: "added new supplier", target: "TechParts Inc.", time: "5 hours ago", type: "purchasing" },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <Button
                    onClick={() => navigate('/finance/reports')}
                    className="gap-2"
                >
                    <DollarSign className="w-4 h-4" />
                    Generate Report
                </Button>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockKPIs.map((kpi, index) => {
                    const Icon = kpi.icon;
                    return (
                        <Card key={index} className="hover:-translate-y-1 transition-transform duration-200">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl bg-${kpi.color}-50 text-${kpi.color}-600`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <Badge variant={kpi.trend === 'up' ? 'success' : 'destructive'} className="flex items-center gap-1">
                                        {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        {kpi.change}
                                    </Badge>
                                </div>
                                <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">{kpi.title}</h3>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{kpi.value}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Financial Chart */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-bold">Revenue Analytics</CardTitle>
                        <select className="text-sm border-slate-200 rounded-lg text-slate-500 focus:ring-indigo-500 focus:border-indigo-500">
                            <option>Last 7 Months</option>
                            <option>This Year</option>
                        </select>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={mockRevenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value) => [`$${value}`, undefined]}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                                    <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activities */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                        <Button
                            variant="link"
                            onClick={() => navigate('/audit')}
                            className="text-indigo-600 hover:text-indigo-700 h-auto p-0"
                        >
                            View All
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {mockActivities.map((activity) => (
                                <div key={activity.id} className="flex gap-4 relative group">
                                    {/* Timeline line */}
                                    <div className="absolute left-[19px] top-8 bottom-[-24px] w-0.5 bg-slate-100 group-last:hidden"></div>

                                    <div className="flex-shrink-0 relative z-10">
                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                                            {activity.type === 'order' && <ShoppingCart className="w-4 h-4 text-blue-600" />}
                                            {activity.type === 'inventory' && <Package className="w-4 h-4 text-amber-600" />}
                                            {activity.type === 'system' && <Activity className="w-4 h-4 text-slate-600" />}
                                            {activity.type === 'hr' && <Users className="w-4 h-4 text-emerald-600" />}
                                            {activity.type === 'purchasing' && <DollarSign className="w-4 h-4 text-purple-600" />}
                                        </div>
                                    </div>
                                    <div className="flex-1 pb-1">
                                        <p className="text-sm text-slate-900">
                                            <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-medium text-slate-700">{activity.target}</span>
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Actions / Tasks */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Pending Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-orange-600" />
                                    <div>
                                        <p className="text-sm font-medium text-orange-900">3 Pending Purchase Orders</p>
                                        <p className="text-xs text-orange-700">Approval required for amounts &gt; $1,000</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => navigate('/purchasing/orders')}
                                    variant="outline"
                                    size="sm"
                                    className="bg-white text-orange-700 border-orange-200 hover:bg-orange-50 hover:text-orange-800"
                                >
                                    Review
                                </Button>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-slate-900">Leave Requests</h4>
                                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">Pending Action</Badge>
                            </div>
                            <Card className="rounded-xl border border-slate-200 overflow-hidden shadow-none">
                                <PendingLeaveWidget />
                            </Card>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Links */}
                <Card className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-white">Quick Access</CardTitle>
                        <p className="text-indigo-100 text-sm">Frequently used tools and modules.</p>
                    </CardHeader>

                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <button
                                onClick={() => navigate('/sales/orders')}
                                className="p-4 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-colors text-center group w-full"
                            >
                                <ShoppingCart className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-medium">New Order</span>
                            </button>
                            <button
                                onClick={() => navigate('/hr/employees')}
                                className="p-4 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-colors text-center group w-full"
                            >
                                <Users className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-medium">Add Employee</span>
                            </button>
                            <button
                                onClick={() => navigate('/inventory/products')}
                                className="p-4 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-colors text-center group w-full"
                            >
                                <Package className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-medium">Add Product</span>
                            </button>
                            <button
                                onClick={() => navigate('/finance/journal')}
                                className="p-4 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-colors text-center group w-full"
                            >
                                <DollarSign className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-medium">Record Expense</span>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardHome;
