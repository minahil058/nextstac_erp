import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockDataService } from '../../../services/mockDataService';
import {
    MapPin,
    Plus,
    Search,
    Phone,
    User,
    MoreVertical,
    Trash2,
    AlertTriangle,
    Edit
} from 'lucide-react';


export default function BranchList() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        manager: '',
        address: '',
        phone: ''
    });

    const { data: branches, isLoading } = useQuery({
        queryKey: ['branches'],
        queryFn: mockDataService.getBranches,
    });

    const addBranchMutation = useMutation({
        mutationFn: (newBranch) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(mockDataService.addBranch(newBranch));
                }, 500);
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['branches']);
            setIsModalOpen(false);
            setFormData({ name: '', manager: '', address: '', phone: '' });
        }
    });

    const updateBranchMutation = useMutation({
        mutationFn: ({ id, updates }) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(mockDataService.updateBranch(id, updates));
                }, 500);
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['branches']);
            setIsModalOpen(false);
            setFormData({ name: '', manager: '', address: '', phone: '' });
            setEditingId(null);
        }
    });

    const deleteBranchMutation = useMutation({
        mutationFn: (id) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(mockDataService.deleteBranch(id));
                }, 300);
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['branches']);
            setDeleteId(null);
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(mockDataService.updateBranch(id, { status }));
                }, 300);
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['branches']);
        }
    });

    const handleStatusToggle = (branch) => {
        const newStatus = branch.status === 'Active' ? 'Inactive' : 'Active';
        updateStatusMutation.mutate({ id: branch.id, status: newStatus });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            updateBranchMutation.mutate({ id: editingId, updates: formData });
        } else {
            addBranchMutation.mutate(formData);
        }
    };

    const handleEdit = (branch) => {
        setFormData({
            name: branch.name,
            manager: branch.manager,
            address: branch.address,
            phone: branch.phone
        });
        setEditingId(branch.id);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: '', manager: '', address: '', phone: '' });
    };

    const filteredBranches = branches?.filter(branch =>
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.manager.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div className="p-8 text-center text-slate-400">Loading branches...</div>;

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white">Branches</h1>
                    <p className="text-slate-400 text-sm">Manage company locations and offices</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:scale-105 text-white rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg"
                >
                    <Plus className="w-4 h-4" />
                    New Branch
                </button>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl p-4 rounded-2xl border border-slate-700/50">
                <div className="relative">
                    <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search branches..."
                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-700/50 bg-slate-900/50 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-white placeholder-slate-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBranches?.map((branch) =>
                    <div key={branch.id} className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden hover:scale-105 hover:border-indigo-500/50 transition-all group">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl group-hover:shadow-lg transition-all">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(branch)}
                                        className="text-slate-400 hover:text-indigo-400 p-2 rounded-full hover:bg-indigo-500/10 transition-colors"
                                        title="Edit Branch"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(branch.id)}
                                        className="text-slate-400 hover:text-red-400 p-2 rounded-full hover:bg-red-500/10 transition-colors"
                                        title="Delete Branch"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-white mb-2">{branch.name}</h3>
                            <p className="text-sm text-slate-400 mb-4 h-10 line-clamp-2">{branch.address}</p>

                            <div className="space-y-3 pt-4 border-t border-slate-700/50">
                                <div className="flex items-center gap-3 text-sm text-slate-400">
                                    <User className="w-4 h-4" />
                                    <span>Manager: <span className="font-semibold text-white">{branch.manager}</span></span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-400">
                                    <Phone className="w-4 h-4" />
                                    <span>{branch.phone}</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-700/30 px-6 py-3 border-t border-slate-700/50 flex justify-between items-center text-sm">
                            <span className="text-slate-400">Status</span>
                            <button
                                onClick={() => handleStatusToggle(branch)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${branch.status === 'Active'
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                                    : 'bg-slate-600/20 text-slate-400 border-slate-600/30 hover:bg-slate-600/30'
                                    }`}
                            >
                                {branch.status}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-700/50">
                        <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-gradient-to-r from-indigo-600/20 to-purple-600/20">
                            <h2 className="text-xl font-black text-white">{editingId ? 'Edit Branch' : 'Add New Branch'}</h2>
                            <button onClick={handleClose} className="text-slate-400 hover:text-slate-600">
                                <span className="sr-only">Close</span>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Branch Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Downtown Office"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Address</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="e.g. 123 Main St, City"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Manager Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={formData.manager}
                                    onChange={e => setFormData({ ...formData, manager: e.target.value })}
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Phone</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="e.g. (555) 123-4567"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={addBranchMutation.isPending || updateBranchMutation.isPending}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-70 flex items-center gap-2"
                                >
                                    {(addBranchMutation.isPending || updateBranchMutation.isPending) ? 'Saving...' : (editingId ? 'Save Changes' : 'Create Branch')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-700/50">
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400 border border-red-500/30">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-white mb-2">Delete Branch?</h3>
                            <p className="text-slate-400 text-sm mb-6">
                                Are you sure you want to delete this branch? This action cannot be undone.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => setDeleteId(null)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => deleteBranchMutation.mutate(deleteId)}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-70"
                                    disabled={deleteBranchMutation.isPending}
                                >
                                    {deleteBranchMutation.isPending ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
