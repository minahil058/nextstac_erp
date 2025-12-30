import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save } from 'lucide-react';

export default function EmployeeForm({ isOpen, onClose, onSubmit, initialData = null }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        position: '',
        department: '',
        salary: '',
        status: 'Active',
        phone: '',
        address: '',
        joinDate: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                position: '',
                department: '',
                salary: '',
                status: 'Active',
                phone: '',
                address: '',
                joinDate: new Date().toISOString().split('T')[0]
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <div className="bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 border border-slate-700/50 overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-slate-700/50 bg-slate-900/50 shrink-0">
                    <h2 className="text-xl font-bold text-white">
                        {initialData ? 'Edit Employee' : 'Add New Employee'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-700/50 bg-slate-800/50 text-white rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none placeholder-slate-500 transition-all shadow-inner"
                                placeholder="John"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-700/50 bg-slate-800/50 text-white rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none placeholder-slate-500 transition-all shadow-inner"
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-slate-700/50 bg-slate-800/50 text-white rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none placeholder-slate-500 transition-all shadow-inner"
                            placeholder="john.doe@company.com"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300">Department</label>
                            <input
                                type="text"
                                name="department"
                                required
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-700/50 bg-slate-800/50 text-white rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none placeholder-slate-500 transition-all shadow-inner"
                                placeholder="Engineering"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300">Position</label>
                            <input
                                type="text"
                                name="position"
                                required
                                value={formData.position}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-700/50 bg-slate-800/50 text-white rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none placeholder-slate-500 transition-all shadow-inner"
                                placeholder="Developer"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-700/50 bg-slate-800/50 text-white rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none placeholder-slate-500 transition-all shadow-inner"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300">Join Date</label>
                            <input
                                type="date"
                                name="joinDate"
                                required
                                value={formData.joinDate ? formData.joinDate.split('T')[0] : ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300">Address</label>
                        <input
                            type="text"
                            name="address"
                            required
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none placeholder-slate-500"
                            placeholder="123 Main St, New York, USA"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300">Salary</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-slate-500">$</span>
                                <input
                                    type="number"
                                    name="salary"
                                    required
                                    value={formData.salary}
                                    onChange={handleChange}
                                    className="w-full pl-7 pr-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none placeholder-slate-500"
                                    placeholder="50000"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none"
                            >
                                <option value="Active">Active</option>
                                <option value="On Leave">On Leave</option>
                                <option value="Terminated">Terminated</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white font-medium rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center gap-2 border-0"
                        >
                            <Save className="w-4 h-4" />
                            {initialData ? 'Update Employee' : 'Add Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
