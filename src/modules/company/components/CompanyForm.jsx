import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Building2, Globe, FileText, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CompanyForm = ({ isOpen, onClose, initialData, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        legalName: '',
        email: '',
        phone: '',
        website: '',
        description: '',
        taxId: '',
        vatNumber: '',
        techStack: '', // Handle as comma-separated string for simpler editing
        headquarters: {
            street: '',
            city: '',
            state: '',
            zip: '',
            country: ''
        }
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                techStack: initialData.techStack ? initialData.techStack.join(', ') : '',
                headquarters: initialData.headquarters || { street: '', city: '', state: '', zip: '', country: '' }
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submissionData = {
            ...formData,
            techStack: formData.techStack.split(',').map(s => s.trim()).filter(s => s)
        };
        onSave(submissionData);
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10 backdrop-blur-xl">
                            <div>
                                <h2 className="text-xl font-bold text-white tracking-tight">Edit Company Profile</h2>
                                <p className="text-sm text-slate-400 mt-1">Update your organization's details</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-8">

                            {/* Basic Info */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                                    <Building2 className="w-4 h-4" /> Identity
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Company Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-slate-600 transition-all text-sm font-medium"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Legal Name</label>
                                        <input
                                            type="text"
                                            name="legalName"
                                            value={formData.legalName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-slate-600 transition-all text-sm font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-slate-600 transition-all text-sm font-medium"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Phone</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-slate-600 transition-all text-sm font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                                    <Globe className="w-4 h-4" /> Headquarters
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Street Address</label>
                                        <input
                                            type="text"
                                            name="headquarters.street"
                                            value={formData.headquarters.street}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-slate-600 transition-all text-sm font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">City</label>
                                        <input
                                            type="text"
                                            name="headquarters.city"
                                            value={formData.headquarters.city}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-slate-600 transition-all text-sm font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">State</label>
                                        <input
                                            type="text"
                                            name="headquarters.state"
                                            value={formData.headquarters.state}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-slate-600 transition-all text-sm font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Zip Code</label>
                                        <input
                                            type="text"
                                            name="headquarters.zip"
                                            value={formData.headquarters.zip}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-slate-600 transition-all text-sm font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Country</label>
                                        <input
                                            type="text"
                                            name="headquarters.country"
                                            value={formData.headquarters.country}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-slate-600 transition-all text-sm font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Tech & Description */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> Details
                                </h3>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-slate-600 transition-all text-sm font-medium resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Tech Stack (Comma separated)</label>
                                    <div className="relative">
                                        <Code className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            name="techStack"
                                            value={formData.techStack}
                                            onChange={handleChange}
                                            placeholder="React, Node.js, Python..."
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-slate-600 transition-all text-sm font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                        </form>

                        <div className="p-6 border-t border-slate-800 flex justify-end gap-3 sticky bottom-0 bg-slate-900/95 backdrop-blur-xl">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 text-slate-300 font-bold hover:bg-slate-800 rounded-xl transition-colors text-sm border border-transparent hover:border-slate-700"
                            >
                                Cancel
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSubmit}
                                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all flex items-center gap-2 text-sm shadow-lg shadow-indigo-500/25"
                            >
                                <Save className="w-4 h-4" /> Save Changes
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default CompanyForm;
