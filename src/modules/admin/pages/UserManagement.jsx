import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import {
    Users,
    Shield,
    CheckCircle,
    XCircle,
    Clock,
    UserCheck,
    UserX,
    MoreVertical,
    Search,
    Filter,
    Briefcase,
    DollarSign,
    TrendingUp
} from 'lucide-react';
import { FloatingOrbs, AnimatedGrid } from '../../../components/shared/BackgroundEffects';
import { PremiumCard } from '../../../components/shared/PremiumComponents';

export default function UserManagement() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('active'); // Default to Active to match screenshot feel
    const [actionLoading, setActionLoading] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newAdminData, setNewAdminData] = useState({ name: '', email: '', role: 'staff' });

    // Handle Add Admin Submission
    const handleAddAdminSubmit = async (e) => {
        e.preventDefault();
        setActionLoading('add');

        try {
            // Generate a temporary ID (will be replaced by Auth ID on actual signup)
            const crypto = window.crypto || window.msCrypto;
            const tempId = crypto.randomUUID();

            const { error } = await supabase
                .from('users')
                .insert({
                    id: tempId,
                    email: newAdminData.email,
                    name: newAdminData.name,
                    role: newAdminData.role,
                    status: 'Active',
                    is_approved: true,
                    created_at: new Date().toISOString()
                });

            if (error) throw error;

            setIsAddModalOpen(false);
            setNewAdminData({ name: '', email: '', role: 'staff' });
            queryClient.invalidateQueries(['users']);
            alert('Admin pre-approved successfully! They can now sign up with this email.');
        } catch (error) {
            console.error('Error adding admin:', error);
            alert('Failed to add admin: ' + error.message);
        } finally {
            setActionLoading(null);
        }
    };

    // Fetch Users from Supabase
    const { data: users, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        },
    });

    // Mutations
    const approveUserMutation = useMutation({
        mutationFn: async (id) => {
            const { error } = await supabase
                .from('users')
                .update({ is_approved: true, status: 'Active' })
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
        }
    });

    const revokeUserMutation = useMutation({
        mutationFn: async (id) => {
            const { error } = await supabase
                .from('users')
                .update({ is_approved: false, status: 'Pending' })
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
        }
    });

    const handleApprove = async (id) => {
        setActionLoading(id);
        try { await approveUserMutation.mutateAsync(id); } finally { setActionLoading(null); }
    };

    const handleRevoke = async (id) => {
        setActionLoading(id);
        try { await revokeUserMutation.mutateAsync(id); } finally { setActionLoading(null); }
    };

    // Derived Stats
    const totalUsers = users?.length || 0;

    // FIX: Standardize Pending/Active Logic
    // Capture all pending users in one variable for both Badge and List
    const pendingUsersList = users?.filter(u => !u.is_approved) || [];
    const pendingUsers = pendingUsersList.length; // Renamed back for JSX compatibility

    console.log('Pending Users Debug:', pendingUsersList);

    const filteredUsers = (() => {
        if (activeTab === 'pending') {
            return pendingUsersList;
        }

        // Active Tab
        return users?.filter(user => user.is_approved) || [];
    })();

    // Inject Default Super Admin if none exists and we are on Active tab
    if (activeTab === 'active' && !filteredUsers.some(u => u.role === 'super_admin')) {
        filteredUsers.unshift({
            id: 'default-super-admin',
            name: 'Super Admin',
            email: 'admin@test.com',
            role: 'super_admin',
            is_approved: true,
            status: 'Active',
            share_percentage: 'N/A',
            created_at: new Date().toISOString()
        });
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="relative min-h-screen p-6 md:p-8 space-y-8">
            {/* Background */}
            <FloatingOrbs count={5} />
            <AnimatedGrid />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 space-y-8"
            >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                            <Shield className="w-9 h-9 text-indigo-400" />
                            Admin Management
                        </h1>
                        <p className="text-slate-400">Manage system administrators, roles, and access approvals.</p>
                    </div>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/25 hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        <span>+</span> Add New Admin
                    </button>
                </div>

                {/* Stats Cards Row (Matching Screenshot Vibe) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* E-commerce Admins Card */}
                    <PremiumCard className="p-6 bg-slate-800/50 border-slate-700/50">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                                <Users className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-slate-400 font-medium mb-1">E-commerce Admins</p>
                                <h3 className="text-3xl font-black text-white">
                                    {users?.filter(u => u.role === 'ecommerce_admin').length || 0}
                                    <span className="text-slate-500 text-lg font-normal ml-2">/ 5</span>
                                </h3>
                            </div>
                        </div>
                    </PremiumCard>

                    {/* Dev Admins Card */}
                    <PremiumCard className="p-6 bg-slate-800/50 border-slate-700/50">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <Shield className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-slate-400 font-medium mb-1">Dev Admins</p>
                                <h3 className="text-3xl font-black text-white">
                                    {users?.filter(u => u.role === 'dev_admin').length || 0}
                                    <span className="text-slate-500 text-lg font-normal ml-2">/ 5</span>
                                </h3>
                            </div>
                        </div>
                    </PremiumCard>

                    {/* Total Base Pool (Visual Only for now as per DB constraints) */}
                    <PremiumCard className="p-6 bg-gradient-to-br from-purple-600 to-pink-600 border-none relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        <div className="relative z-10">
                            <p className="text-purple-100 font-bold mb-2 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" /> TOTAL BASE POOL
                            </p>
                            <h3 className="text-4xl font-black text-white mb-2">$ 50,000</h3>
                            <p className="text-purple-200 text-sm">Shared Monthly Allocation</p>
                        </div>
                    </PremiumCard>
                </div>

                {/* Main Content Card */}
                <PremiumCard className="overflow-hidden min-h-[500px] flex flex-col">
                    {/* Tabs / Filter Bar */}
                    <div className="p-4 border-b border-slate-700/50 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/20">
                        <div className="flex bg-slate-900/50 rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab('active')}
                                className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'active'
                                    ? 'bg-slate-700 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                Active Users
                            </button>
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`px-6 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'pending'
                                    ? 'bg-amber-500/20 text-amber-400 shadow-lg'
                                    : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                Pending Approvals
                                {pendingUsers > 0 && (
                                    <span className="bg-amber-500 text-slate-900 text-[10px] px-1.5 py-0.5 rounded-full font-black">
                                        {pendingUsers}
                                    </span>
                                )}
                            </button>
                        </div>

                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-700/50 text-slate-400 text-xs uppercase tracking-wider">
                                    <th className="p-6 font-bold">Name</th>
                                    <th className="p-6 font-bold">Role</th>
                                    <th className="p-6 font-bold">Profit Share (%)</th>
                                    <th className="p-6 font-bold">Est. Salary</th>
                                    <th className="p-6 font-bold text-center">Status</th>
                                    <th className="p-6 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" className="p-12 text-center text-slate-500">
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-12 text-center text-slate-500">
                                            No {activeTab} users found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map(user => (
                                        <motion.tr
                                            key={user.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="group hover:bg-slate-800/30 transition-colors"
                                        >
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg">
                                                        {user.name?.[0]?.toUpperCase() || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white">{user.name}</div>
                                                        <div className="text-xs text-slate-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${user.role === 'super_admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                    user.role === 'marketing_head' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' :
                                                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                    }`}>
                                                    {user.role ? user.role.replace('_', ' ').toUpperCase() : 'STAFF'}
                                                </span>
                                            </td>
                                            <td className="p-6 text-slate-400 font-mono">
                                                {/* Visual Placeholder for functionality not yet in DB */}
                                                {user.share_percentage || 'N/A'}
                                            </td>
                                            <td className="p-6 text-slate-400 font-mono text-sm italic">
                                                Excluded
                                            </td>
                                            <td className="p-6 text-center">
                                                {user.is_approved || user.role === 'super_admin' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold shadow-lg shadow-emerald-500/10">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
                                                        <Clock className="w-3 h-3" />
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-6 text-right">
                                                {!user.is_approved && user.role !== 'super_admin' ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleApprove(user.id)}
                                                            className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
                                                            title="Approve"
                                                            disabled={actionLoading === user.id}
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleRevoke(user.id)}
                                                            className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                                                            title="Reject"
                                                            disabled={actionLoading === user.id}
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {user.role !== 'super_admin' && (
                                                            <>
                                                                <button className="p-2 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors">
                                                                    <Briefcase className="w-4 h-4" />
                                                                </button>
                                                                <button className="p-2 hover:bg-slate-700 text-slate-400 hover:text-red-400 rounded-lg transition-colors">
                                                                    <UserX className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </PremiumCard>
            </motion.div>

            {/* Add Admin Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
                            onClick={() => setIsAddModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-slate-800 border border-slate-700/50 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <UserCheck className="w-5 h-5 text-indigo-400" />
                                    Add New Admin
                                </h3>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <XCircle className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleAddAdminSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                                        placeholder="John Doe"
                                        value={newAdminData.name}
                                        onChange={e => setNewAdminData({ ...newAdminData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                                        placeholder="john@example.com"
                                        value={newAdminData.email}
                                        onChange={e => setNewAdminData({ ...newAdminData, email: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Role</label>
                                        <select
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                                            value={newAdminData.role}
                                            onChange={e => setNewAdminData({ ...newAdminData, role: e.target.value })}
                                        >
                                            <option value="staff">Staff Member</option>
                                            <option value="ecommerce_admin">E-commerce Admin</option>
                                            <option value="dev_admin">Developer Admin</option>
                                            <option value="marketing_head">Marketing Head</option>
                                            <option value="super_admin">Super Admin</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-300 text-xs">
                                    <p className="flex items-start gap-2">
                                        <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                                        This user will be pre-approved. They just need to sign up with this email to access their dashboard immediately.
                                    </p>
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="flex-1 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={actionLoading === 'add'}
                                        className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/25 hover:scale-[1.02] transition-transform disabled:opacity-70"
                                    >
                                        {actionLoading === 'add' ? 'Adding...' : 'Add Admin'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
