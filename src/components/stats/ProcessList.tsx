import React from 'react';

import { formatNumber } from '@/utils/numberFormat';
import { Process } from '@/types/system';

interface ProcessListProps {
  processes: Process[];
}

export const ProcessList: React.FC<ProcessListProps> = ({ processes }) => {
  // CPU 사용률 기준으로 정렬하고, 사용량이 0인 프로세스는 제외
  const sortedProcesses = processes
    .filter(process => process.cpu > 0 || process.memory > 0)
    .sort((a, b) => b.cpu - a.cpu);

  return (
    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 h-full flex flex-col">
      <div className="text-xs text-gray-300 mb-2">TOP PROCESSES</div>
      
      {/* Column Headers */}
      <div className="flex justify-between items-center text-xs text-gray-400 mb-2 px-1">
        <span className="max-w-[50%]">Name</span>
        <div className="flex items-center space-x-2">
          <span className="text-yellow-400 w-16 text-right">CPU %</span>
          <span className="text-blue-400 w-16 text-right">RAM %</span>
          <span className="text-gray-400 w-16 text-center">Status</span>
        </div>
      </div>

      {/* Scrollable Process List */}
      <div className="space-y-0.5 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700">
        {sortedProcesses.map((process) => (
          <div key={process.id} className="flex justify-between items-center text-xs py-0.5 hover:bg-gray-700/50 rounded px-1">
            <span className="text-gray-400 truncate max-w-[50%]">{process.name}</span>
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400 w-16 text-right">{formatNumber(process.cpu)}%</span>
              <span className="text-blue-400 w-16 text-right">{formatNumber(process.memory)}%</span>
              <span className={`px-1 rounded w-16 text-center ${
                process.status === 'running' ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'
              }`}>
                {process.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 