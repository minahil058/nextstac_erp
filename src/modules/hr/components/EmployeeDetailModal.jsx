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

    // Custom simpler variants to avoid "double" feel of scale + fade
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
                        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] relative z-10"
                        variants={simpleModalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Header */}
                        {/* Header */}
                        {/* Header */}
                        {/* Header */}
                        <div className="relative h-48 bg-slate-900 group">
                            {/* Background Image - Centered for Logo Visibility */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: `url(${nextstacBanner})` }}
                            />
                            {/* Gradient Overlay - Dark at bottom for text contrast, clear at top for Logo */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10 backdrop-blur-sm"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Large Left Aligned Avatar */}
                            <div className="absolute -bottom-16 left-8 z-20">
                                <Avatar className="h-32 w-32 ring-4 ring-white shadow-2xl">
                                    <AvatarImage src={employee.avatar} alt={employee.firstName} className="object-cover" />
                                    <AvatarFallback className="text-3xl bg-slate-100 font-bold text-slate-700">{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
                                </Avatar>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="pt-20 pb-8 px-8 flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">

                            {/* Hero Section (Name & Role) - Indented to right of Avatar */}
                            <div className="flex justify-between items-start mb-8 pl-40">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-900 leading-tight">{employee.firstName} {employee.lastName}</h2>
                                    <p className="text-slate-500 font-medium text-lg">{employee.position}</p>
                                </div>
                                <Badge className={`px-4 py-1.5 text-sm font-semibold border ${getStatusVariant(employee.status)}`}>
                                    {employee.status}
                                </Badge>
                            </div>

                            {/* Tabs Navigation - Modern Pills */}
                            <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-xl w-fit">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'overview' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab('leave')}
                                    className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'leave' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Leave Status
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="space-y-6">
                                {activeTab === 'overview' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100/50 shadow-sm hover:shadow-md transition-shadow space-y-5">
                                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-3">
                                                <User className="w-4 h-4 text-indigo-500" /> Professional Details
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                                        <Briefcase className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Department</p>
                                                        <p className="font-semibold text-slate-900 mt-0.5">{employee.department}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-4">
                                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                                        <Calendar className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Date of Joining</p>
                                                        <p className="font-semibold text-slate-900 mt-0.5">{new Date(employee.joinDate).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-4">
                                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-xs flex items-center justify-center w-8 h-8">
                                                        $
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Salary</p>
                                                        <p className="font-semibold text-slate-900 mt-0.5">${Number(employee.salary).toLocaleString()}/yr</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100/50 shadow-sm hover:shadow-md transition-shadow space-y-5">
                                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-3">
                                                <Phone className="w-4 h-4 text-indigo-500" /> Contact Info
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                                        <Mail className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Email Address</p>
                                                        <p className="font-semibold text-slate-900 mt-0.5 break-all">{employee.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-4">
                                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                                        <Phone className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Phone Number</p>
                                                        <p className="font-semibold text-slate-900 mt-0.5">{employee.phone}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-4">
                                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                                        <MapPin className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Address</p>
                                                        <p className="font-semibold text-slate-900 mt-0.5 text-balance">{employee.address}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-full border-t border-slate-100 pt-4 mt-2">
                                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-4">
                                                <ShieldAlert className="w-4 h-4 text-red-500" /> Emergency Contact
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                                <div>
                                                    <p className="text-xs text-slate-500">Name</p>
                                                    <p className="font-semibold text-slate-900">{employee.emergencyContact?.name || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">Relation</p>
                                                    <p className="font-semibold text-slate-900">{employee.emergencyContact?.relation || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">Phone</p>
                                                    <p className="font-semibold text-slate-900">{employee.emergencyContact?.phone || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'leave' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Clock className="w-5 h-5 text-blue-600" />
                                                    <span className="font-semibold text-blue-900">Casual Leave</span>
                                                </div>
                                                <p className="text-3xl font-bold text-blue-700">{employee.leaveBalance?.casual || 0}</p>
                                                <p className="text-xs text-blue-600 mt-1">Days Remaining</p>
                                            </div>
                                            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <HeartPulse className="w-5 h-5 text-purple-600" />
                                                    <span className="font-semibold text-purple-900">Sick Leave</span>
                                                </div>
                                                <p className="text-3xl font-bold text-purple-700">{employee.leaveBalance?.sick || 0}</p>
                                                <p className="text-xs text-purple-600 mt-1">Days Remaining</p>
                                            </div>
                                            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Calendar className="w-5 h-5 text-amber-600" />
                                                    <span className="font-semibold text-amber-900">Annual Leave</span>
                                                </div>
                                                <p className="text-3xl font-bold text-amber-700">{employee.leaveBalance?.annual || 0}</p>
                                                <p className="text-xs text-amber-600 mt-1">Days Remaining</p>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 rounded-xl p-6 text-center border border-slate-200">
                                            <p className="text-slate-500 text-sm">Detailed leave history is available in the <span className="font-semibold text-indigo-600">Leave Management</span> module.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
