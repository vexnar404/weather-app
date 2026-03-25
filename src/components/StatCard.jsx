import React from 'react';

export default function StatCard({ title, value, unit, icon: Icon, subtitle }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 font-medium text-sm">{title}</h3>
        {Icon && <Icon className="text-blue-500 text-xl" />}
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900">
          {value} <span className="text-lg text-gray-400 font-normal">{unit}</span>
        </p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}