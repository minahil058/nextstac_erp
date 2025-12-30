import xlsx from 'xlsx';

const descriptions = [
    'Client Payment - Project Alpha', 'Office Rent', 'Software Subscription',
    'Consulting Fee', 'Employee Salaries', 'Web Hosting', 'Product Sales',
    'Marketing Campaign', 'Equipment Purchase', 'Service Retainer',
    'Freelancer Payment', 'Utility Bills', 'Insurance Premium',
    'Legal Consultation', 'Cloud Services', 'Travel Expenses',
    'Professional Development', 'Office Supplies', 'Maintenance Fee',
    'Advertising Revenue', 'Partnership Deal', 'Commission Payment'
];

const data = [];

// Generate 1000 entries spanning 12 months
for (let i = 0; i < 1000; i++) {
    // Random date in the last 12 months
    const daysAgo = Math.floor(Math.random() * 365);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    // Random description
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];

    // Random amount - 70% income (positive), 30% expense (negative)
    const isIncome = Math.random() > 0.3;
    const baseAmount = Math.floor(Math.random() * 10000) + 100;
    const amount = isIncome ? baseAmount : -baseAmount;
    const type = isIncome ? 'Income' : 'Expense';

    data.push({
        Date: date.toISOString().split('T')[0],
        Description: `${description} #${i + 1}`,
        Amount: amount,
        Type: type
    });
}

// Sort by date
data.sort((a, b) => new Date(a.Date) - new Date(b.Date));

const wb = xlsx.utils.book_new();
const ws = xlsx.utils.json_to_sheet(data);
xlsx.utils.book_append_sheet(wb, ws, 'Financial Data');

xlsx.writeFile(wb, 'large_financial_data.xlsx');
console.log(`✅ Created large_financial_data.xlsx with ${data.length} entries`);
console.log(`📊 Date range: ${data[0].Date} to ${data[data.length - 1].Date}`);
