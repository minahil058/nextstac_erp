import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import {
    Clock,
    Calendar,
    FileText,
    CheckCircle,
    Briefcase,
    Coffee,
    Sparkles,
    AlertCircle,
    ArrowRight,
    X
} from 'lucide-react';
import { FloatingOrbs, AnimatedGrid } from '../../../components/shared/BackgroundEffects';
import { PremiumCard, PremiumButton, StatCard } from '../../../components/shared/PremiumComponents';

export default function EmployeeDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRequest, setNewRequest] = useState({
        type: 'Sick Leave',
        startDate: '',
        endDate: '',
        reason: ''
    });

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const { data: attendance = [] } = useQuery({
        queryKey: ['attendance'],
        queryFn: async () => {
            try {
                return await api.get('/hr/attendance');
            } catch (e) {
                console.error('Failed to fetch attendance:', e);
                return [];
            }
        }
    });

    const { data: leaves = [] } = useQuery({
        queryKey: ['leaves'],
        queryFn: async () => {
            try {
                return await api.get('/hr/leaves');
            } catch (e) {
                console.error('Failed to fetch leaves:', e);
                return [];
            }
        }
    });

    // Create New Request (Employee)
    const createRequestMutation = useMutation({
        mutationFn: async (requestData) => {
            return await api.post('/hr/leaves', {
                employeeId: user.id,
                employeeName: user.name,
                email: user.email,
                department: user.department,
                ...requestData
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['leaves']);
            setIsModalOpen(false);
            setNewRequest({ type: 'Sick Leave', startDate: '', endDate: '', reason: '' });
            alert("Leave request submitted successfully!");
        },
        onError: (error) => {
            alert("Failed to submit request: " + error.message);
        }
    });

    const handleSubmitRequest = (e) => {
        e.preventDefault();
        createRequestMutation.mutate(newRequest);
    };

    // Filter for "my" records (assuming backend already filters or we do it here if needed)
    const myAttendance = attendance?.slice(0, 5) || [];
    const myLeaves = leaves?.slice(0, 3) || []; // Show simplified list

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

    return (
        <div className="relative min-h-screen">
            <FloatingOrbs count={8} />
            <AnimatedGrid />

            <motion.div
                className="relative z-10 p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                            <Sparkles className="w-8 h-8 text-indigo-400" />
                            Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 18 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]}
                        </h1>
                        <p className="text-slate-400">Here is your daily activity overview.</p>
                    </div>
                    <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-lg">
                        <Clock className="w-5 h-5 text-indigo-400 animate-pulse" />
                        <span className="font-mono text-xl font-bold text-white tracking-widest">
                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </motion.div>

                {/* Main Stats Grid */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Clock In Status Card */}
                    <motion.div
                        className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-2xl shadow-indigo-900/40 relative overflow-hidden group"
                        whileHover={{ y: -4 }}
                    >
                        <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner border border-white/10">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-100 border border-emerald-500/30 rounded-full text-xs font-bold backdrop-blur-sm flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                On Time
                            </span>
                        </div>
                        <div className="space-y-1 mb-8 relative z-10">
                            <p className="text-indigo-200 text-sm font-medium tracking-wide uppercase">Current Status</p>
                            <h3 className="text-3xl font-black tracking-tight">Checked In</h3>
                            <p className="text-indigo-200 text-sm mt-1 flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5" />
                                Since 09:00 AM
                            </p>
                        </div>
                        <button className="w-full py-3 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2">
                            Check Out Now
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.div>

                    {/* Leave Balance */}
                    <PremiumCard className="p-6 flex flex-col justify-between group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-orange-500/20 text-orange-400 rounded-2xl border border-orange-500/20 group-hover:bg-orange-500/30 transition-colors">
                                <Coffee className="w-6 h-6" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4">Leave Balance</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                    <p className="text-slate-400 text-xs font-medium mb-1">Casual</p>
                                    <p className="text-2xl font-bold text-white">8 <span className="text-xs text-slate-500 font-normal">/ 12</span></p>
                                </div>
                                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                    <p className="text-slate-400 text-xs font-medium mb-1">Sick</p>
                                    <p className="text-2xl font-bold text-white">5 <span className="text-xs text-slate-500 font-normal">/ 7</span></p>
                                </div>
                            </div>
                        </div>
                    </PremiumCard>

                    {/* Upcoming Holiday */}
                    <PremiumCard className="p-6 flex flex-col justify-between group bg-gradient-to-br from-slate-900 to-pink-900/20">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-pink-500/20 text-pink-400 rounded-2xl border border-pink-500/20 group-hover:bg-pink-500/30 transition-colors">
                                <Calendar className="w-6 h-6" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">Upcoming Holiday</h3>
                            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 backdrop-blur-sm">
                                <p className="font-bold text-white text-base">National Foundation Day</p>
                                <p className="text-sm text-pink-300 mt-1">Friday, 24th December</p>
                                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                                    <Clock className="w-3 h-3" />
                                    <span>Long weekend eligible</span>
                                </div>
                            </div>
                        </div>
                    </PremiumCard>
                </motion.div>

                {/* Detailed Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Attendance */}
                    <motion.div variants={itemVariants}>
                        <PremiumCard className="p-0 overflow-hidden h-full">
                            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                                    Recent Attendance
                                </h2>
                                <PremiumButton size="sm" variant="ghost" onClick={() => navigate('/hr/attendance')}>History</PremiumButton>
                            </div>
                            <div className="p-2">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-800/50 text-slate-400">
                                        <tr>
                                            <th className="px-4 py-3 font-medium rounded-l-lg">Date</th>
                                            <th className="px-4 py-3 font-medium">Timing</th>
                                            <th className="px-4 py-3 font-medium rounded-r-lg text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50">
                                        {myAttendance.length > 0 ? myAttendance.map(rec => (
                                            <tr key={rec.id} className="group hover:bg-slate-800/30 transition-colors">
                                                <td className="px-4 py-3.5 text-slate-300 group-hover:text-white transition-colors">{rec.date}</td>
                                                <td className="px-4 py-3.5 text-slate-500 font-mono text-xs group-hover:text-slate-400">
                                                    {rec.checkIn} - {rec.checkOut}
                                                </td>
                                                <td className="px-4 py-3.5 text-right">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                                        {rec.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="3" className="px-4 py-8 text-center text-slate-500">No recent records found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </PremiumCard>
                    </motion.div>

                    {/* My Requests */}
                    <motion.div variants={itemVariants}>
                        <PremiumCard className="p-0 overflow-hidden h-full flex flex-col">
                            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-400" />
                                    Leave Requests
                                </h2>
                                <PremiumButton size="sm" onClick={() => setIsModalOpen(true)}>New Request</PremiumButton>
                            </div>
                            <div className="p-6 space-y-4 flex-1">
                                {myLeaves.length > 0 ? myLeaves.map(leave => (
                                    <div key={leave.id} className="flex items-center justify-between bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 hover:border-indigo-500/30 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">{leave.type}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${leave.status === 'Approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                leave.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                            }`}>
                                            {leave.status}
                                        </span>
                                    </div>
                                )) : (
                                    <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                                        <FileText className="w-8 h-8 mb-2 opacity-50" />
                                        <p>No active requests</p>
                                    </div>
                                )}
                            </div>
                        </PremiumCard>
                    </motion.div>
                </div>
            </motion.div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 border border-slate-800">
                        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
                            <h3 className="text-lg font-bold text-white">New Leave Request</h3>
                            <button onClick={() => setIsModalOpen(false)} className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmitRequest} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300">Leave Type</label>
                                <select
                                    className="w-full bg-slate-800 border-slate-700 text-white rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={newRequest.type}
                                    onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value })}
                                >
                                    <option value="Sick Leave">Sick Leave</option>
                                    <option value="Vacation">Vacation</option>
                                    <option value="Personal">Personal</option>
                                    <option value="Emergency">Emergency</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300">Start Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-slate-800 border-slate-700 text-white rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                                        value={newRequest.startDate}
                                        onChange={(e) => setNewRequest({ ...newRequest, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300">End Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-slate-800 border-slate-700 text-white rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                                        value={newRequest.endDate}
                                        onChange={(e) => setNewRequest({ ...newRequest, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300">Reason</label>
                                <textarea
                                    className="flex w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]"
                                    placeholder="Please provide a reason..."
                                    required
                                    value={newRequest.reason}
                                    onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-transparent hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={createRequestMutation.isPending}
                                    className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50"
                                >
                                    {createRequestMutation.isPending ? 'Submitting...' : 'Submit Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
