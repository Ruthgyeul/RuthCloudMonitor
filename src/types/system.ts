export interface Process {
    id: number;
    name: string;
    cpu: number;
    memory: number;
    status: 'running' | 'sleeping';
}

// 온도 값 타입
export type TemperatureValue = number | 'N/A';

// x86 아키텍처용 온도 정보
export interface X86TemperatureInfo {
    cpu: TemperatureValue;
    gpu: TemperatureValue;
    motherboard: TemperatureValue;
}

// ARM 아키텍처용 온도 정보
export interface ARMTemperatureInfo {
    cpu: TemperatureValue;
    rp1: TemperatureValue;
    ssd: TemperatureValue;
}

// 온도 정보 (아키텍처별)
export type TemperatureInfo = X86TemperatureInfo | ARMTemperatureInfo;

// 온도 정보 타입 가드
export function isX86TemperatureInfo(temp: TemperatureInfo): temp is X86TemperatureInfo {
    return 'gpu' in temp && 'motherboard' in temp;
}

export function isARMTemperatureInfo(temp: TemperatureInfo): temp is ARMTemperatureInfo {
    return 'rp1' in temp && 'ssd' in temp;
}

export interface ServerData {
    cpu: {
        usage: number;
        cores: number;
        temperature: TemperatureValue;
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
    temperature: TemperatureInfo;
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