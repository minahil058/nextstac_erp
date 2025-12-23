-- Database Schema for ERP System
-- Based on current frontend mockDataService.js structure

-- 1. Users & Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Storing hash, not plain text
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'ecommerce_admin', 'dev_admin', 'user')),
    avatar_url TEXT,
    status VARCHAR(20) DEFAULT 'Active',
    share_percentage DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. HR Module
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    head_of_department VARCHAR(255),
    budget DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    position VARCHAR(100),
    department_id UUID REFERENCES departments(id),
    department_name VARCHAR(100), -- Denormalized for easier querying if needed, or rely on join
    salary DECIMAL(15,2),
    join_date DATE,
    status VARCHAR(50) CHECK (status IN ('Active', 'On Leave', 'Terminated')),
    avatar_url TEXT,
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id),
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    status VARCHAR(50) CHECK (status IN ('Present', 'Absent', 'Late', 'Half Day')),
    work_hours VARCHAR(20), -- e.g. "8h 30m" -> prefer storing as minutes/interval in real app
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE salaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id),
    payment_date DATE,
    amount DECIMAL(15,2),
    method VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE leaves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id),
    type VARCHAR(50),
    start_date DATE,
    end_date DATE,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Inventory & Products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100),
    price DECIMAL(15,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 10,
    supplier VARCHAR(255),
    last_updated TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location TEXT,
    capacity INTEGER,
    manager_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Active',
    contact_number VARCHAR(50)
);

CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    type VARCHAR(50) CHECK (type IN ('In', 'Out', 'Adjustment')),
    quantity INTEGER NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reason TEXT,
    reference_code VARCHAR(100)
);

-- 4. Finance Module
CREATE TABLE chart_of_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50), -- Asset, Liability, Equity, Revenue, Expense
    normal_balance VARCHAR(10) CHECK (normal_balance IN ('Debit', 'Credit'))
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    amount DECIMAL(15,2) NOT NULL,
    debit_account_id UUID REFERENCES chart_of_accounts(id),
    credit_account_id UUID REFERENCES chart_of_accounts(id),
    reference VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255), -- Link to customers table in real implementation
    date DATE,
    due_date DATE,
    amount DECIMAL(15,2),
    status VARCHAR(50) CHECK (status IN ('Paid', 'Pending', 'Overdue')),
    items_count INTEGER
);

CREATE TABLE payments ( -- Received payments
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_number VARCHAR(50) UNIQUE,
    invoice_id UUID REFERENCES invoices(id),
    amount DECIMAL(15,2),
    date DATE,
    method VARCHAR(50),
    status VARCHAR(50)
);

CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    rating INTEGER,
    status VARCHAR(50) DEFAULT 'Active'
);

CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_number VARCHAR(50) UNIQUE NOT NULL,
    vendor_id UUID REFERENCES vendors(id),
    date DATE,
    expected_date DATE,
    amount DECIMAL(15,2),
    status VARCHAR(50) CHECK (status IN ('Draft', 'Ordered', 'Received', 'Cancelled'))
);

CREATE TABLE bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_number VARCHAR(50) UNIQUE NOT NULL,
    vendor_id UUID REFERENCES vendors(id),
    date DATE,
    due_date DATE,
    amount DECIMAL(15,2),
    status VARCHAR(50)
);

-- 5. Sales & CRM
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    status VARCHAR(50),
    notes TEXT,
    total_orders INTEGER DEFAULT 0,
    last_order_date TIMESTAMP WITH TIME ZONE
);

CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255),
    company VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    source VARCHAR(100), -- Website, Referral, etc.
    status VARCHAR(50) CHECK (status IN ('New', 'Contacted', 'Qualified', 'Lost')),
    estimated_value DECIMAL(15,2)
);

CREATE TABLE sales_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    date DATE,
    amount DECIMAL(15,2),
    status VARCHAR(50) CHECK (status IN ('Processing', 'Shipped', 'Delivered', 'Cancelled')),
    payment_status VARCHAR(50)
);

-- 6. System & Config
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location TEXT,
    manager_name VARCHAR(255),
    contact VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Active'
);

CREATE TABLE company_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255),
    legal_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    website VARCHAR(255),
    tax_id VARCHAR(50),
    address_json JSONB, -- Storing complex address structure
    settings_json JSONB -- Storing misc config
);

CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    user_name VARCHAR(255), -- Snapshot in case user deleted
    action VARCHAR(255) NOT NULL,
    module VARCHAR(100),
    ip_address VARCHAR(45),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
