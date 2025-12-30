import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { mockDataService } from '../../../services/mockDataService';
import {
    ShoppingCart,
    Package,
    Users,
    DollarSign,
    ArrowUpRight,
    CheckCircle,
    Sparkles,
    Download,
    Store
} from 'lucide-react';
import { motion } from 'framer-motion';
import { containerVariants, cardVariants } from '../../../components/ui/animations';
import { useToast } from '../../../context/ToastContext';
import { FloatingOrbs, AnimatedGrid } from '../../../components/shared/BackgroundEffects';
import { PremiumCard, PremiumButton, StatCard } from '../../../components/shared/PremiumComponents';

export default function EcommerceDashboard() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { data: products } = useQuery({ queryKey: ['products'], queryFn: mockDataService.getProducts });
    const { data: orders } = useQuery({ queryKey: ['orders'], queryFn: mockDataService.getOrders });
    const { data: customers } = useQuery({ queryKey: ['customers'], queryFn: mockDataService.getCustomers });

    const totalRevenue = orders?.reduce((sum, order) => sum + order.amount, 0) || 0;
    const totalOrders = orders?.length || 0;
    const lowStockProducts = products?.filter(p => p.stock < p.minStock) || [];

    const handleDownloadReport = () => {
        const element = document.createElement("a");
        const file = new Blob(["Ecommerce Report 2024\n\nRevenue: $" + totalRevenue], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "report_2024.txt";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

        showToast("Report downloaded successfully", "success");
    };

    const handleConnectStore = () => {
        showToast("Redirecting to Store Connection Wizard...", "info");
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
            <FloatingOrbs count={8} color="blue" />
            <AnimatedGrid />

            <motion.div
                className="relative z-10 space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-white flex items-center gap-3 tracking-tight">
                            <Sparkles className="w-8 h-8 text-blue-400" />
                            E-commerce Overview
                        </h1>
                        <p className="text-slate-400 mt-2">Store performance and inventory status</p>
                    </div>
                    <div className="flex gap-3 flex-wrap sm:flex-nowrap">
                        <PremiumButton
                            variant="secondary"
                            onClick={handleDownloadReport}
                        >
                            <Download className="w-4 h-4" />
                            Download Report
                        </PremiumButton>
                        <PremiumButton
                            onClick={handleConnectStore}
                        >
                            <Store className="w-4 h-4" />
                            Connect Store
                        </PremiumButton>
                    </div>
                </div>

                {/* Stats Grid */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={DollarSign}
                        label="Total Revenue"
                        value={`$${totalRevenue.toLocaleString()}`}
                        trend={12.5}
                        color="blue"
                    />
                    <StatCard
                        icon={ShoppingCart}
                        label="Total Orders"
                        value={totalOrders.toString()}
                        trend={8.2}
                        color="indigo"
                    />
                    <StatCard
                        icon={Users}
                        label="Active Customers"
                        value={(customers?.length || 0).toString()}
                        trend={4.5}
                        color="purple"
                    />
                    <StatCard
                        icon={Package}
                        label="Total Products"
                        value={(products?.length || 0).toString()}
                        trend={0}
                        color="emerald"
                    />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <motion.div variants={itemVariants}>
                        <PremiumCard className="p-6 h-full">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">Recent Orders</h2>
                                <button
                                    onClick={() => navigate('/sales/orders')}
                                    className="text-blue-400 text-sm font-medium hover:text-blue-300 flex items-center gap-1 group transition-colors"
                                >
                                    View All <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                {orders?.slice(0, 5).map(order => (
                                    <div key={order.id} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-white/10 group cursor-pointer" onClick={() => navigate('/sales/orders')}>
                                        <div>
                                            <p className="font-medium text-white group-hover:text-blue-400 transition-colors">{order.customerName}</p>
                                            <p className="text-xs text-slate-500">{order.orderNumber} • {new Date(order.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-200">${order.amount.toLocaleString()}</p>
                                            <span className={`text-xs font-medium ${order.status === 'Completed' ? 'text-emerald-400' : 'text-amber-400'
                                                }`}>{order.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PremiumCard>
                    </motion.div>

                    {/* Low Stock Alert */}
                    <motion.div variants={itemVariants}>
                        <PremiumCard className="p-6 h-full">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">Low Stock Alerts</h2>
                                <button
                                    onClick={() => navigate('/inventory/products')}
                                    className="text-amber-400 text-sm font-medium hover:text-amber-300 flex items-center gap-1 group transition-colors"
                                >
                                    Manage Inventory <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                            {lowStockProducts.length > 0 ? (
                                <div className="space-y-3">
                                    {lowStockProducts.map(product => (
                                        <div key={product.id} className="flex items-center justify-between p-3 bg-red-500/10 rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-colors cursor-pointer" onClick={() => navigate('/inventory/products')}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center border border-red-500/20">
                                                    <Package className="w-5 h-5 text-red-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{product.name}</p>
                                                    <p className="text-xs text-slate-400">SKU: {product.sku}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-red-400">{product.stock} Left</p>
                                                <p className="text-xs text-red-500/70">Min: {product.minStock}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-500">
                                    <CheckCircle className="w-12 h-12 text-emerald-500/50 mx-auto mb-3" />
                                    <p>All stock levels are healthy</p>
                                </div>
                            )}
                        </PremiumCard>
                    </motion.div>
                </div>
            </motion.div>
        </div >
    );
}
