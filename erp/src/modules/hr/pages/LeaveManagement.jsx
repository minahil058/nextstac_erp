

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../context/AuthContext';
import {
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    Download,
    Search,
    Filter,
    Plus,
    X
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../../../components/ui/avatar';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function LeaveManagement() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRequest, setNewRequest] = useState({
        type: 'Sick Leave',
        startDate: '',
        endDate: '',
        reason: ''
    });

    // Fetch Leaves
    const { data: leaves, isLoading } = useQuery({
        queryKey: ['leaves-all'],
        queryFn: async () => {
            const baseUrl = import.meta.env.VITE_API_URL || '/api';
            const response = await fetch(`${baseUrl}/hr/leaves`);
            if (!response.ok) throw new Error('Failed to fetch leaves');
            return response.json();
        },
    });

    // Update Request Status (Admin)
    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            const baseUrl = import.meta.env.VITE_API_URL || '/api';
            const response = await fetch(`${baseUrl}/hr/leaves/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (!response.ok) throw new Error('Failed to update status');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['leaves-all']);
        }
    });

    // Create New Request (Employee)
    const createRequestMutation = useMutation({
        mutationFn: async (requestData) => {
            const baseUrl = import.meta.env.VITE_API_URL || '/api';
            const response = await fetch(`${baseUrl}/hr/leaves`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    employeeId: user.id,
                    employeeName: user.name,
                    department: user.department, // Send Department
                    ...requestData
                }),
            });
            if (!response.ok) throw new Error('Failed to create request');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['leaves-all']);
            setIsModalOpen(false);
            setNewRequest({ type: 'Sick Leave', startDate: '', endDate: '', reason: '' }); // Reset form
        }
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');

    const handleAction = (id, status) => {
        updateStatusMutation.mutate({ id, status });
    };

    const handleSubmitRequest = (e) => {
        e.preventDefault();
        createRequestMutation.mutate(newRequest);
    };

    const handleExport = () => {
        if (!leaves || leaves.length === 0) return;

        const headers = ['Employee', 'Type', 'Start Date', 'End Date', 'Days', 'Reason', 'Status', 'Requested On'];
        const csvContent = [
            headers.join(','),
            ...filteredLeaves.map(leave => [
                `"${leave.employeeName}"`,
                leave.type,
                leave.startDate.split('T')[0],
                leave.endDate.split('T')[0],
                leave.days,
                `"${leave.reason}"`,
                leave.status,
                leave.requestedOn.split('T')[0]
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `leave_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredLeaves = leaves?.filter(leave => {
        // Implement Search & Filter
        const matchesSearch = leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || leave.status === statusFilter;
        const matchesType = typeFilter === 'All' || leave.type === typeFilter;

        // Implement Role-Based Access Control
        // 1. Super Admin: Sees EVERYTHING.
        // 2. E-com Admin: Sees ONLY E-commerce department.
        // 3. Dev Admin: Sees ONLY Web Development department.
        // 4. Employee: Sees ONLY their own requests.

        let isAuthorized = false;

        if (user?.role === 'super_admin') {
            isAuthorized = true; // Super Admin sees all
        } else if (user?.role === 'ecommerce_admin') {
            isAuthorized = leave.department === 'E-commerce';
        } else if (user?.role === 'dev_admin') {
            isAuthorized = leave.department === 'Web Development';
        } else {
            // Regular User / Employee
            isAuthorized = leave.employeeId === user?.id;
        }

        return matchesSearch && matchesStatus && matchesType && isAuthorized;
    });

    if (isLoading) return <div className="p-8 text-center animate-pulse text-slate-500">Loading leave requests...</div>;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Approved':
                return <Badge variant="success" className="gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Approved</Badge>;
            case 'Rejected':
                return <Badge variant="destructive" className="gap-1.5"><XCircle className="w-3.5 h-3.5" /> Rejected</Badge>;
            case 'Pending':
                return <Badge variant="warning" className="gap-1.5"><Clock className="w-3.5 h-3.5" /> Pending</Badge>;
            default: return null;
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-white">
                        Leave Management
                    </h2>
                    <p className="text-slate-400 mt-2 text-lg">Track and manage employee leave requests.</p>
                </div>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto shadow-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0 rounded-2xl px-6 py-6 h-auto font-bold text-base transition-all hover:scale-105"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    New Request
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-3xl border border-slate-700/50 shadow-xl relative z-50">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        <Input
                            placeholder="Search employees..."
                            className="pl-12 pr-4 py-6 rounded-2xl bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px] h-auto py-3.5 rounded-2xl bg-slate-800/50 border-slate-700/50 text-white focus:ring-indigo-500/20">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-indigo-400" />
                                    <SelectValue placeholder="Status" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700 text-slate-300 rounded-xl z-[100]">
                                <SelectItem value="All">All Status</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Approved">Approved</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-full sm:w-[180px] h-auto py-3.5 rounded-2xl bg-slate-800/50 border-slate-700/50 text-white focus:ring-indigo-500/20">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-pink-400" />
                                    <SelectValue placeholder="Type" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700 text-slate-300 rounded-xl z-[100]">
                                <SelectItem value="All">All Types</SelectItem>
                                <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                                <SelectItem value="Vacation">Vacation</SelectItem>
                                <SelectItem value="Personal">Personal</SelectItem>
                                <SelectItem value="Emergency">Emergency</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-xl overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-800/80">
                        <TableRow className="border-slate-700/50 hover:bg-transparent">
                            <TableHead className="text-slate-300 font-bold">Employee</TableHead>
                            <TableHead className="text-slate-300 font-bold">Type</TableHead>
                            <TableHead className="text-slate-300 font-bold">Duration</TableHead>
                            <TableHead className="text-slate-300 font-bold">Days</TableHead>
                            <TableHead className="text-slate-300 font-bold">Status</TableHead>
                            <TableHead className="text-right text-slate-300 font-bold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                                    Loading leave requests...
                                </TableCell>
                            </TableRow>
                        ) : filteredLeaves.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                                    No leave requests found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredLeaves.map((request) => (
                                <TableRow key={request.id} className="border-slate-700/50 hover:bg-slate-700/30 transition-colors group">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 border border-slate-600/50 shadow-sm">
                                                <AvatarImage src={request.avatar} />
                                                <AvatarFallback className="bg-slate-700 text-slate-300">{request.employeeName[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-semibold text-white">{request.employeeName}</div>
                                                <div className="text-xs text-slate-400">{request.position || 'Employee'}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-700/50 text-slate-300 border border-slate-600/50">
                                            {request.type}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-white font-medium">{request.days} Days</div>
                                        <div className="text-xs text-slate-400">
                                            {formatDate(request.startDate)} - {formatDate(request.endDate)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-slate-400 max-w-[200px] truncate" title={request.reason}>
                                            {request.reason}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(request.status)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {user?.role !== 'user' && ( // Only Admins can take actions
                                            <div className="flex justify-end gap-2">
                                                {(request.status === 'Pending' || request.status === 'Rejected') && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleAction(request.id, 'Approved')}
                                                        className="h-8 w-8 text-slate-400 hover:text-green-600 hover:bg-green-50"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </Button>
                                                )}
                                                {(request.status === 'Pending' || request.status === 'Approved') && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleAction(request.id, 'Rejected')}
                                                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {filteredLeaves?.length > 0 ? (
                    filteredLeaves.map((request) => (
                        <Card key={request.id} className="shadow-lg bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
                            <CardContent className="p-4 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <div className="font-bold text-white">{request.employeeName}</div>
                                            <div className="text-xs text-slate-400">Employee</div>
                                        </div>
                                    </div>
                                    {getStatusBadge(request.status)}
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <p className="text-xs text-slate-500 font-semibold mb-1">Type</p>
                                        <p className="text-slate-300 font-medium">{request.type}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-semibold mb-1">Duration</p>
                                        <p className="text-slate-300 font-medium">{request.days} Days</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="p-8 text-center text-slate-400 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        No leave requests found.
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 border border-slate-800">
                        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
                            <h3 className="text-lg font-bold text-white">New Leave Request</h3>
                            <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="h-8 w-8 rounded-full text-slate-400 hover:text-white hover:bg-slate-800">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <form onSubmit={handleSubmitRequest} className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300">Leave Type</label>
                                <Select
                                    value={newRequest.type}
                                    onValueChange={(val) => setNewRequest({ ...newRequest, type: val })}
                                >
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:ring-indigo-500/50">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700 text-slate-300">
                                        <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                                        <SelectItem value="Vacation">Vacation</SelectItem>
                                        <SelectItem value="Personal">Personal</SelectItem>
                                        <SelectItem value="Emergency">Emergency</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300">Start Date</label>
                                    <Input
                                        type="date"
                                        required
                                        className="bg-slate-800 border-slate-700 text-white focus-visible:ring-indigo-500/50"
                                        value={newRequest.startDate}
                                        onChange={(e) => setNewRequest({ ...newRequest, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300">End Date</label>
                                    <Input
                                        type="date"
                                        required
                                        className="bg-slate-800 border-slate-700 text-white focus-visible:ring-indigo-500/50"
                                        value={newRequest.endDate}
                                        onChange={(e) => setNewRequest({ ...newRequest, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300">Reason</label>
                                <textarea
                                    className="flex w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm ring-offset-slate-900 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 min-h-[100px] text-white"
                                    placeholder="Please provide a reason for your leave request..."
                                    required
                                    value={newRequest.reason}
                                    onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">Cancel</Button>
                                <Button type="submit" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg border-0">Submit Request</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
