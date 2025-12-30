import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';

export default function SalaryHistoryChart({ data }) {
    if (!data || data.length === 0) return null;

    // Process data for the chart: sort by date ascending for the graph
    const chartData = [...data]
        .sort((a, b) => new Date(a.effectiveDate) - new Date(b.effectiveDate))
        .map(item => ({
            date: new Date(item.effectiveDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }),
            amount: item.amount,
            reason: item.reason
        }));

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorSalary" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            borderRadius: '12px',
                            border: '1px solid #334155',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)',
                            color: '#e2e8f0'
                        }}
                        itemStyle={{ color: '#10b981' }}
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Salary']}
                    />
                    <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#10b981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorSalary)"
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#059669', stroke: '#fff' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
