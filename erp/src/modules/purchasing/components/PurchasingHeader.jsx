import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingCart, Truck, FileText, ScrollText, Menu, X, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const PurchasingHeader = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { label: 'Suppliers', path: '/purchasing/suppliers', icon: Truck },
        { label: 'Purchase Orders', path: '/purchasing/orders', icon: FileText },
        { label: 'Bills & Invoices', path: '/purchasing/bills', icon: ScrollText },
    ];

    return (
        <>
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-40 font-[Inter]"
            >
                <div className="max-w-[1920px] mx-auto px-4 md:px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo / Title area */}
                        <div className="flex items-center gap-4">
                            <div className="relative group cursor-pointer">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                <div className="relative w-10 h-10 md:w-12 md:h-12 bg-slate-900 rounded-xl border border-slate-700/50 flex items-center justify-center shadow-2xl">
                                    <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                                    Purchasing
                                    <span className="hidden md:flex px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                                        Procurement
                                    </span>
                                </h1>
                                <p className="text-xs text-slate-400 font-medium hidden md:block">Manage suppliers & orders</p>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1 bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.exact}
                                    className={({ isActive }) => clsx(
                                        "px-4 py-2 rounded-xl text-sm font-BOLD flex items-center gap-2 transition-all duration-300 relative overflow-hidden group",
                                        isActive
                                            ? "text-white"
                                            : "text-slate-400 hover:text-slate-200"
                                    )}
                                >
                                    {({ isActive }) => (
                                        <>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="purchasing-nav-pill"
                                                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/20"
                                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                />
                                            )}
                                            <span className="relative z-10 flex items-center gap-2">
                                                <item.icon className={clsx("w-4 h-4", isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300")} />
                                                {item.label}
                                            </span>
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </nav>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 rounded-xl border border-slate-700/50 transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden overflow-hidden bg-slate-900 border-b border-slate-800/50 backdrop-blur-xl relative z-30"
                    >
                        <nav className="p-4 space-y-2">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) => clsx(
                                        "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold border transition-all duration-200",
                                        isActive
                                            ? "bg-slate-800 text-white border-purple-500/50 shadow-lg shadow-purple-900/20"
                                            : "bg-slate-800/30 text-slate-400 border-transparent hover:bg-slate-800 hover:text-white"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={clsx("p-2 rounded-lg", item.isActive ? "bg-purple-500/20" : "bg-slate-700/30")}>
                                            <item.icon className="w-4 h-4" />
                                        </div>
                                        {item.label}
                                    </div>
                                    <ChevronRight className="w-4 h-4 opacity-50" />
                                </NavLink>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default PurchasingHeader;
