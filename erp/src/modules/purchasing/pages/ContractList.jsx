import React, { useState } from 'react';
import {
    FileText,
    Plus,
    Search,
    Calendar,
    Download,
    MoreVertical,
    FileCheck,
    Briefcase,
    Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Using static mock data for simplified Contracts list as requested
const MOCK_CONTRACTS = [
    { id: 1, title: 'Annual Supply Agreement', party: 'TechGiant Corp', type: 'Supplier', date: '2024-01-15', status: 'Active' },
    { id: 2, title: 'Office Lease - Downtown', party: 'RealEstate Ltd', type: 'Lease', date: '2023-11-01', status: 'Active' },
    { id: 3, title: 'Maintenance Contract', party: 'FixIt Services', type: 'Service', date: '2024-03-10', status: 'Draft' },
    { id: 4, title: 'Consulting Agreement', party: 'Jane Doe', type: 'Employment', date: '2024-02-20', status: 'Expired' },
];

export default function ContractList() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredContracts = MOCK_CONTRACTS.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.party.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20';
            case 'Draft': return 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20';
            case 'Expired': return 'bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Supplier': return <Briefcase className="w-5 h-5" />;
            case 'Lease': return <FileCheck className="w-5 h-5" />;
            case 'Employment': return <User className="w-5 h-5" />;
            default: return <FileText className="w-5 h-5" />;
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-6 max-w-[1920px] mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Contracts</h2>
                    <p className="text-slate-400">Manage legal agreements and documents</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-purple-500/25 flex items-center gap-2 font-bold transition-all"
                >
                    <Plus className="w-5 h-5" />
                    New Contract
                </motion.button>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-4 rounded-2xl sticky top-20 z-30 shadow-xl">
                <div className="relative">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search contracts..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder:text-slate-500 transition-all shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence>
                    {filteredContracts.map((contract) => (
                        <motion.div
                            key={contract.id}
                            variants={itemVariants}
                            layout
                            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-lg hover:shadow-purple-500/10 transition-all group overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4 relative">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-slate-700/50 rounded-xl text-purple-400 group-hover:text-purple-300 group-hover:scale-110 transition-all shadow-inner border border-slate-600/30">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white leading-tight group-hover:text-purple-400 transition-colors">{contract.title}</h3>
                                            <p className="text-xs text-slate-500 font-mono mt-1">ID: CN-{contract.id + 1000}</p>
                                        </div>
                                    </div>
                                    <button className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700/50">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-3 mb-6 bg-slate-900/30 p-4 rounded-xl border border-slate-700/30">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 flex items-center gap-2">
                                            <Shield className="w-3.5 h-3.5" /> Party
                                        </span>
                                        <span className="font-medium text-white">{contract.party}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5" /> Date
                                        </span>
                                        <span className="text-slate-300 font-medium">{contract.date}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 flex items-center gap-2">
                                            <Briefcase className="w-3.5 h-3.5" /> Type
                                        </span>
                                        <span className="text-slate-300">{contract.type}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between">
                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${getStatusColor(contract.status)}`}>
                                        {contract.status}
                                    </span>
                                    <button className="text-purple-400 hover:text-purple-300 text-sm font-bold flex items-center gap-1.5 transition-colors group/btn">
                                        <Download className="w-4 h-4 group-hover/btn:-translate-y-0.5 transition-transform" />
                                        Download
                                    </button>
                                </div>
                            </div>
                            <div className="h-1 w-full bg-gradient-to-r from-purple-600/0 via-purple-600/50 to-indigo-600/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredContracts.length === 0 && (
                <div className="py-20 text-center text-slate-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg">No contracts found</p>
                </div>
            )}
        </div>
    );
}
