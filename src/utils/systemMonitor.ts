import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { ServerData } from '@/types/system';

const execAsync = promisify(exec);

// 캐시된 시스템 정보
let cachedData: ServerData | null = null;
let lastUpdateTime = 0;
const UPDATE_INTERVAL = 1000; // 1초마다 업데이트
let isUpdating = false; // 업데이트 중복 방지

// 시스템 정보 업데이트 함수
export async function updateSystemInfo() {
    if (isUpdating) return cachedData;
    
    try {
        isUpdating = true;
        const scriptPath = path.join(process.cwd(), 'monitor.sh');
        
        // 스크립트 실행 권한 확인 및 설정
        try {
            await execAsync(`chmod +x ${scriptPath}`);
        } catch (error) {
            console.error('Error setting script permissions:', error);
        }
        
        const { stdout } = await execAsync(scriptPath);
        const parsedData = JSON.parse(stdout);
        
        // 데이터 유효성 검사
        if (!isValidServerData(parsedData)) {
            throw new Error('Invalid server data format');
        }
        
        cachedData = parsedData;
        lastUpdateTime = Date.now();
        return cachedData;
    } catch (error) {
        console.error('Error updating system data:', error);
        return null;
    } finally {
        isUpdating = false;
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

// 시스템 정보 가져오기
export async function getSystemInfo(): Promise<ServerData> {
    // 마지막 업데이트로부터 1초가 지났다면 업데이트
    if (Date.now() - lastUpdateTime >= UPDATE_INTERVAL) {
        await updateSystemInfo();
    }
    
    return cachedData || getDefaultServerData();
}

// 기본 서버 데이터
function getDefaultServerData(): ServerData {
    return {
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
} 