import React from 'react';
import { Process } from '@/types/system';
import { formatNumber } from '@/utils/numberFormat';

interface ProcessListProps {
  processes: Process[];
}

export const ProcessList: React.FC<ProcessListProps> = ({ processes }) => {
  // CPU 사용률 기준으로 정렬
  const sortedProcesses = processes.sort((a, b) => b.cpu - a.cpu);

  return (
    <div className="bg-gray-800 rounded-lg p-2 border border-gray-700 h-full flex flex-col">
      <div className="text-xs text-gray-300 mb-1">TOP PROCESSES</div>
      
      {/* Column Headers */}
      <div className="flex justify-between items-center text-xs text-gray-400 mb-1 px-1">
        <span className="max-w-[60%]">Process Name</span>
        <div className="flex items-center space-x-2">
          <span className="text-yellow-400">CPU %</span>
          <span className="text-blue-400">RAM %</span>
          <span className="text-gray-400">Status</span>
        </div>
      </div>

      {/* Scrollable Process List */}
      <div className="space-y-1 overflow-y-auto flex-1">
        {sortedProcesses.map((process) => (
          <div key={process.id} className="flex justify-between items-center text-xs">
            <span className="text-gray-400 truncate max-w-[60%]">{process.name}</span>
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400">{formatNumber(process.cpu)}%</span>
              <span className="text-blue-400">{formatNumber(process.memory)}%</span>
              <span className={`px-1 rounded ${
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