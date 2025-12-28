import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Calendar, Banknote, Clock } from 'lucide-react';
import { clsx } from 'clsx';

const HRHeader = () => {
    const navItems = [
        { label: 'Employees', path: '/hr/employees', icon: Users, exact: true },
        { label: 'Attendance', path: '/hr/attendance', icon: Clock },
        { label: 'Payroll', path: '/hr/payroll', icon: Banknote },
        { label: 'Leave', path: '/hr/leave', icon: Calendar },
        { label: 'History', path: '/hr/leave-history', icon: Clock }, // Added History
    ];

    return (
        <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-10">
            <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg border border-emerald-400/20">
                            H
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white leading-tight tracking-tight">
                                HR & Employees
                            </h1>
                            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                Management
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
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-emerald-600 text-white shadow-lg"
                                        : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                                )}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </div>
            {/* Mobile Nav */}
            <div className="sm:hidden overflow-x-auto pb-3 px-4 flex gap-2 no-scrollbar">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.exact}
                        className={({ isActive }) => clsx(
                            "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                            isActive
                                ? "bg-emerald-600 text-white border-emerald-600"
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

export default HRHeader;
