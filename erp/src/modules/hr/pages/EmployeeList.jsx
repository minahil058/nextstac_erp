import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockDataService } from '../../../services/mockDataService';
import EmployeeForm from '../components/EmployeeForm';
import {
    Plus,
    Search,
    Filter,
    Mail,
    Trash2,
    X,
    Building2,
    Briefcase
} from 'lucide-react';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';

// UI Components
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../../../components/ui/avatar';

export default function EmployeeList() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const { user } = useAuth(); // Access user role

    // State
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('All Departments');
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: '' });

    // Set initial filter based on role
    useEffect(() => {
        if (user?.role === 'dev_admin') {
            setDepartmentFilter('Development');
        } else if (user?.role === 'ecommerce_admin') {
            setDepartmentFilter('Ecommerce');
        } else {
            setDepartmentFilter('All Departments');
        }
    }, [user]);

    const { data: employees, isLoading, error } = useQuery({
        queryKey: ['employees'],
        queryFn: mockDataService.getEmployees,
    });

    const addEmployeeMutation = useMutation({
        mutationFn: (newEmployee) => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(mockDataService.addEmployee(newEmployee)), 300);
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['employees']);
            setIsFormOpen(false);
            showToast('Employee added successfully', 'success');
        }
    });

    const deleteEmployeeMutation = useMutation({
        mutationFn: (id) => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(mockDataService.deleteEmployee(id)), 300);
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['employees']);
            showToast('Employee deleted successfully', 'success');
            setDeleteModal({ ...deleteModal, isOpen: false });
        }
    });

    const updateEmployeeMutation = useMutation({
        mutationFn: ({ id, updates }) => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(mockDataService.updateEmployee(id, updates)), 300);
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['employees']);
            showToast('Employee status updated', 'success');
        }
    });

    const handleStatusCycle = (employee) => {
        const statusOrder = ['Active', 'On Leave', 'Terminated'];
        const currentIdx = statusOrder.indexOf(employee.status);
        const nextStatus = statusOrder[(currentIdx + 1) % statusOrder.length];

        updateEmployeeMutation.mutate({
            id: employee.id,
            updates: { status: nextStatus }
        });
    };

    // Filter Logic
    const filteredEmployees = employees?.filter(emp => {
        const lowerTerm = searchTerm.toLowerCase();

        // 1. Search Filter (Name, Email, Position/Role, Department)
        const matchesSearch =
            (emp.firstName?.toLowerCase() || '').includes(lowerTerm) ||
            (emp.lastName?.toLowerCase() || '').includes(lowerTerm) ||
            (emp.email?.toLowerCase() || '').includes(lowerTerm) ||
            (emp.position?.toLowerCase() || '').includes(lowerTerm) ||
            (emp.department?.toLowerCase() || '').includes(lowerTerm);

        // 2. Department Filter
        if (departmentFilter === 'All Departments') {
            return matchesSearch;
        }

        const normalize = (str) => (str || '').toLowerCase().trim();
        const matchesDepartment = normalize(emp.department) === normalize(departmentFilter);

        return matchesSearch && matchesDepartment;
    });

    // Pagination Logic
    const totalPages = Math.ceil((filteredEmployees?.length || 0) / ITEMS_PER_PAGE);
    const paginatedEmployees = filteredEmployees?.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Active': return 'success';
            case 'On Leave': return 'warning';
            case 'Terminated': return 'destructive';
            default: return 'neutral';
        }
    };

    if (isLoading) return <div className="p-8 text-center animate-pulse text-slate-500">Loading employees...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error loading data</div>;

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 md:p-8">
            <div className="max-w-[1600px] mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Employees</h2>
                        <p className="text-slate-500 mt-1">Manage your team members and their access.</p>
                    </div>
                    <Button
                        onClick={() => setIsFormOpen(true)}
                        className="w-full sm:w-auto shadow-md"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Employee
                    </Button>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col gap-6">

                    {/* Department Tabs */}
                    {user?.role === 'super_admin' && (
                        <div className="flex p-1 bg-white border border-slate-200 rounded-lg w-full sm:w-fit overflow-x-auto shadow-sm">
                            {['All Departments', 'Development', 'Ecommerce'].map((dept) => (
                                <Button
                                    key={dept}
                                    variant={departmentFilter === dept ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => {
                                        setDepartmentFilter(dept);
                                        setPage(1);
                                    }}
                                    className={`whitespace-nowrap ${departmentFilter === dept ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    {dept}
                                </Button>
                            ))}
                        </div>
                    )}

                    {/* Search & Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search by name, role, or department..."
                                className="pl-9 pr-9"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setPage(1);
                                }}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setPage(1);
                                    }}
                                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <Button variant="outline" className="gap-2">
                            <Filter className="w-4 h-4" />
                            Filters
                        </Button>
                    </div>
                </div>

                {/* Grid View */}
                {filteredEmployees?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {paginatedEmployees?.map((employee) => (
                            <Card key={employee.id} className="group hover:shadow-md transition-shadow duration-200 flex flex-col">
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                        <AvatarImage src={employee.avatar} alt={employee.firstName} />
                                        <AvatarFallback>{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-900 truncate">
                                            {employee.firstName} {employee.lastName}
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium truncate">
                                            {employee.position}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => setDeleteModal({ isOpen: true, id: employee.id, name: `${employee.firstName} ${employee.lastName}` })}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </CardHeader>

                                <CardContent className="flex-1 space-y-3 pb-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                                        <span className="truncate">{employee.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                                        <span className="truncate">{employee.department}</span>
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <div onClick={() => handleStatusCycle(employee)} className="cursor-pointer" title="Click to cycle status">
                                        <Badge variant={getStatusVariant(employee.status)}>
                                            {employee.status}
                                        </Badge>
                                    </div>
                                    <Button variant="link" size="sm" className="h-auto p-0 text-indigo-600" asChild>
                                        <Link to={`/hr/employees/${employee.id}`}>
                                            View Profile →
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="bg-slate-100 p-4 rounded-full mb-4">
                            <Search className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">No employees found</h3>
                        <p className="text-slate-500 max-w-sm mt-2">
                            {departmentFilter !== 'All Departments'
                                ? `No employees found in ${departmentFilter} matching your search.`
                                : "We couldn't find any employees matching your search terms."}
                        </p>
                        <Button
                            variant="outline"
                            className="mt-6"
                            onClick={() => {
                                setSearchTerm('');
                                setDepartmentFilter('All Departments');
                                setPage(1);
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-8 border-t border-slate-200">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <span className="text-sm font-medium text-slate-600 px-2">
                            Page {page} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>

            <EmployeeForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={(data) => addEmployeeMutation.mutate(data)}
            />

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={() => deleteEmployeeMutation.mutate(deleteModal.id)}
                title="Delete Employee?"
                message={`Are you sure you want to remove ${deleteModal.name}? This action cannot be undone.`}
                confirmText="Delete"
                variant="destructive"
            />
        </div>
    );
}
