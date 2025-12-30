import React from 'react';
import { NavLink } from 'react-router-dom';
import { Package, Truck, Warehouse, History } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import companyLogo from '../../../assets/final_logo.jpg';

const InventoryHeader = () => {
    const navItems = [
        { label: 'Products', path: '/inventory/products', icon: Package },
        { label: 'Stock', path: '/inventory/stock', icon: History },
        { label: 'Warehouses', path: '/inventory/warehouses', icon: Warehouse },
        { label: 'Vendors', path: '/inventory/vendors', icon: Truck },
    ];

    return (
        <div className="bg-slate-900/60 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-40 font-[Inter] shadow-sm">
            <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <img src={companyLogo} alt="Logo" className="w-10 h-10 rounded-2xl shadow-lg border border-teal-400/20 object-contain bg-slate-900" />
                        <div>
                            <h1 className="text-xl font-black text-white leading-tight tracking-tight">
                                Inventory
                            </h1>
                            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
                                Logistics
                            </span>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-slate-700/50 mx-2 hidden sm:block"></div>

                    {/* Desktop/Tablet Nav */}
                    <nav className="hidden sm:flex items-center gap-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => clsx(
                                    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative",
                                    isActive
                                        ? "text-white"
                                        : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                                )}
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className="relative z-10">{item.label}</span>
                                        {isActive && (
                                            <motion.span
                                                layoutId="inventory-nav-pill"
                                                className="absolute inset-0 bg-teal-600 shadow-lg shadow-teal-500/20 rounded-xl"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <img src={companyLogo} alt="User" className="w-9 h-9 rounded-full object-cover bg-slate-800 ring-2 ring-slate-700/50" />
                </div>
            </div>

            {/* Mobile Nav (Scrollable) */}
            <div className="sm:hidden overflow-x-auto pb-3 px-4 flex gap-2 no-scrollbar">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => clsx(
                            "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                            isActive
                                ? "bg-teal-600 text-white border-teal-600"
                                : "bg-slate-700/50 text-slate-300 border-slate-600/50"
                        )}
                    >
                        {item.label}
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default InventoryHeader;
