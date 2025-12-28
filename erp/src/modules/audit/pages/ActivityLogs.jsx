import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockDataService } from '../../../services/mockDataService';
import {
    Activity,
    Shield,
    Search,
    Filter,
    Clock,
    Monitor,
    FilePlus,
    Edit2,
    Trash2,
    LogIn,
    FileDown,
    Loader2
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ActivityLogs() {
    const { data: logs, isLoading } = useQuery({
        queryKey: ['logs'],
        queryFn: mockDataService.getLogs,
    });

    const { showToast } = useToast();

    const [searchTerm, setSearchTerm] = useState('');
    const [moduleFilter, setModuleFilter] = useState('All');

    if (isLoading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
                <Loader2 className="w-8 h-8 text-indigo-500" />
            </motion.div>
            <p className="mt-4 font-medium">Loading activity logs...</p>
        </div>
    );

    const filteredLogs = logs?.filter(log => {
        const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesModule = moduleFilter === 'All' || log.module === moduleFilter;
        return matchesSearch && matchesModule;
    });

    const getActionIcon = (action) => {
        if (action.includes('Created')) return <FilePlus className="w-4 h-4" />;
        if (action.includes('Updated')) return <Edit2 className="w-4 h-4" />;
        if (action.includes('Deleted')) return <Trash2 className="w-4 h-4" />;
        if (action.includes('Logged In')) return <LogIn className="w-4 h-4" />;
        if (action.includes('Exported')) return <FileDown className="w-4 h-4" />;
        return <Activity className="w-4 h-4" />;
    };

    const getActionColor = (action) => {
        if (action.includes('Created')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        if (action.includes('Updated')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        if (action.includes('Deleted')) return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        if (action.includes('Logged In')) return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
        return 'bg-slate-700/50 text-slate-400 border-slate-600/50';
    };

    const handleExport = () => {
        if (!filteredLogs || filteredLogs.length === 0) return;

        const headers = ['User', 'Action', 'Module', 'IP Address', 'Timestamp'];
        const csvContent = [
            headers.join(','),
            ...filteredLogs.map(log => [
                `"${log.user}"`,
                `"${log.action}"`,
                `"${log.module}"`,
                `"${log.ip}"`,
                `"${new Date(log.timestamp).toLocaleString()}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `activity_logs_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        showToast('Activity logs exported successfully', 'success');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Shield className="w-8 h-8 text-indigo-500" />
                        Activity Logs
                    </h1>
                    <p className="text-slate-400 mt-1">Monitor system events and user actions</p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleExport}
                    className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white rounded-xl flex items-center justify-center gap-2 font-medium transition-all shadow-sm"
                >
                    <FileDown className="w-5 h-5" />
                    Export Logs
                </motion.button>
            </div>

            {/* Filters */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-4 rounded-2xl sticky top-20 z-30 shadow-xl flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search by user or action..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder:text-slate-500 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 border border-slate-700 rounded-xl px-4 py-2.5 bg-slate-900/50">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                        className="bg-transparent text-sm font-medium text-slate-300 outline-none cursor-pointer focus:text-white [&>option]:bg-slate-900"
                        value={moduleFilter}
                        onChange={(e) => setModuleFilter(e.target.value)}
                    >
                        <option value="All">All Modules</option>
                        <option value="Finance">Finance</option>
                        <option value="HR">HR</option>
                        <option value="Inventory">Inventory</option>
                        <option value="Auth">Auth</option>
                    </select>
                </div>
            </div>

            {/* Timeline */}
            <div className="relative pl-4 sm:pl-8 space-y-8 before:absolute before:left-4 sm:before:left-8 before:top-4 before:bottom-4 before:w-px before:bg-slate-800">
                <AnimatePresence mode='popLayout'>
                    {filteredLogs?.map((log, index) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="relative pl-8 sm:pl-10 group"
                        >
                            {/* Timeline Dot */}
                            <div className={`absolute left-0 sm:left-4 top-6 -translate-y-1/2 -translate-x-[5px] w-3 h-3 rounded-full border-2 border-slate-900 ring-2 ring-slate-800 transition-all duration-300 group-hover:scale-125 ${log.action.includes('Deleted') ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' :
                                    log.action.includes('Created') ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                                        log.action.includes('Logged') ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' :
                                            'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                }`}></div>

                            {/* Card Content */}
                            <div className="bg-slate-800/50 backdrop-blur-sm p-5 rounded-2xl border border-slate-700/50 shadow-lg hover:bg-slate-800 hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl border flex-shrink-0 ${getActionColor(log.action)}`}>
                                            {getActionIcon(log.action)}
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span className="font-bold text-white text-lg">{log.user}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-slate-400">performed</span>
                                                <span className={`font-bold ${log.action.includes('Deleted') ? 'text-rose-400' :
                                                        log.action.includes('Created') ? 'text-emerald-400' :
                                                            log.action.includes('Logged') ? 'text-indigo-400' : 'text-blue-400'
                                                    }`}>{log.action}</span>
                                                <span className="bg-slate-700/50 border border-slate-600/50 px-2 py-0.5 rounded text-xs text-slate-300 font-mono">
                                                    {log.module}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 sm:gap-1 pl-16 sm:pl-0">
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-900/50 px-2.5 py-1.5 rounded-lg border border-slate-700/50">
                                            <Clock className="w-3.5 h-3.5 text-indigo-400" />
                                            {new Date(log.timestamp).toLocaleString()}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mt-1">
                                            <Monitor className="w-3 h-3" />
                                            {log.ip}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredLogs?.length === 0 && (
                    <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-slate-700/50 border-dashed">
                        <Activity className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No activity found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">Try adjusting your search terms or filters to see more results.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
