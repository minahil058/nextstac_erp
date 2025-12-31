import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
    X,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Calendar,
    User,
    HeartPulse,
    Clock,
    ShieldAlert
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { AnimatePresence, motion } from 'framer-motion';
import { modalVariants, backdropVariants } from '../../../components/ui/animations';

import nextstacBanner from '../../../assets/nextstac.png';

// ... imports remain the same

export default function EmployeeDetailModal({ isOpen, onClose, employee }) {
    const [activeTab, setActiveTab] = useState('overview');

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'On Leave': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Terminated': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    // ... variants remain the same (lines 33-45)
    const simpleModalVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.2, ease: "easeOut" }
        },
        exit: {
            opacity: 0,
            y: 20,
            transition: { duration: 0.15, ease: "easeIn" }
        }
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && employee && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <motion.div
                        key="backdrop"
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    />
                    <motion.div
                        key="modal-content"
                        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] relative z-10"
                        variants={simpleModalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Header Banner */}
                        <div className="relative h-48 bg-slate-900 shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                            <img
                                src={nextstacBanner}
                                alt="Banner"
                                className="w-full h-full object-cover object-top opacity-90"
                            />

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-20 backdrop-blur-md"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Profile Info Section (Overlapping) */}
                        <div className="px-8 -mt-16 relative z-20 flex flex-col sm:flex-row items-end sm:items-end gap-6 mb-8">
                            {/* Avatar */}
                            <Avatar className="h-32 w-32 border-4 border-white shadow-2xl ring-4 ring-slate-50 shrink-0 bg-white">
                                <AvatarImage src={employee.avatar} alt={employee.firstName} className="object-cover" />
                                <AvatarFallback className="text-3xl bg-slate-100 font-bold text-indigo-600">{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
                            </Avatar>

                            {/* Name & Role */}
                            <div className="flex-1 pb-2 text-center sm:text-left">
                                <h2 className="text-3xl font-bold text-slate-900 mb-1">{employee.firstName} {employee.lastName}</h2>
                                <div className="flex items-center justify-center sm:justify-start gap-3">
                                    <p className="text-lg text-slate-500 font-medium">{employee.position}</p>
                                    <Badge className={`px-2.5 py-0.5 text-xs font-semibold border ${getStatusVariant(employee.status)}`}>
                                        {employee.status}
                                    </Badge>
                                </div>
                            </div>

                            {/* Tabs (Right aligned or simply placed) */}
                            <div className="pb-3 hidden sm:block">
                                {/* Can place actions here if needed */}
                            </div>
                        </div>

                        {/* Body Content */}
                        <div className="px-8 pb-8 flex-1 overflow-y-auto">

                            {/* Tabs Navigation */}
                            <div className="flex gap-2 border-b border-slate-200 mb-6 w-full">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`px-6 py-2.5 text-sm font-semibold border-b-2 transition-all ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                                >
                                    Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab('leave')}
                                    className={`px-6 py-2.5 text-sm font-semibold border-b-2 transition-all ${activeTab === 'leave' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                                >
                                    Leave Status
                                </button>
                            </div>

                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'overview' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Professional Details Card */}
                                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 hover:shadow-sm transition-shadow">
                                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                <Briefcase className="w-4 h-4 text-indigo-500" /> Professional Details
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="group">
                                                    <p className="text-xs text-slate-500 mb-1">Department</p>
                                                    <p className="font-semibold text-slate-900">{employee.department}</p>
                                                </div>
                                                <div className="group">
                                                    <p className="text-xs text-slate-500 mb-1">Date of Joining</p>
                                                    <p className="font-semibold text-slate-900">{new Date(employee.joinDate).toLocaleDateString()}</p>
                                                </div>
                                                <div className="group">
                                                    <p className="text-xs text-slate-500 mb-1">Annual Salary</p>
                                                    <p className="font-semibold text-slate-900">${Number(employee.salary).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Info Card */}
                                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 hover:shadow-sm transition-shadow">
                                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-indigo-500" /> Contact Information
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="group">
                                                    <p className="text-xs text-slate-500 mb-1">Email Address</p>
                                                    <a href={`mailto:${employee.email}`} className="font-semibold text-indigo-600 hover:underline break-all">{employee.email}</a>
                                                </div>
                                                <div className="group">
                                                    <p className="text-xs text-slate-500 mb-1">Phone Number</p>
                                                    <p className="font-semibold text-slate-900">{employee.phone}</p>
                                                </div>
                                                <div className="group">
                                                    <p className="text-xs text-slate-500 mb-1">Address</p>
                                                    <p className="font-semibold text-slate-900">{employee.address}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Emergency Contact */}
                                        <div className="md:col-span-2 bg-red-50/50 rounded-xl p-6 border border-red-100/50">
                                            <h3 className="text-xs font-bold text-red-800/60 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                <ShieldAlert className="w-4 h-4 text-red-500" /> Emergency Contact
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                                <div>
                                                    <p className="text-xs text-slate-500 mb-1">Contact Name</p>
                                                    <p className="font-semibold text-slate-900">{employee.emergencyContact?.name || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 mb-1">Relation</p>
                                                    <p className="font-semibold text-slate-900">{employee.emergencyContact?.relation || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 mb-1">Phone</p>
                                                    <p className="font-semibold text-slate-900">{employee.emergencyContact?.phone || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'leave' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col items-center justify-center text-center group hover:bg-blue-100/50 transition-colors">
                                                <div className="mb-3 p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                                                    <Clock className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <p className="text-sm font-semibold text-blue-900 mb-1">Casual Leave</p>
                                                <p className="text-3xl font-bold text-blue-700">{employee.leaveBalance?.casual || 0}</p>
                                                <p className="text-xs text-blue-500 mt-1">Days Available</p>
                                            </div>
                                            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 flex flex-col items-center justify-center text-center group hover:bg-purple-100/50 transition-colors">
                                                <div className="mb-3 p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                                                    <HeartPulse className="w-6 h-6 text-purple-600" />
                                                </div>
                                                <p className="text-sm font-semibold text-purple-900 mb-1">Sick Leave</p>
                                                <p className="text-3xl font-bold text-purple-700">{employee.leaveBalance?.sick || 0}</p>
                                                <p className="text-xs text-purple-500 mt-1">Days Available</p>
                                            </div>
                                            <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 flex flex-col items-center justify-center text-center group hover:bg-amber-100/50 transition-colors">
                                                <div className="mb-3 p-3 bg-amber-100 rounded-full group-hover:bg-amber-200 transition-colors">
                                                    <Calendar className="w-6 h-6 text-amber-600" />
                                                </div>
                                                <p className="text-sm font-semibold text-amber-900 mb-1">Annual Leave</p>
                                                <p className="text-3xl font-bold text-amber-700">{employee.leaveBalance?.annual || 0}</p>
                                                <p className="text-xs text-amber-500 mt-1">Days Available</p>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center">
                                            <p className="text-slate-500 text-sm">Full leave history and approvals are managed in the <span className="font-semibold text-indigo-600">Leave Management</span> module.</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
