import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { mockDataService } from '../../../services/mockDataService';
import {
    Users,
    Plus,
    Shield,
    AlertTriangle,
    DollarSign,
    Sparkles
} from 'lucide-react';
import { FloatingOrbs, AnimatedGrid } from '../../../components/shared/BackgroundEffects';
import { PremiumCard, PremiumButton } from '../../../components/shared/PremiumComponents';
import AdminTableRow from '../components/AdminTableRow';

export default function UserManagement() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'ecommerce_admin'
    });
    const [error, setError] = useState('');

    const { data: admins, isLoading: isLoadingAdmins } = useQuery({
        queryKey: ['admins'],
        queryFn: mockDataService.getAdmins,
    });

    const { data: config } = useQuery({
        queryKey: ['compensation-config'],
        queryFn: mockDataService.getCompensationConfig,
    });

    const basePool = config?.basePool || 0;

    const addAdminMutation = useMutation({
        mutationFn: (newAdmin) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const result = mockDataService.addAdmin(newAdmin);
                    if (result.success) resolve(result.data);
                    else reject(result.error);
                }, 500);
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admins']);
            setIsModalOpen(false);
            setFormData({ name: '', email: '', role: 'ecommerce_admin' });
            setError('');
        },
        onError: (err) => {
            setError(err);
        }
    });

    const updateAdminMutation = useMutation({
        mutationFn: ({ id, updates }) => {
            return new Promise(resolve => {
                mockDataService.updateAdmin(id, updates);
                resolve();
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admins']);
            setIsModalOpen(false);
            setEditingId(null);
            setFormData({ name: '', email: '', role: 'ecommerce_admin' });
        }
    });

    const updateConfigMutation = useMutation({
        mutationFn: (updates) => {
            return new Promise(resolve => {
                mockDataService.updateCompensationConfig(updates);
                resolve();
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['compensation-config']);
        }
    });

    const deleteAdminMutation = useMutation({
        mutationFn: (id) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    mockDataService.deleteAdmin(id);
                    resolve();
                }, 500);
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admins']);
        }
    });

    const handleUpdateShare = (id, percentage) => {
        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;
        updateAdminMutation.mutate({ id, updates: { sharePercentage: percentage } });
    };

    const handleUpdateBasePool = (amount) => {
        updateConfigMutation.mutate({ basePool: amount });
    };

    const handleToggleStatus = (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        updateAdminMutation.mutate({ id, updates: { status: newStatus } });
    };

    const handleEdit = (admin) => {
        setEditingId(admin.id);
        setFormData({
            name: admin.name,
            email: admin.email,
            role: admin.role
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: '', email: '', role: 'ecommerce_admin' });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            updateAdminMutation.mutate({ id: editingId, updates: formData });
        } else {
            addAdminMutation.mutate(formData);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    if (isLoadingAdmins) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading admin users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            <FloatingOrbs count={10} />
            <AnimatedGrid />

            <motion.div
                className="relative z-10 p-6 md:p-8 space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="flex justify-between items-start md:items-center gap-4 flex-col md:flex-row">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                            <Shield className="w-8 h-8 text-indigo-400" />
                            Admin Management
                        </h1>
                        <p className="text-slate-400">Manage system administrators and their roles</p>
                    </div>
                    <PremiumButton
                        onClick={() => {
                            setEditingId(null);
                            setFormData({ name: '', email: '', role: 'ecommerce_admin' });
                            setIsModalOpen(true);
                        }}
                    >
                        <Plus className="w-4 h-4" />
                        Add New Admin
                    </PremiumButton>
                </motion.div>

                {/* Stats Grid */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <PremiumCard className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-400 mb-1">E-commerce Admins</p>
                                    <h3 className="text-2xl font-black text-white">
                                        {admins?.filter(a => a.role === 'ecommerce_admin').length} / 5
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </PremiumCard>

                    <PremiumCard className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-400 mb-1">Dev Admins</p>
                                    <h3 className="text-2xl font-black text-white">
                                        {admins?.filter(a => a.role === 'dev_admin').length} / 5
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </PremiumCard>

                    <PremiumCard className="p-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border-0">
                        <div className="flex items-center gap-2 mb-3">
                            <DollarSign className="w-5 h-5 text-white" />
                            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Total Base Pool</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-black text-white">$</span>
                            <input
                                type="number"
                                value={basePool}
                                onChange={(e) => handleUpdateBasePool(parseFloat(e.target.value) || 0)}
                                className="bg-white/20 border border-white/30 rounded-xl px-3 py-2 text-2xl font-bold text-white outline-none focus:bg-white/30 focus:ring-2 focus:ring-white/50 w-full backdrop-blur-xl"
                            />
                        </div>
                        <p className="text-xs text-white/80 mt-2">Shared Monthly Allocation</p>
                    </PremiumCard>
                </motion.div>

                {/* Admin Table */}
                <motion.div variants={itemVariants}>
                    <PremiumCard className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm min-w-[900px]">
                                <thead className="bg-slate-700/30 border-b border-slate-700/50">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-slate-300">Name</th>
                                        <th className="px-6 py-4 font-bold text-slate-300">Role</th>
                                        <th className="px-6 py-4 font-bold text-slate-300">Profit Share (%)</th>
                                        <th className="px-6 py-4 font-bold text-slate-300 hidden md:table-cell">Est. Salary</th>
                                        <th className="px-6 py-4 font-bold text-slate-300">Status</th>
                                        <th className="px-6 py-4 font-bold text-slate-300 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/30">
                                    {admins?.map((admin) => (
                                        <AdminTableRow
                                            key={admin.id}
                                            admin={admin}
                                            basePool={basePool}
                                            onUpdateShare={handleUpdateShare}
                                            onToggleStatus={handleToggleStatus}
                                            onDelete={(id) => deleteAdminMutation.mutate(id)}
                                            onEdit={handleEdit}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </PremiumCard>
                </motion.div>
            </motion.div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <motion.div
                        className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-700/50"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-indigo-600/20 to-purple-600/20">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-indigo-400" />
                                {editingId ? 'Edit Admin' : 'Add New Admin'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {error && (
                                <div className="p-4 bg-red-500/10 text-red-400 text-sm rounded-xl flex items-center gap-3 border border-red-500/20 backdrop-blur-xl">
                                    <AlertTriangle className="w-5 h-5" />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 border-2 border-slate-700/50 bg-slate-900/50 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-white placeholder-slate-500 transition-all"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 border-2 border-slate-700/50 bg-slate-900/50 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-white placeholder-slate-500 transition-all"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-300">Role</label>
                                <select
                                    className="w-full px-4 py-3 border-2 border-slate-700/50 bg-slate-900/50 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-white transition-all cursor-pointer"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="ecommerce_admin">E-commerce Admin</option>
                                    <option value="dev_admin">Dev Admin</option>
                                </select>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-6 py-3 text-slate-300 hover:bg-slate-700/50 rounded-xl font-semibold transition-all"
                                >
                                    Cancel
                                </button>
                                <PremiumButton
                                    type="submit"
                                    disabled={addAdminMutation.isPending || updateAdminMutation.isPending}
                                >
                                    {addAdminMutation.isPending || updateAdminMutation.isPending
                                        ? 'Saving...'
                                        : (editingId ? 'Save Changes' : 'Create Admin')}
                                </PremiumButton>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
