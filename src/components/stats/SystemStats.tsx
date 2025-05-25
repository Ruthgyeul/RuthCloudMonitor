import React from 'react';
import { Clock, Thermometer, Fan, Wifi } from 'lucide-react';
import { ServerData } from '@/types/system';
import { formatNumber } from '@/utils/numberFormat';

interface SystemStatsProps {
    serverData: ServerData;
}

export const SystemStats: React.FC<SystemStatsProps> = ({ serverData }) => {
    return (
        <div className="col-span-1 space-y-3">
            {/* Uptime */}
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 text-green-400 mr-2" />
                    <span className="text-xs text-gray-300">UPTIME</span>
                </div>
                <div className="text-lg font-bold text-white">
                    {serverData.uptime.days}d {serverData.uptime.hours}h
                </div>
                <div className="text-xs text-gray-400">{serverData.uptime.minutes}m</div>
            </div>

            {/* Temperature */}
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center mb-2">
                    <Thermometer className="h-4 w-4 text-orange-400 mr-2" />
                    <span className="text-xs text-gray-300">TEMP</span>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">CPU</span>
                        <span className={`font-mono ${serverData.temperature.cpu > 70 ? 'text-red-400' : serverData.temperature.cpu > 60 ? 'text-yellow-400' : 'text-green-400'}`}>
                            {serverData.temperature.cpu}°C
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">GPU</span>
                        <span className={`font-mono ${serverData.temperature.gpu > 80 ? 'text-red-400' : serverData.temperature.gpu > 70 ? 'text-yellow-400' : 'text-green-400'}`}>
                            {serverData.temperature.gpu}°C
                        </span>
                    </div>
                </div>
            </div>

            {/* Fan Speed */}
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center mb-2">
                    <Fan className="h-4 w-4 text-purple-400 mr-2" />
                    <span className="text-xs text-gray-300">FAN</span>
                </div>
                <div className="text-lg font-bold text-white">{serverData.fan.cpu}</div>
                <div className="text-xs text-gray-400">RPM</div>
            </div>

            {/* Network Info */}
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center mb-2">
                    <Wifi className="h-4 w-4 text-blue-400 mr-2" />
                    <span className="text-xs text-gray-300">NETWORK</span>
                </div>
                <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                        <span className="text-gray-400">↓</span>
                        <span className="text-green-400 font-mono">{formatNumber(serverData.network.download)} MB/s</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">↑</span>
                        <span className="text-blue-400 font-mono">{formatNumber(serverData.network.upload)} MB/s</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">PING</span>
                        <span className="text-yellow-400 font-mono">{formatNumber(serverData.network.ping)} ms</span>
                    </div>
                </div>
            </div>
        </div>
    );
}; 