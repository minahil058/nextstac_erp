import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, Book, PieChart, LayoutDashboard, ArrowLeftRight } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const FinanceHeader = () => {
    const navItems = [
        { label: 'Invoices', path: '/finance/invoices', icon: FileText },
        { label: 'Payments', path: '/finance/payments', icon: PieChart },
        { label: 'Returns', path: '/finance/returns', icon: ArrowLeftRight },
        { label: 'Journal', path: '/finance/journal', icon: FileText },
        { label: 'Ledger', path: '/finance/ledger', icon: Book },
        { label: 'Reports', path: '/finance/reports', icon: PieChart },
        { label: 'Generate', path: '/finance/generate-reports', icon: FileText },
    ];

    return (
        <div className="bg-slate-900/60 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-40 font-[Inter] shadow-sm">
            <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg border border-indigo-400/20">
                            F
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white leading-tight tracking-tight">
                                Office Ledger
                            </h1>
                            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                                Pro Finance
                            </span>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-slate-700/50 mx-2 hidden sm:block"></div>

                    <nav className="hidden sm:flex items-center gap-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.exact}
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
                                                layoutId="finance-nav-pill"
                                                className="absolute inset-0 bg-indigo-600 shadow-lg shadow-indigo-500/20 rounded-xl"
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
                    <button className="hidden md:flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                        Double Entry Active
                    </button>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 text-white flex items-center justify-center text-xs font-bold ring-2 ring-slate-700/50">
                        U
                    </div>
                </div>
            </div>

            {/* Mobile Nav (Scrollable) */}
            <div className="sm:hidden overflow-x-auto pb-3 px-4 flex gap-2 no-scrollbar">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.exact}
                        className={({ isActive }) => clsx(
                            "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                            isActive
                                ? "bg-indigo-600 text-white border-indigo-600"
                                : "bg-slate-700/50 text-slate-300 border-slate-600/50"
                        )}
                    >
                        {item.label}
                    </NavLink>
                ))}
            </div>
        </div >
    );
};

export default FinanceHeader;
