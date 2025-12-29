import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockDataService } from '../../../services/mockDataService';
import {
    Building2,
    Plus,
    Search,
    Users,
    DollarSign,
    MoreVertical,
    Trash2,
    AlertTriangle,
    Edit
} from 'lucide-react';


export default function DepartmentList() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        head: '',
        budget: ''
    });

    const { data: departments, isLoading } = useQuery({
        queryKey: ['departments'],
        queryFn: mockDataService.getDepartments,
    });

    const addDepartmentMutation = useMutation({
        mutationFn: (newDept) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(mockDataService.addDepartment(newDept));
                }, 500);
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['departments']);
            setIsModalOpen(false);
            setFormData({ name: '', head: '', budget: '' });
        }
    });

    const updateDepartmentMutation = useMutation({
        mutationFn: ({ id, updates }) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(mockDataService.updateDepartment(id, updates));
                }, 500);
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['departments']);
            setIsModalOpen(false);
            setFormData({ name: '', head: '', budget: '' });
            setEditingId(null);
        }
    });

    const deleteDepartmentMutation = useMutation({
        mutationFn: (id) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(mockDataService.deleteDepartment(id));
                }, 300);
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['departments']);
            setDeleteId(null);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            ...formData,
            budget: parseFloat(formData.budget) || 0
        };

        if (editingId) {
            updateDepartmentMutation.mutate({ id: editingId, updates: data });
        } else {
            addDepartmentMutation.mutate(data);
        }
    };

    const handleEdit = (dept) => {
        setFormData({
            name: dept.name,
            head: dept.head,
            budget: dept.budget
        });
        setEditingId(dept.id);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: '', head: '', budget: '' });
    };

    const filteredDepartments = departments?.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.head.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div className="p-8 text-center text-slate-400">Loading departments...</div>;

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white">Departments</h1>
                    <p className="text-slate-400 text-sm">Manage organizational structure and budgets</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:scale-105 text-white rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg"
                >
                    <Plus className="w-4 h-4" />
                    New Department
                </button>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl p-4 rounded-2xl border border-slate-700/50">
                <div className="relative">
                    <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search departments..."
                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-700/50 bg-slate-900/50 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-white placeholder-slate-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDepartments?.map((dept) => (
                    <div key={dept.id} className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl p-6 hover:scale-105 hover:border-indigo-500/50 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl group-hover:shadow-lg transition-all">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(dept)}
                                    className="text-slate-400 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-colors"
                                    title="Edit Department"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setDeleteId(dept.id)}
                                    className="text-slate-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                                    title="Delete Department"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl font-black text-white mb-1">{dept.name}</h3>
                        <p className="text-sm text-slate-400 mb-4">Head: {dept.head}</p>

                        <div className="space-y-3 pt-4 border-t border-slate-700/50">
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2 text-slate-400">
                                    <Users className="w-4 h-4" />
                                    Employees
                                </span>
                                <span className="font-bold text-white">{dept.employeeCount}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2 text-slate-400">
                                    <DollarSign className="w-4 h-4" />
                                    Budget
                                </span>
                                <span className="font-bold text-emerald-400">${dept.budget.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-800">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                            <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Department' : 'Add New Department'}</h2>
                            <button onClick={handleClose} className="text-slate-400 hover:text-white transition-colors">
                                <span className="sr-only">Close</span>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Department Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all text-white placeholder-slate-500"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Marketing"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Department Head</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all text-white placeholder-slate-500"
                                    value={formData.head}
                                    onChange={e => setFormData({ ...formData, head: e.target.value })}
                                    placeholder="e.g. Jane Smith"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Annual Budget</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                    <input
                                        type="number"
                                        required
                                        className="w-full pl-8 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all text-white placeholder-slate-500"
                                        value={formData.budget}
                                        onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                        placeholder="500000"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-800 mt-6">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={addDepartmentMutation.isPending || updateDepartmentMutation.isPending}
                                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all disabled:opacity-70 flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                                >
                                    {(addDepartmentMutation.isPending || updateDepartmentMutation.isPending) ? 'Saving...' : (editingId ? 'Save Changes' : 'Create Department')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-800">
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 border border-red-500/30 shadow-lg shadow-red-500/10">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Delete Department?</h3>
                            <p className="text-slate-400 text-sm mb-6">
                                Are you sure you want to delete this department? This action cannot be undone.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => setDeleteId(null)}
                                    className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => deleteDepartmentMutation.mutate(deleteId)}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition-colors disabled:opacity-70 shadow-lg shadow-red-600/20"
                                    disabled={deleteDepartmentMutation.isPending}
                                >
                                    {deleteDepartmentMutation.isPending ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
