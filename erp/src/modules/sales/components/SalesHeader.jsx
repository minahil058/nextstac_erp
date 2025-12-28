import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingCart, Users, Package, TrendingUp, Menu, X, Target, HeartHandshake } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const SalesHeader = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { label: 'Orders', path: '/sales/orders', icon: ShoppingCart },
        { label: 'Customers', path: '/sales/customers', icon: Users },
        { label: 'Leads', path: '/sales/leads', icon: Target },
        { label: 'Follow Ups', path: '/sales/follow-ups', icon: HeartHandshake },
    ];

    return (
        <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-slate-900/50 backdrop-blur-2xl supports-[backdrop-filter]:bg-slate-900/50">
            <div className="px-4 md:px-6 h-16 flex items-center justify-between max-w-7xl mx-auto">
                {/* Logo Section */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                            <div className="relative w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xl border border-white/10 ring-1 ring-white/5">
                                <span className="bg-gradient-to-br from-orange-400 to-amber-200 bg-clip-text text-transparent transform group-hover:scale-110 transition-transform duration-200">S</span>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <h1 className="text-lg font-bold text-white leading-tight tracking-tight">
                                Sales & CRM
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]">
                                    Commerce
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-white/10 mx-2 hidden md:block"></div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => clsx(
                                    "relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group overflow-hidden",
                                    isActive
                                        ? "text-orange-400"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                                )}
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <motion.div
                                                layoutId="sales-nav-pill"
                                                className="absolute inset-0 bg-orange-500/10 border border-orange-500/20 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.1)]"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <div className="relative flex items-center gap-2 z-10">
                                            <item.icon className={clsx("w-4 h-4", isActive ? "text-orange-400" : "text-slate-500 group-hover:text-slate-300")} />
                                            <span>{item.label}</span>
                                        </div>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden border-t border-white/5 bg-slate-900/95 backdrop-blur-xl overflow-hidden"
                    >
                        <nav className="p-4 space-y-2">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) => clsx(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                        isActive
                                            ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </NavLink>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default SalesHeader;
