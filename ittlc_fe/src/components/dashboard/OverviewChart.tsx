import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardStats } from '@/lib/api';

interface OverviewChartProps {
  stats: DashboardStats;
}

const OverviewChart: React.FC<OverviewChartProps> = ({ stats }) => {
  const chartData = [
    {
      name: '성도',
      value: stats.member_count,
      color: '#3B82F6',
    },
    {
      name: '가족',
      value: stats.family_count,
      color: '#10B981',
    },
    {
      name: '기도',
      value: stats.monthly_prayer_count,
      color: '#F59E0B',
    },
    {
      name: '헌금',
      value: Number(stats.monthly_offering_amount),
      color: '#EF4444',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">전체 현황</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                typeof value === 'number' ? value.toLocaleString() : value,
                name
              ]}
            />
            <Bar 
              dataKey="value" 
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OverviewChart; 