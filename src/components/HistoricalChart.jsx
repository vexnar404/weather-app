import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush 
} from 'recharts';
import { format, parseISO } from 'date-fns';

export default function HistoricalChart({ data, title, dataKey, color, unit }) {

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100 text-sm">
          <p className="font-semibold text-gray-700 mb-1">{formatDate(label)}</p>
          <p style={{ color: color }} className="font-bold">
            {payload[0].value} {unit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
      
      <div style={{ width: '100%', height: '350px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`colorHist${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            
            <XAxis 
              dataKey="time" 
              tickFormatter={(tick) => {
                try { return format(parseISO(tick), 'MMM yyyy'); } 
                catch { return tick; }
              }} 
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              minTickGap={50}
            />
            
            <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <Tooltip content={<CustomTooltip />} />
            
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              fillOpacity={1} 
              fill={`url(#colorHist${dataKey})`} 
            />
            
            <Brush 
              dataKey="time" 
              height={30} 
              stroke="#cbd5e1" 
              tickFormatter={() => ''}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}