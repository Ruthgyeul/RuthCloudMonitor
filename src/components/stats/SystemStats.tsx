import React from 'react';
import { Clock, Thermometer, Fan, Wifi } from 'lucide-react';
import { ServerData } from '@/types/system';
import { formatNumber, formatTemperature } from '@/utils/numberFormat';

interface SystemStatsProps {
    serverData: ServerData;
}

export const SystemStats: React.FC<SystemStatsProps> = ({ serverData }) => {
    const formatTemp = (temp: number | 'N/A'): string => {
        if (temp === 'N/A') return 'N/A';
        return `${formatTemperature(temp)}°C`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Uptime</h3>
                </div>
                <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Days</span>
                        <span className="text-blue-400 font-mono">{serverData.uptime.days}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Hours</span>
                        <span className="text-blue-400 font-mono">{serverData.uptime.hours}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Minutes</span>
                        <span className="text-blue-400 font-mono">{serverData.uptime.minutes}</span>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                    <Thermometer className="w-5 h-5 text-red-400" />
                    <h3 className="text-lg font-semibold text-white">Temperature</h3>
                </div>
                <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                        <span className="text-gray-400">CPU</span>
                        <span className="text-red-400 font-mono">{formatTemp(serverData.temperature.cpu)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">GPU</span>
                        <span className="text-red-400 font-mono">{formatTemp(serverData.temperature.gpu)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">MB</span>
                        <span className="text-red-400 font-mono">{formatTemp(serverData.temperature.motherboard)}</span>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                    <Fan className="w-5 h-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Fan Speed</h3>
                </div>
                <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                        <span className="text-gray-400">CPU</span>
                        <span className="text-green-400 font-mono">{formatNumber(serverData.fan.cpu)} RPM</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Case 1</span>
                        <span className="text-green-400 font-mono">{formatNumber(serverData.fan.case1)} RPM</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Case 2</span>
                        <span className="text-green-400 font-mono">{formatNumber(serverData.fan.case2)} RPM</span>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                    <Wifi className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-white">Network</h3>
                </div>
                <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Download</span>
                        <span className="text-blue-400 font-mono">{formatNumber(serverData.network.download)} KB/s</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Upload</span>
                        <span className="text-green-400 font-mono">{formatNumber(serverData.network.upload)} KB/s</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">PING</span>
                        <span className="text-yellow-400 font-mono">{formatNumber(serverData.network.ping)} ms</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">ERR</span>
                        <span className="text-red-400 font-mono">RX:{serverData.network.errorRates.rx}% TX:{serverData.network.errorRates.tx}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}; 