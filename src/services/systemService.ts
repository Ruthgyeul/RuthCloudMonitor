import { ServerData, NetworkHistoryEntry } from '@/types/system';

// 개발 환경에서 사용할 초기 데이터를 저장할 변수
let initialNetworkHistory: NetworkHistoryEntry[] = [];

export const fetchSystemData = async (): Promise<{ serverData: ServerData; networkHistory: NetworkHistoryEntry[] }> => {
    if (process.env.NODE_ENV === 'development') {
        const now = new Date();
        
        // 초기 데이터가 없는 경우 생성
        if (initialNetworkHistory.length === 0) {
            // 60개의 초기 데이터 포인트 생성
            for (let i = 59; i >= 0; i--) {
                const time = new Date(now.getTime() - i * 1000);
                initialNetworkHistory.push({
                    time: time.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    download: Math.random() * 100 + 50,
                    upload: Math.random() * 50 + 20
                });
            }
        }

        // 새로운 데이터 포인트 생성
        const newDataPoint: NetworkHistoryEntry = {
            time: now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            download: Math.random() * 100 + 50,
            upload: Math.random() * 50 + 20
        };

        // 새로운 데이터 포인트를 초기 데이터에 추가하고 60개만 유지
        initialNetworkHistory = [...initialNetworkHistory, newDataPoint].slice(-60);

        return {
            serverData: {
                cpu: {
                    usage: Math.random() * 100,
                    cores: 8,
                    temperature: Math.random() * 30 + 50
                },
                memory: {
                    used: Math.random() * 16 + 4,
                    total: 32,
                    percentage: Math.random() * 100
                },
                disk: {
                    used: Math.random() * 500 + 500,
                    total: 1000,
                    percentage: Math.random() * 100
                },
                network: {
                    download: newDataPoint.download,
                    upload: newDataPoint.upload,
                    ping: Math.random() * 50 + 10
                },
                uptime: {
                    days: Math.floor(Math.random() * 30),
                    hours: Math.floor(Math.random() * 24),
                    minutes: Math.floor(Math.random() * 60)
                },
                temperature: {
                    cpu: Math.random() * 30 + 50,
                    gpu: Math.random() * 20 + 40,
                    motherboard: Math.random() * 10 + 35
                },
                fan: {
                    cpu: Math.random() * 2000 + 1000,
                    case1: Math.random() * 1500 + 800,
                    case2: Math.random() * 1500 + 800
                },
                processes: Array.from({ length: 5 }, (_, i) => ({
                    id: i + 1,
                    name: `Process ${i + 1}`,
                    cpu: Math.random() * 100,
                    memory: Math.random() * 1000,
                    status: Math.random() > 0.5 ? 'running' : 'sleeping'
                }))
            },
            networkHistory: initialNetworkHistory
        };
    }

    // 실제 서버에서 데이터를 가져오는 로직
    try {
        const response = await fetch('/api/system');
        if (!response.ok) {
            throw new Error('Failed to fetch system data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching system data:', error);
        throw error;
    }
}; 