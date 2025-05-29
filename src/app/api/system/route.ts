import { NextResponse } from 'next/server';
import { getSystemInfo } from '@/utils/systemMonitor';
import { ServerData } from '@/types/system';
import { isValidServerData } from '@/utils/validation';

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
            return new NextResponse(JSON.stringify(defaultServerData), {
                headers: corsHeaders
            });
        }

        return new NextResponse(JSON.stringify(data), {
            headers: corsHeaders
        });
    } catch (error) {
        console.error('Error fetching system data:', error);
        return new NextResponse(JSON.stringify(defaultServerData), {
            headers: corsHeaders
        });
    }
}

// CORS 헤더
const corsHeaders = {
    'Access-Control-Allow-Origin': 'http://localhost:3000, https://ruthcloud.xyz, https://*.ruthcloud.xyz',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
};

// OPTIONS 메서드 핸들링 (CORS preflight 요청 처리)
export function OPTIONS() {
    return new NextResponse(null, { headers: corsHeaders });
}