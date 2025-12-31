import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, User, Building, Mail, Phone, DollarSign, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LeadFormModal({ isOpen, onClose, onSubmit, initialData }) {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        value: '',
        source: 'Website'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                company: initialData.company || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                value: initialData.value || '',
                source: initialData.source || 'Website'
            });
        } else {
            setFormData({
                name: '',
                company: '',
                email: '',
                phone: '',
                value: '',
                source: 'Website'
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            value: Number(formData.value)
        });
        onClose();
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 flex flex-col max-h-[90vh]"
                    >
                        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 sticky top-0 z-10 backdrop-blur-xl">
                            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                <User className="w-5 h-5 text-indigo-400" />
                                {initialData ? 'Edit Lead' : 'Add New Lead'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="overflow-y-auto custom-scrollbar">
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5" /> Full Name
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-3 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-slate-500 transition-all font-medium"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                                            <Building className="w-3.5 h-3.5" /> Company
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-3 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-slate-500 transition-all font-medium"
                                            placeholder="Acme Inc."
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                                            <Mail className="w-3.5 h-3.5" /> Email
                                        </label>
                                        <input
                                            required
                                            type="email"
                                            className="w-full px-3 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-slate-500 transition-all font-medium"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                                            <Phone className="w-3.5 h-3.5" /> Phone
                                        </label>
                                        <input
                                            required
                                            type="tel"
                                            className="w-full px-3 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-slate-500 transition-all font-medium"
                                            placeholder="+1 234 567 890"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                                            <DollarSign className="w-3.5 h-3.5" /> Est. Value ($)
                                        </label>
                                        <input
                                            required
                                            type="number"
                                            min="0"
                                            className="w-full px-3 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-slate-500 transition-all font-medium"
                                            placeholder="5000"
                                            value={formData.value}
                                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                                            <Target className="w-3.5 h-3.5" /> Source
                                        </label>
                                        <select
                                            className="w-full px-3 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white transition-all font-medium appearance-none"
                                            value={formData.source}
                                            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                        >
                                            <option value="Website">Website</option>
                                            <option value="Referral">Referral</option>
                                            <option value="Social Media">Social Media</option>
                                            <option value="Cold Call">Cold Call</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-end gap-3 sticky bottom-0 bg-slate-900/95 backdrop-blur pb-2 border-t border-slate-800 mt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-300 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <Save className="w-4 h-4" />
                                        {initialData ? 'Save Changes' : 'Add Lead'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}

