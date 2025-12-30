import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockDataService } from '../../../services/mockDataService';
import {
    ArrowUpRight,
    ArrowDownLeft,
    Search,
    Filter,
    History,
    Plus,
    Trash2,
    Edit // Import Edit icon
} from 'lucide-react';
import ConfirmationModal from '../../../components/ConfirmationModal';


import StockAdjustmentModal from '../components/StockAdjustmentModal';

export default function StockMovements() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [movementToEdit, setMovementToEdit] = useState(null); // Edit State

    // Delete Confirmation State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [movementToDelete, setMovementToDelete] = useState(null);

    // Filters
    const [typeFilter, setTypeFilter] = useState('All');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const types = ['All', 'In', 'Out', 'Adjustment'];

    const { data: movements, isLoading } = useQuery({
        queryKey: ['stock_movements'],
        queryFn: mockDataService.getStockMovements,
    });

    const deleteMovementMutation = useMutation({
        mutationFn: (id) => new Promise(resolve => setTimeout(() => resolve(mockDataService.deleteStockMovement(id)), 300)),
        onSuccess: () => {
            queryClient.invalidateQueries(['stock_movements']);
            setIsDeleteModalOpen(false);
            setMovementToDelete(null);
        }
    });

    const addMovementMutation = useMutation({
        mutationFn: (data) => new Promise(resolve => setTimeout(() => resolve(mockDataService.addStockMovement(data)), 300)),
        onSuccess: () => {
            queryClient.invalidateQueries(['stock_movements']);
            setIsModalOpen(false);
        }
    });

    const updateMovementMutation = useMutation({
        mutationFn: ({ id, data }) => new Promise(resolve => setTimeout(() => resolve(mockDataService.updateStockMovement(id, data)), 300)),
        onSuccess: () => {
            queryClient.invalidateQueries(['stock_movements']);
            setIsModalOpen(false);
            setMovementToEdit(null);
        }
    });

    const handleDeleteClick = (movement) => {
        setMovementToDelete(movement);
        setIsDeleteModalOpen(true);
    };

    const handleEditClick = (movement) => {
        setMovementToEdit(movement);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setMovementToEdit(null);
    };

    const handleModalSubmit = (data) => {
        if (movementToEdit) {
            updateMovementMutation.mutate({ id: movementToEdit.id, data });
        } else {
            addMovementMutation.mutate(data);
        }
    };

    const handleConfirmDelete = () => {
        if (movementToDelete) {
            deleteMovementMutation.mutate(movementToDelete.id);
        }
    };

    const filteredMovements = movements?.filter(m => {
        const matchesSearch = m.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.reference.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'All' || m.type === typeFilter;
        return matchesSearch && matchesType;
    });

    if (isLoading) return <div className="p-8 text-center text-slate-400">Loading stock history...</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen"
        >
            <StockAdjustmentModal
                key={movementToEdit ? movementToEdit.id : 'new-entry'}
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                initialData={movementToEdit}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Log?"
                message={`Are you sure you want to delete this stock movement log (${movementToDelete?.reference})?`}
                confirmText={deleteMovementMutation.isPending ? "Deleting..." : "Delete Log"}
                variant="danger"
            />

            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Stock Movements</h2>
                        <p className="text-slate-400 text-sm mt-1">Track inventory logs and transfers</p>
                    </div>
                    <button
                        onClick={() => {
                            setMovementToEdit(null);
                            setIsModalOpen(true);
                        }}
                        className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-teal-500/20 active:scale-95 border border-teal-400/20">
                        <Plus className="w-4 h-4" />
                        New Adjustment
                    </button>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl p-4 rounded-2xl border border-slate-700/50 shadow-xl flex flex-col md:flex-row gap-4 relative z-30">
                    <div className="relative flex-1">
                        <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by product or reference..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-700/50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-slate-200 placeholder:text-slate-500 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Type Filter */}
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`px-4 py-2.5 border rounded-xl flex items-center gap-2 font-medium transition-all ${typeFilter !== 'All'
                                ? 'border-teal-500/50 text-teal-400 bg-teal-500/10'
                                : 'border-slate-700/50 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                                }`}
                        >
                            <Filter className="w-4 h-4" />
                            {typeFilter === 'All' ? 'Movement Type' : typeFilter}
                        </button>

                        {isFilterOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                                    {types.map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => {
                                                setTypeFilter(type);
                                                setIsFilterOpen(false);
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${typeFilter === type
                                                ? 'bg-teal-500/20 text-teal-300'
                                                : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                                                }`}
                                        >
                                            {type}
                                            {typeFilter === type && (
                                                <div className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-900/50 border-b border-slate-700/50">
                                <tr>
                                    <th className="px-6 py-5 font-bold text-slate-400 uppercase tracking-widest text-xs">Date</th>
                                    <th className="px-6 py-5 font-bold text-slate-400 uppercase tracking-widest text-xs">Reference</th>
                                    <th className="px-6 py-5 font-bold text-slate-400 uppercase tracking-widest text-xs">Product</th>
                                    <th className="px-6 py-5 font-bold text-slate-400 uppercase tracking-widest text-xs">Type</th>
                                    <th className="px-6 py-5 font-bold text-slate-400 uppercase tracking-widest text-xs">Quantity</th>
                                    <th className="px-6 py-5 font-bold text-slate-400 uppercase tracking-widest text-xs">Warehouse</th>
                                    <th className="px-6 py-5 font-bold text-slate-400 uppercase tracking-widest text-xs text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {filteredMovements?.map((move, index) => (
                                    <motion.tr
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                        key={move.id}
                                        className="hover:bg-slate-700/30 transition-colors group"
                                    >
                                        <td className="px-6 py-4 text-slate-400 font-mono text-xs tracking-wider">
                                            {new Date(move.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-teal-400">
                                            {move.reference}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-200">
                                            {move.productName}
                                        </td>
                                        <td className="px-6 py-4">
                                            {move.type === 'In' ? (
                                                <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg w-fit text-xs border border-emerald-500/20">
                                                    <ArrowDownLeft className="w-3.5 h-3.5" /> In
                                                </span>
                                            ) : move.type === 'Out' ? (
                                                <span className="flex items-center gap-1.5 text-rose-400 font-bold bg-rose-500/10 px-2.5 py-1 rounded-lg w-fit text-xs border border-rose-500/20">
                                                    <ArrowUpRight className="w-3.5 h-3.5" /> Out
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg w-fit text-xs border border-amber-500/20">
                                                    <History className="w-3.5 h-3.5" /> {move.type}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-200">
                                            {move.quantity}
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">
                                            {move.warehouse}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(move)}
                                                    className="text-slate-500 hover:text-indigo-400 p-2 hover:bg-indigo-500/10 rounded-lg transition-all active:scale-90"
                                                    title="Edit Log"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(move)}
                                                    className="text-slate-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-all active:scale-90"
                                                    title="Delete Log"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
