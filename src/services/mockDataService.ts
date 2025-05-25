import { ServerData } from '@/types/system';

export const generateMockData = (): ServerData => {
    return {
        cpu: {
            usage: Math.random() * 100,
            cores: 8,
            temperature: 45 + Math.random() * 20
        },
        memory: {
            used: Math.random() * 16 * 1024,
            total: 16 * 1024,
            percentage: Math.random() * 100
        },
        disk: {
            used: Math.random() * 1000 * 1024,
            total: 1000 * 1024,
            percentage: Math.random() * 100
        },
        network: {
            download: Math.random() * 100,
            upload: Math.random() * 50,
            ping: Math.random() * 50,
            errorRates: {
                rx: (Math.random() * 0.1).toFixed(2),
                tx: (Math.random() * 0.1).toFixed(2)
            }
        },
        uptime: {
            days: Math.floor(Math.random() * 30),
            hours: Math.floor(Math.random() * 24),
            minutes: Math.floor(Math.random() * 60)
        },
        temperature: {
            cpu: 45 + Math.random() * 20,
            gpu: 50 + Math.random() * 30,
            motherboard: 35 + Math.random() * 15
        },
        fan: {
            cpu: Math.floor(Math.random() * 2000),
            case1: Math.floor(Math.random() * 1500),
            case2: Math.floor(Math.random() * 1500)
        },
        processes: Array.from({ length: 5 }, (_, i) => ({
            id: i + 1,
            name: `Process ${i + 1}`,
            cpu: Math.random() * 100,
            memory: Math.random() * 1024,
            status: Math.random() > 0.5 ? 'running' : 'sleeping'
        }))
    };
}; 