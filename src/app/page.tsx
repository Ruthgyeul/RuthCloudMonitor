"use client";

import React, { useState, useEffect } from 'react';

import { Header } from '@/components/layout/Header';
import { SystemStats } from '@/components/stats/SystemStats';
import { ResourceUsage } from '@/components/stats/ResourceUsage';
import { ProcessList } from '@/components/stats/ProcessList';

import { fetchSystemData } from '@/services/systemService';

import { ServerData, NetworkHistoryEntry } from '@/types/system';

export default function DisplayPage() {
  const [systemData, setSystemData] = useState<ServerData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [networkHistory, setNetworkHistory] = useState<NetworkHistoryEntry[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/system');
        if (!response.ok) {
          throw new Error('Failed to fetch system data');
        }
        const data = await response.json();
        
        // 데이터 유효성 검사
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid data format received');
        }

        // 필수 필드 확인
        const requiredFields = ['cpu', 'memory', 'disk', 'network', 'uptime', 'temperature', 'fan', 'processes'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        setSystemData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching system data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setSystemData(null);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 화면 잠김 방지
    const wakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          await navigator.wakeLock.request('screen');
        }
      } catch (err) {
        console.log('Wake lock failed:', err);
      }
    };
    wakeLock();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold">Error</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!systemData) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600">Loading system data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* CPU Card */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">CPU</h2>
            <p>Usage: {systemData.cpu?.usage?.toFixed(1) ?? 'N/A'}%</p>
            <p>Cores: {systemData.cpu?.cores ?? 'N/A'}</p>
            <p>Temperature: {systemData.cpu?.temperature ?? 'N/A'}°C</p>
          </div>

          {/* Memory Card */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Memory</h2>
            <p>Used: {systemData.memory?.used ? (systemData.memory.used / 1024).toFixed(1) : 'N/A'} GB</p>
            <p>Total: {systemData.memory?.total ? (systemData.memory.total / 1024).toFixed(1) : 'N/A'} GB</p>
            <p>Usage: {systemData.memory?.percentage?.toFixed(1) ?? 'N/A'}%</p>
          </div>

          {/* Disk Card */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Disk</h2>
            <p>Used: {systemData.disk?.used ?? 'N/A'} GB</p>
            <p>Total: {systemData.disk?.total ?? 'N/A'} GB</p>
            <p>Usage: {systemData.disk?.percentage ?? 'N/A'}%</p>
          </div>

          {/* Network Card */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Network</h2>
            <p>Download: {systemData.network?.download?.toFixed(2) ?? 'N/A'} KB/s</p>
            <p>Upload: {systemData.network?.upload?.toFixed(2) ?? 'N/A'} KB/s</p>
            <p>Ping: {systemData.network?.ping ?? 'N/A'} ms</p>
          </div>

          {/* Temperature Card */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Temperature</h2>
            <p>CPU: {systemData.temperature?.cpu ?? 'N/A'}°C</p>
            <p>GPU: {systemData.temperature?.gpu ?? 'N/A'}°C</p>
            <p>Motherboard: {systemData.temperature?.motherboard ?? 'N/A'}°C</p>
          </div>

          {/* Fan Speed Card */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Fan Speed</h2>
            <p>CPU Fan: {systemData.fan?.cpu ?? 'N/A'} RPM</p>
            <p>Case Fan 1: {systemData.fan?.case1 ?? 'N/A'} RPM</p>
            <p>Case Fan 2: {systemData.fan?.case2 ?? 'N/A'} RPM</p>
          </div>

          {/* Uptime Card */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Uptime</h2>
            <p>Days: {systemData.uptime?.days ?? 'N/A'}</p>
            <p>Hours: {systemData.uptime?.hours ?? 'N/A'}</p>
            <p>Minutes: {systemData.uptime?.minutes ?? 'N/A'}</p>
          </div>

          {/* Top Processes Card */}
          <div className="bg-white rounded-lg shadow p-4 col-span-full">
            <h2 className="text-lg font-semibold mb-2">Top Processes</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left">Process</th>
                    <th className="text-right">CPU %</th>
                    <th className="text-right">Memory %</th>
                  </tr>
                </thead>
                <tbody>
                  {systemData.processes?.map((process, index) => (
                    <tr key={index}>
                      <td className="text-left">{process.name ?? 'Unknown'}</td>
                      <td className="text-right">{process.cpu?.toFixed(1) ?? 'N/A'}%</td>
                      <td className="text-right">{process.memory?.toFixed(1) ?? 'N/A'}%</td>
                    </tr>
                  )) ?? (
                    <tr>
                      <td colSpan={3} className="text-center">No process data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}