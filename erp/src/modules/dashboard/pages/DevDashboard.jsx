import React from 'react';
import {
    Code,
    Database,
    Server,
    Activity,
    FileText,
    GitBranch,
    Terminal,
    ArrowUpRight,
    Cpu,
    AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { containerVariants, cardVariants } from '../../../components/ui/animations';
import { useToast } from '../../../context/ToastContext';
import { FloatingOrbs, AnimatedGrid } from '../../../components/shared/BackgroundEffects';
import { PremiumCard, PremiumButton, StatCard } from '../../../components/shared/PremiumComponents';

export default function DevDashboard() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSystemLogs = () => {
        showToast("Fetching system logs...", "info");
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
            <FloatingOrbs count={8} color="purple" />
            <AnimatedGrid />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 space-y-8"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-white flex items-center gap-3 tracking-tight">
                            <Terminal className="w-8 h-8 text-purple-400" />
                            Developer Console
                        </h1>
                        <p className="text-slate-400 mt-2">System monitoring and administration</p>
                    </div>
                    <div className="flex gap-2">
                        <PremiumButton
                            onClick={handleSystemLogs}
                        >
                            <Activity className="w-4 h-4" />
                            System Logs
                        </PremiumButton>
                    </div>
                </div>

                {/* Stats Grid */}
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <StatCard
                        icon={Server}
                        label="System Uptime"
                        value="99.99%"
                        trend={0.1}
                        color="emerald"
                    />
                    <StatCard
                        icon={Activity}
                        label="API Latency"
                        value="45ms"
                        trend={-12} // Negative is good for latency, but component defaults trend colors.
                        color="blue"
                    />
                    <StatCard
                        icon={Cpu}
                        label="Active Sessions"
                        value="128"
                        trend={5.4}
                        color="purple"
                    />
                    <StatCard
                        icon={AlertCircle}
                        label="Open Issues"
                        value="12"
                        trend={-2} // Improving
                        color="amber"
                    />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activity */}
                    <motion.div variants={itemVariants}>
                        <PremiumCard className="p-6 h-full">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <GitBranch className="w-5 h-5 text-indigo-400" />
                                    Recent Deployments
                                </h3>
                                <button
                                    onClick={() => navigate('/audit')}
                                    className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 group transition-colors"
                                >
                                    View All <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center gap-4 hover:bg-slate-700/50 hover:shadow-lg transition-all cursor-default group backdrop-blur-sm">
                                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform ring-1 ring-blue-500/30">
                                        <Code className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Deployed v2.4.0</p>
                                        <p className="text-xs text-slate-400 font-medium mt-0.5">2 hours ago • via CI/CD</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center gap-4 hover:bg-slate-700/50 hover:shadow-lg transition-all cursor-default group backdrop-blur-sm">
                                    <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform ring-1 ring-amber-500/30">
                                        <Database className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Database Backup</p>
                                        <p className="text-xs text-slate-400 font-medium mt-0.5">5 hours ago • Automated</p>
                                    </div>
                                </div>
                            </div>
                        </PremiumCard>
                    </motion.div>

                    {/* Documentation */}
                    <motion.div variants={itemVariants}>
                        <PremiumCard className="p-6 h-full">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-indigo-400" />
                                    Documentation
                                </h3>
                                <button
                                    onClick={() => navigate('/documents')}
                                    className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 group transition-colors"
                                >
                                    View All <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 border border-slate-700/50 rounded-xl hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all cursor-pointer group bg-slate-900/30">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors">API Reference</h4>
                                            <p className="text-xs text-slate-400 mt-1 font-medium">Updated 1 day ago</p>
                                        </div>
                                        <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                                            <FileText className="w-4 h-4 text-slate-500 group-hover:text-indigo-300" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 border border-slate-700/50 rounded-xl hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all cursor-pointer group bg-slate-900/30">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors">Architecture Guide</h4>
                                            <p className="text-xs text-slate-400 mt-1 font-medium">Updated 3 days ago</p>
                                        </div>
                                        <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                                            <FileText className="w-4 h-4 text-slate-500 group-hover:text-indigo-300" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </PremiumCard>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
