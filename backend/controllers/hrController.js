import dbAdapter from '../dbAdapter.js';
import { v4 as uuidv4 } from 'uuid';

export const getAllEmployees = async (req, res) => {
    try {
        const rows = await dbAdapter.hr.getAllEmployees();
        // Adapter returns rows, which might be snake_case if from Supabase direct select without alias
        // We might need to normalize if the frontend expects camelCase and Supabase returns snake_case
        // But let's check what adapter returns.
        // Adapter.hr.getAllEmployees for Supabase: returns * from employees (snake_case)
        // Adapter.hr.getAllEmployees for SQLite: returns aliased columns (camelCase)

        // We should normalize in the controller to be safe or update adapter to use .select('id, first_name as firstName...')
        // Doing it in adapter is cleaner but string building for select is annoying. 
        // Let's just map it here to be safe and consistent.

        const employees = rows.map(r => ({
            id: r.id,
            firstName: r.first_name || r.firstName,
            lastName: r.last_name || r.lastName,
            email: r.email,
            position: r.position,
            department: r.department_name || r.department,
            salary: r.salary,
            status: r.status,
            avatar: r.avatar_url || r.avatar,
            phone: r.phone,
            address: r.address,
            joinDate: r.join_date || r.joinDate,
            updatedAt: r.updated_at || r.updatedAt
        }));

        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getEmployeeById = async (req, res) => {
    try {
        const row = await dbAdapter.hr.getEmployeeById(req.params.id);
        if (!row) return res.status(404).json({ error: 'Employee not found' });

        const employee = {
            id: row.id,
            firstName: row.first_name || row.firstName,
            lastName: row.last_name || row.lastName,
            email: row.email,
            position: row.position,
            department: row.department_name || row.department,
            salary: row.salary,
            status: row.status,
            avatar: row.avatar_url || row.avatar,
            phone: row.phone,
            address: row.address,
            joinDate: row.join_date || row.joinDate,
            updatedAt: row.updated_at || row.updatedAt
        };
        res.json(employee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createEmployee = async (req, res) => {
    const { firstName, lastName, email, position, department, salary, status, avatar, phone, address } = req.body;
    const id = uuidv4();
    const joinDate = new Date().toISOString();

    const newEmpPayload = { id, firstName, lastName, email, position, department, salary, status: status || 'Active', avatar, phone, address, joinDate };

    try {
        const savedEmp = await dbAdapter.hr.createEmployee(newEmpPayload);
        res.status(201).json(savedEmp);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateEmployee = async (req, res) => {
    // We haven't implemented update in adapter yet, so let's stick to error for now or quick impl
    // For Vercel, this feature will be unavailable until fully migrated. 
    // Allowing fall-through for now or we can add update logic to adapter.
    res.status(501).json({ error: "Update not yet implemented in Vercel mode" });
};

export const deleteEmployee = async (req, res) => {
    res.status(501).json({ error: "Delete not yet implemented in Vercel mode" });
};

// --- Leave Management ---

export const getAllLeaves = async (req, res) => {
    try {
        const rows = await dbAdapter.hr.getAllLeaves();
        const leaves = rows.map(leave => ({
            id: leave.id,
            employeeId: leave.employee_id || leave.employeeId,
            employeeName: leave.employee_name || leave.employeeName,
            department: leave.department,
            type: leave.type,
            startDate: leave.start_date || leave.startDate,
            endDate: leave.end_date || leave.endDate,
            days: Math.ceil((new Date(leave.end_date || leave.endDate) - new Date(leave.start_date || leave.startDate)) / (1000 * 60 * 60 * 24)) + 1,
            reason: leave.reason,
            status: leave.status,
            requestedOn: leave.created_at || leave.createdAt,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(leave.employee_name || leave.employeeName)}&background=random`
        }));
        res.json(leaves);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createLeave = async (req, res) => {
    const { employeeId, employeeName, type, startDate, endDate, reason } = req.body;
    const id = uuidv4();
    const leavePayload = { id, employeeId, employeeName, type, startDate, endDate, reason };

    try {
        await dbAdapter.hr.createLeave(leavePayload);
        res.status(201).json({ id, status: 'Pending', message: 'Leave requested successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateLeaveStatus = (req, res) => {
    res.status(501).json({ error: "Status update not yet implemented in Vercel mode" });
};
