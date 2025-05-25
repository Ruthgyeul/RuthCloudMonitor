import React from 'react';
import { Cpu, Activity, HardDrive } from 'lucide-react';
import { ServerData, NetworkHistoryEntry } from '@/types/system';
import { MiniPieChart } from '@/components/charts/MiniPieChart';
import { NetworkChart } from '@/components/charts/NetworkChart';
import { formatNumber } from '@/utils/numberFormat';

interface ResourceUsageProps {
    serverData: ServerData;
    networkHistory: NetworkHistoryEntry[];
}

const getStatusColor = (percentage: number): string => {
    if (percentage < 50) return '#10b981';
    if (percentage < 80) return '#f59e0b';
    return '#ef4444';
};

export const ResourceUsage: React.FC<ResourceUsageProps> = ({ serverData, networkHistory }) => {
    return (
        <div className="col-span-2 space-y-3">
            {/* Resource Usage Cards */}
            <div className="grid grid-cols-3 gap-3 h-32">
                {/* CPU */}
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                            <Cpu className="h-4 w-4 text-blue-400 mr-2" />
                            <span className="text-xs text-gray-300">CPU</span>
                        </div>
                        <span className="text-xs text-gray-400">{serverData.cpu.cores} cores</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <MiniPieChart percentage={serverData.cpu.usage} size={50} />
                        <div className="text-right">
                            <div className="text-xl font-bold" style={{ color: getStatusColor(serverData.cpu.usage) }}>
                                {formatNumber(serverData.cpu.usage)}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Memory */}
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                            <Activity className="h-4 w-4 text-green-400 mr-2" />
                            <span className="text-xs text-gray-300">RAM</span>
                        </div>
                        <span className="text-xs text-gray-400">{serverData.memory.total}GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <MiniPieChart percentage={serverData.memory.percentage} size={50} />
                        <div className="text-right">
                            <div className="text-xl font-bold" style={{ color: getStatusColor(serverData.memory.percentage) }}>
                                {formatNumber(serverData.memory.percentage)}%
                            </div>
                            <div className="text-xs text-gray-400">{serverData.memory.used}GB</div>
                        </div>
                    </div>
                </div>

                {/* Disk */}
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                            <HardDrive className="h-4 w-4 text-yellow-400 mr-2" />
                            <span className="text-xs text-gray-300">DISK</span>
                        </div>
                        <span className="text-xs text-gray-400">{serverData.disk.total}GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <MiniPieChart percentage={serverData.disk.percentage} size={50} />
                        <div className="text-right">
                            <div className="text-xl font-bold" style={{ color: getStatusColor(serverData.disk.percentage) }}>
                                {formatNumber(serverData.disk.percentage)}%
                            </div>
                            <div className="text-xs text-gray-400">{serverData.disk.used}GB</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Network Activity Chart */}
            <NetworkChart data={networkHistory} />

            {/* Big Status Display */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
                <div className="text-4xl font-bold mb-2">
                    <span className={`${serverData.cpu.usage > 80 ? 'text-red-400' : serverData.cpu.usage > 60 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {formatNumber(serverData.cpu.usage)}%
                    </span>
                    <span className="text-gray-500 text-2xl ml-2">CPU</span>
                </div>
                <div className="text-lg">
                    <span className={`${serverData.memory.percentage > 80 ? 'text-red-400' : serverData.memory.percentage > 60 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {formatNumber(serverData.memory.percentage)}%
                    </span>
                    <span className="text-gray-500 ml-1">RAM</span>
                    <span className="mx-4 text-gray-600">•</span>
                    <span className={`${serverData.disk.percentage > 80 ? 'text-red-400' : serverData.disk.percentage > 60 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {formatNumber(serverData.disk.percentage)}%
                    </span>
                    <span className="text-gray-500 ml-1">DISK</span>
                </div>
            </div>
        </div>
    );
}; 