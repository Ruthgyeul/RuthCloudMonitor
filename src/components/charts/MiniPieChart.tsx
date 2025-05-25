import React from 'react';

interface MiniPieChartProps {
    percentage: number;
    size: number;
}

export const MiniPieChart: React.FC<MiniPieChartProps> = ({ percentage, size }) => {
    const radius = size / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle
                cx={radius}
                cy={radius}
                r={radius - 2}
                fill="none"
                stroke="#374151"
                strokeWidth="4"
            />
            <circle
                cx={radius}
                cy={radius}
                r={radius - 2}
                fill="none"
                stroke={percentage > 80 ? '#ef4444' : percentage > 60 ? '#f59e0b' : '#10b981'}
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(-90 ${radius} ${radius})`}
            />
        </svg>
    );
}; 