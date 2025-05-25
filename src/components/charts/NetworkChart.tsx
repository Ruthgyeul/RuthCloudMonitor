import React from 'react';
import { NetworkHistoryEntry } from '@/types/system';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatNumber } from '@/utils/numberFormat';

interface NetworkChartProps {
    data: NetworkHistoryEntry[];
}

export const NetworkChart: React.FC<NetworkChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="text-xs text-gray-300 mb-2">NETWORK ACTIVITY</div>
                <div className="h-48 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No network data available</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="text-xs text-gray-300 mb-2">NETWORK ACTIVITY</div>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="downloadGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="uploadGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis 
                            dataKey="time" 
                            tick={{ fontSize: 10, fill: '#9ca3af' }}
                            tickFormatter={(value) => value.split(' ')[1]} // 시간만 표시
                        />
                        <YAxis 
                            tick={{ fontSize: 10, fill: '#9ca3af' }}
                            tickFormatter={(value) => `${formatNumber(value)} MB/s`}
                        />
                        <Tooltip 
                            formatter={(value: number) => [`${formatNumber(value)} MB/s`, '']}
                            labelFormatter={(label) => `Time: ${label}`}
                            contentStyle={{ 
                                backgroundColor: '#1f2937',
                                border: '1px solid #374151',
                                borderRadius: '0.375rem',
                                color: '#e5e7eb'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="download"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fill="url(#downloadGradient)"
                            name="Download"
                        />
                        <Area
                            type="monotone"
                            dataKey="upload"
                            stroke="#10b981"
                            strokeWidth={2}
                            fill="url(#uploadGradient)"
                            name="Upload"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}; 