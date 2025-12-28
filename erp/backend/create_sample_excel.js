import xlsx from 'xlsx';

const data = [
    { Date: '2024-01-05', Description: 'Client Payment - Project Alpha', Amount: 5000, Type: 'Income' },
    { Date: '2024-01-10', Description: 'Office Rent - Jan', Amount: -1200, Type: 'Expense' },
    { Date: '2024-01-15', Description: 'Software Subscription (Adobe)', Amount: -60, Type: 'Expense' },
    { Date: '2024-01-20', Description: 'Consulting Fee - Client B', Amount: 8500, Type: 'Income' },
    { Date: '2024-02-02', Description: 'Employee Salaries', Amount: -4000, Type: 'Expense' },
    { Date: '2024-02-12', Description: 'Web Hosting - Annual', Amount: -200, Type: 'Expense' },
    { Date: '2024-03-05', Description: 'Product Sales - Q1', Amount: 12000, Type: 'Income' },
    { Date: '2024-03-18', Description: 'Marketing Campaign FB', Amount: -1500, Type: 'Expense' },
    { Date: '2024-04-01', Description: 'New Laptop Purchase', Amount: -1100, Type: 'Expense' },
    { Date: '2024-04-15', Description: 'Service Retainer - Client A', Amount: 2000, Type: 'Income' }
];

const wb = xlsx.utils.book_new();
const ws = xlsx.utils.json_to_sheet(data);
xlsx.utils.book_append_sheet(wb, ws, 'Financial Data');

xlsx.writeFile(wb, 'sample_financial_data.xlsx');
console.log('Sample Excel file created: sample_financial_data.xlsx');
