import React from 'react';
import { NavLink } from 'react-router-dom';
import { Building2, Users, Network } from 'lucide-react';
import { clsx } from 'clsx';

const CompanyHeader = () => {
    const navItems = [
        { label: 'Profile', path: '/company/profile', icon: Building2 },
        { label: 'Departments', path: '/company/departments', icon: Users },
        { label: 'Branches', path: '/company/branches', icon: Network },
    ];

    return (
        <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-10 font-[Inter]">
            <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            C
                        </div>
                        <div>
                            <h1 className="text-lg font-extrabold text-white leading-tight tracking-tight">
                                Company
                            </h1>
                            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest bg-indigo-500/20 px-1.5 py-0.5 rounded border border-indigo-500/30">
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
                                        ? "bg-indigo-600 text-white shadow-lg"
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
                                ? "bg-indigo-600 text-white border-indigo-600"
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

export default CompanyHeader;
