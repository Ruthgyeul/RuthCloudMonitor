export interface Process {
    id: number;
    name: string;
    cpu: number;
    memory: number;
    status: 'running' | 'sleeping';
}

export interface ServerData {
    cpu: {
        usage: number;
        cores: number;
        temperature: number | 'N/A';
    };
    memory: {
        used: number;
        total: number;
        percentage: number;
    };
    disk: {
        used: number;
        total: number;
        percentage: number;
    };
    network: {
        download: number;
        upload: number;
        ping: number;
        errorRates: {
            rx: string;
            tx: string;
        };
    };
    uptime: {
        days: number;
        hours: number;
        minutes: number;
    };
    temperature: {
        cpu: number | 'N/A';
        gpu: number | 'N/A';
        motherboard: number | 'N/A';
    };
    fan: {
        cpu: number;
        case1: number;
        case2: number;
    };
    processes: Process[];
}

export interface NetworkHistoryEntry {
    time: string;
    download: number;
    upload: number;
} 