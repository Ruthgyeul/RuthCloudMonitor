import { NextResponse } from 'next/server';
import { getSystemInfo } from '@/utils/systemMonitor';
import { ServerData } from '@/types/system';

// 기본 서버 데이터
const defaultServerData: ServerData = {
    cpu: { usage: 0, cores: 0, temperature: 0 },
    memory: { used: 0, total: 0, percentage: 0 },
    disk: { used: 0, total: 0, percentage: 0 },
    network: { 
        download: 0, 
        upload: 0, 
        ping: 0,
        errorRates: {
            rx: '0',
            tx: '0'
        }
    },
    uptime: { days: 0, hours: 0, minutes: 0 },
    temperature: { cpu: 0, gpu: 0, motherboard: 0 },
    fan: { cpu: 0, case1: 0, case2: 0 },
    processes: []
};

export async function GET() {
    try {
        const data = await getSystemInfo();
        
        // 데이터 유효성 검사
        if (!data || !isValidServerData(data)) {
            console.error('Invalid server data received');
            return NextResponse.json(defaultServerData);
        }
        
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching system data:', error);
        return NextResponse.json(defaultServerData);
    }
}

// 데이터 유효성 검사 함수
function isValidServerData(data: any): data is ServerData {
    return (
        data &&
        typeof data === 'object' &&
        typeof data.cpu === 'object' &&
        typeof data.memory === 'object' &&
        typeof data.disk === 'object' &&
        typeof data.network === 'object' &&
        typeof data.uptime === 'object' &&
        typeof data.temperature === 'object' &&
        typeof data.fan === 'object' &&
        Array.isArray(data.processes)
    );
}