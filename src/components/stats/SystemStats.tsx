import React from 'react';
import { Clock, Thermometer, Fan, Wifi } from 'lucide-react';
import { ServerData, X86TemperatureInfo, ARMTemperatureInfo, isX86TemperatureInfo } from '@/types/system';
import { formatNumber, formatTemperature } from '@/utils/numberFormat';

interface SystemStatsProps {
    serverData: ServerData;
}

export const SystemStats: React.FC<SystemStatsProps> = ({ serverData }) => {
    const formatTemp = (temp: number | 'N/A') => {
        if (temp === 'N/A') return 'N/A';
        return `${temp.toFixed(1)}°C`;
    };

    const getTempColor = (temp: number | 'N/A') => {
        if (temp === 'N/A') return 'text-gray-400';
        if (temp <= 50) return 'text-green-400';
        if (temp <= 65) return 'text-yellow-400';
        if (temp <= 74) return 'text-orange-400';
        return 'text-red-400';
    };

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
                    <div className="flex justify-between gap-2">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-sm text-gray-400">CPU</span>
                        </div>
                        <span className={`text-sm font-medium ${getTempColor(serverData.temperature.cpu)}`}>
                            {formatTemp(serverData.temperature.cpu)}
                        </span>
                    </div>
                    {isX86TemperatureInfo(serverData.temperature) ? (
                        <>
                            <div className="flex justify-between gap-2">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <span className="text-sm text-gray-400">GPU</span>
                                </div>
                                <span className={`text-sm font-medium ${getTempColor(serverData.temperature.gpu)}`}>
                                    {formatTemp(serverData.temperature.gpu)}
                                </span>
                            </div>
                            <div className="flex justify-between gap-2">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                                    <span className="text-sm text-gray-400">MB</span>
                                </div>
                                <span className={`text-sm font-medium ${getTempColor(serverData.temperature.motherboard)}`}>
                                    {formatTemp(serverData.temperature.motherboard)}
                                </span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-between gap-2">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <span className="text-sm text-gray-400">RP1</span>
                                </div>
                                <span className={`text-sm font-medium ${getTempColor(serverData.temperature.rp1)}`}>
                                    {formatTemp(serverData.temperature.rp1)}
                                </span>
                            </div>
                            <div className="flex justify-between gap-2">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                                    <span className="text-sm text-gray-400">SSD</span>
                                </div>
                                <span className={`text-sm font-medium ${getTempColor(serverData.temperature.ssd)}`}>
                                    {formatTemp(serverData.temperature.ssd)}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Fan Speed */}
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center mb-2">
                    <Fan className="h-4 w-4 text-purple-400 mr-2" />
                    <span className="text-xs text-gray-300">FAN</span>
                </div>
                <div className="text-lg font-bold text-white">{formatNumber(serverData.fan.cpu)}</div>
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