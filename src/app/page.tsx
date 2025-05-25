"use client";

import React, { useState, useEffect } from 'react';

import { Header } from '@/components/layout/Header';
import { SystemStats } from '@/components/stats/SystemStats';
import { ResourceUsage } from '@/components/stats/ResourceUsage';
import { ProcessList } from '@/components/stats/ProcessList';

import { fetchSystemData } from '@/services/systemService';

import { ServerData, NetworkHistoryEntry } from '@/types/system';

export default function DisplayPage() {
  const [serverData, setServerData] = useState<ServerData>({
    cpu: { usage: 0, cores: 0, temperature: 0 },
    memory: { used: 0, total: 0, percentage: 0 },
    disk: { used: 0, total: 0, percentage: 0 },
    network: { download: 0, upload: 0, ping: 0 },
    uptime: { days: 0, hours: 0, minutes: 0 },
    temperature: { cpu: 0, gpu: 0, motherboard: 0 },
    fan: { cpu: 0, case1: 0, case2: 0 },
    processes: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [networkHistory, setNetworkHistory] = useState<NetworkHistoryEntry[]>([]);

  const loadSystemData = async () => {
    try {
      const { serverData: newServerData, networkHistory: newHistory } = await fetchSystemData();
      setServerData(newServerData);

      // 네트워크 히스토리 업데이트 로직 수정
      setNetworkHistory(prev => {
        const now = new Date();

        // 새로운 엔트리 추가
        const updatedHistory = [...prev, {
          time: now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          download: newServerData.network.download,
          upload: newServerData.network.upload
        }];

        // 최대 60개의 데이터 포인트만 유지
        return updatedHistory.slice(-60);
      });

      // 초기 데이터가 없는 경우 서버에서 받은 히스토리 데이터 사용
      if (networkHistory.length === 0 && newHistory.length > 0) {
        setNetworkHistory(newHistory);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching system data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 초기 데이터 로드
    loadSystemData();

    // 시스템 데이터 업데이트 (1초마다)
    const dataInterval = setInterval(loadSystemData, 1000);

    return () => {
      clearInterval(dataInterval);
    };
  }, []);

  // 화면 잠김 방지
  useEffect(() => {
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

  if (loading) {
    return (
      <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400"></div>
          <p className="mt-4 text-white text-lg font-mono">System Loading...</p>
        </div>
      </div>
    );
  }

  return (
      <div className="w-full h-full min-h-screen text-white overflow-hidden font-mono">
        <Header error={error} />

        {/* Main Content */}
        <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <SystemStats serverData={serverData} />
          <ResourceUsage serverData={serverData} networkHistory={networkHistory} />
          <ProcessList processes={serverData.processes} />
        </div>
      </div>
  );
};