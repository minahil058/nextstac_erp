import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockDataService } from '../../../services/mockDataService';
import EmployeeForm from '../components/EmployeeForm';
import SalaryHistoryChart from '../components/SalaryHistoryChart';
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Calendar,
    DollarSign,
    User,
    Edit
} from 'lucide-react';


export default function EmployeeDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isEditOpen, setIsEditOpen] = useState(false);

    const { data: employees, isLoading } = useQuery({
        queryKey: ['employees'],
        queryFn: mockDataService.getEmployees,
    });

    const updateEmployeeMutation = useMutation({
        mutationFn: (data) => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(mockDataService.updateEmployee(id, data)), 300);
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['employees']);
            setIsEditOpen(false);
        }
    });

    const employee = employees?.find(e => e.id === id);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center text-slate-500 animate-pulse">Loading profile...</div>;
    if (!employee) return <div className="min-h-screen flex items-center justify-center text-slate-500">Employee not found</div>;

    return (
        <div className="pb-12">

            {/* Top Navigation Bar */}
            <div className="bg-slate-900/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/hr/employees')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium text-sm group"
                    >
                        <div className="p-2 rounded-full bg-slate-800/50 group-hover:bg-slate-700 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        Back to List
                    </button>
                    <button
                        onClick={() => setIsEditOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-800/50 border border-slate-700/50 text-white hover:bg-slate-700 hover:text-white rounded-2xl text-sm font-bold transition-all shadow-lg hover:shadow-indigo-500/20 hover:scale-105"
                    >
                        <Edit className="w-4 h-4" />
                        Edit Profile
                    </button>
                </div>
            </div>

            <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 mt-4">

                {/* Header Card */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/50 overflow-hidden relative">
                    <div className="h-32 md:h-48 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 opacity-90"></div>
                    <div className="px-6 md:px-8 pb-8">
                        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end -mt-12 md:-mt-16 mb-6 gap-4">
                            <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-6">
                                <img
                                    src={employee.avatar}
                                    alt={employee.firstName}
                                    className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-slate-800 shadow-2xl bg-slate-800 object-cover"
                                />
                                <div className="mb-1">
                                    <h1 className="text-2xl md:text-3xl font-black text-white">{employee.firstName} {employee.lastName}</h1>
                                    <p className="text-slate-400 font-medium text-lg">{employee.position}</p>
                                </div>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide ${employee.status === 'Active'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                }`}>
                                {employee.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 border-t border-slate-700/50 pt-8">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Contact Information</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-slate-300 group">
                                        <div className="p-2.5 bg-slate-700/50 rounded-xl group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium">{employee.email}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-300 group">
                                        <div className="p-2.5 bg-slate-700/50 rounded-xl group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium">{employee.phone || 'No phone provided'}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-300 group">
                                        <div className="p-2.5 bg-slate-700/50 rounded-xl group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium">{employee.address || 'No address provided'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Employment Details</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-slate-300 group">
                                        <div className="p-2.5 bg-slate-700/50 rounded-xl group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors">
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium">{employee.department}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-300 group">
                                        <div className="p-2.5 bg-slate-700/50 rounded-xl group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium">Joined {new Date(employee.joinDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-300 group">
                                        <div className="p-2.5 bg-slate-700/50 rounded-xl group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors">
                                            <DollarSign className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium">${parseInt(employee.salary).toLocaleString()}/yr</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-700/50">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Salary History</h3>

                            <SalaryHistoryChart employeeId={id} />
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <div className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-3xl border border-slate-700/50 shadow-xl hover:border-blue-500/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl group-hover:bg-blue-500/20 transition-colors">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20">Good</span>
                        </div>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Attendance Rate</p>
                        <h4 className="text-3xl font-black text-white mt-1">98.5%</h4>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-3xl border border-slate-700/50 shadow-xl hover:border-amber-500/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl group-hover:bg-amber-500/20 transition-colors">
                                <User className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Leave Balance</p>
                        <h4 className="text-3xl font-black text-white mt-1">12 Days</h4>
                    </div>

                    <div className="bg-slate-800/20 p-6 rounded-3xl border-2 border-slate-700/50 border-dashed flex flex-col items-center justify-center text-slate-500 font-bold text-sm min-h-[160px]">
                        <div className="w-10 h-10 bg-slate-800/50 rounded-full flex items-center justify-center mb-3">
                            <DollarSign className="w-5 h-5 opacity-50" />
                        </div>
                        More metrics coming soon
                    </div>
                </div>
            </div>

            <EmployeeForm
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                initialData={employee}
                onSubmit={(data) => updateEmployeeMutation.mutate(data)}
            />
        </div>
    );
}
