import xlsx from 'xlsx';

// Sample data for all sections

const transactions = Array.from({ length: 100 }, (_, i) => ({
    'Date': new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    'Description': `Transaction ${i + 1} - ${['Client Payment', 'Office Expense', 'Software Purchase', 'Service Fee'][Math.floor(Math.random() * 4)]}`,
    'Amount': Math.floor(Math.random() * 10000) * (Math.random() > 0.5 ? 1 : -1),
    'Type': Math.random() > 0.5 ? 'Income' : 'Expense'
}));

const invoices = Array.from({ length: 50 }, (_, i) => ({
    'Invoice Number': `INV-2024-${1001 + i}`,
    'Customer': `Customer ${String.fromCharCode(65 + (i % 26))}`,
    'Date': new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    'Due Date': new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    'Amount': Math.floor(Math.random() * 20000) + 1000,
    'Status': ['Paid', 'Pending', 'Overdue'][Math.floor(Math.random() * 3)]
}));

const payments = Array.from({ length: 40 }, (_, i) => ({
    'Payment Number': `PAY-2024-${2001 + i}`,
    'Vendor': `Vendor ${String.fromCharCode(65 + (i % 15))}`,
    'Amount': Math.floor(Math.random() * 15000) + 500,
    'Date': new Date(Date.now() - Math.random() * 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    'Method': ['Bank Transfer', 'Check', 'Wire Transfer', 'Credit Card'][Math.floor(Math.random() * 4)],
    'Status': ['Completed', 'Pending', 'Processing'][Math.floor(Math.random() * 3)]
}));

const products = Array.from({ length: 75 }, (_, i) => ({
    'Name': `Product ${i + 1} - ${['Widget', 'Gadget', 'Tool', 'Device', 'Component'][Math.floor(Math.random() * 5)]}`,
    'SKU': `SKU-${String(10000 + i).padStart(5, '0')}`,
    'Category': ['Electronics', 'Office Supplies', 'Hardware', 'Software', 'Services'][Math.floor(Math.random() * 5)],
    'Price': Math.floor(Math.random() * 500) + 10,
    'Stock': Math.floor(Math.random() * 200),
    'Min Stock': Math.floor(Math.random() * 20) + 5,
    'Supplier': `Supplier ${String.fromCharCode(65 + (i % 10))}`,
    'Status': Math.random() > 0.1 ? 'Active' : 'Discontinued'
}));

const customers = Array.from({ length: 60 }, (_, i) => ({
    'Name': `${['John', 'Jane', 'Bob', 'Alice', 'Charlie'][i % 5]} ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(i / 5) % 5]}`,
    'Company': `${['Tech', 'Global', 'Innovative', 'Smart', 'Digital'][i % 5]} ${['Solutions', 'Systems', 'Services', 'Corp', 'Industries'][Math.floor(i / 5) % 5]}`,
    'Email': `customer${i + 1}@company.com`,
    'Phone': `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    'Address': `${Math.floor(Math.random() * 9999)} Main St, City, State ${String(Math.floor(Math.random() * 90000) + 10000)}`,
    'Status': Math.random() > 0.2 ? 'Active' : 'Inactive'
}));

const leads = Array.from({ length: 45 }, (_, i) => ({
    'Name': `Lead ${i + 1} - ${['Sarah', 'Mike', 'Emma', 'David'][i % 4]}  ${['Anderson', 'Taylor', 'Thomas'][Math.floor(i / 4) % 3]}`,
    'Company': `${['Future', 'Next', 'Cloud', 'Mega'][i % 4]} ${['Tech', 'Systems', 'Solutions'][Math.floor(i / 4) % 3]}`,
    'Email': `lead${i + 1}@potential.com`,
    'Phone': `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    'Source': ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Trade Show'][Math.floor(Math.random() * 5)],
    'Status': ['New', 'Contacted', 'Qualified', 'Lost'][Math.floor(Math.random() * 4)],
    'Estimated Value': Math.floor(Math.random() * 50000) + 5000
}));

const employees = Array.from({ length: 30 }, (_, i) => ({
    'First Name': ['James', 'Mary', 'Robert', 'Patricia', 'Michael', 'Jennifer'][i % 6],
    'Last Name': ['Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson'][Math.floor(i / 5) % 6],
    'Email': `employee${i + 1}@company.com`,
    'Position': ['Developer', 'Manager', 'Designer', 'Analyst', 'Coordinator'][Math.floor(Math.random() * 5)],
    'Department': ['Web Development', 'E-commerce', 'Marketing', 'Finance'][Math.floor(Math.random() * 4)],
    'Salary': Math.floor(Math.random() * 80000) + 40000,
    'Join Date': new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    'Status': Math.random() > 0.1 ? 'Active' : 'On Leave',
    'Phone': `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    'Address': `${Math.floor(Math.random() * 9999)} Elm St, City, State`
}));

const vendors = Array.from({ length: 25 }, (_, i) => ({
    'Company': `Vendor ${String.fromCharCode(65 + i)} ${['Supplies', 'Materials', 'Services', 'Logistics'][i % 4]}`,
    'Contact Person': `${['Tom', 'Lisa', 'Kevin'][i % 3]} ${['Brown', 'Davis', 'Miller'][Math.floor(i / 3) % 3]}`,
    'Email': `contact@vendor${String.fromCharCode(97 + i)}.com`,
    'Phone': `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    'Address': `${Math.floor(Math.random() * 999)} Industrial Blvd, City, State`,
    'Rating': Math.floor(Math.random() * 3) + 3, // 3-5 stars
    'Status': Math.random() > 0.15 ? 'Active' : 'Inactive'
}));

const purchaseOrders = Array.from({ length: 35 }, (_, i) => ({
    'PO Number': `PO-2024-${3001 + i}`,
    'Vendor': `Vendor ${String.fromCharCode(65 + (i % 25))}`,
    'Date': new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    'Expected Date': new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    'Amount': Math.floor(Math.random() * 30000) + 2000,
    'Status': ['Draft', 'Ordered', 'Received', 'Cancelled'][Math.floor(Math.random() * 4)]
}));

const bills = Array.from({ length: 40 }, (_, i) => ({
    'Bill Number': `BILL-2024-${4001 + i}`,
    'Vendor': `Vendor ${String.fromCharCode(65 + (i % 25))}`,
    'Date': new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    'Due Date': new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    'Amount': Math.floor(Math.random() * 25000) + 1000,
    'Status': ['Pending', 'Paid', 'Overdue'][Math.floor(Math.random() * 3)]
}));

// Create workbook with all sheets
const wb = xlsx.utils.book_new();

xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(transactions), 'Transactions');
xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(invoices), 'Invoices');
xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(payments), 'Payments');
xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(products), 'Products');
xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(customers), 'Customers');
xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(leads), 'Leads');
xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(employees), 'Employees');
xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(vendors), 'Vendors');
xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(purchaseOrders), 'Purchase Orders');
xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(bills), 'Bills');

xlsx.writeFile(wb, 'comprehensive_erp_data.xlsx');

console.log('✅ Created comprehensive_erp_data.xlsx with all sections:');
console.log(`   📊 Transactions: ${transactions.length}`);
console.log(`   📄 Invoices: ${invoices.length}`);
console.log(`   💰 Payments: ${payments.length}`);
console.log(`   📦 Products: ${products.length}`);
console.log(`   👥 Customers: ${customers.length}`);
console.log(`   🎯 Leads: ${leads.length}`);
console.log(`   👨‍💼 Employees: ${employees.length}`);
console.log(`   🏭 Vendors: ${vendors.length}`);
console.log(`   📋 Purchase Orders: ${purchaseOrders.length}`);
console.log(`   🧾 Bills: ${bills.length}`);
console.log(`\n🎉 Total records: ${transactions.length + invoices.length + payments.length + products.length + customers.length + leads.length + employees.length + vendors.length + purchaseOrders.length + bills.length}`);
