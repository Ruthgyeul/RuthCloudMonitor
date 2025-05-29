import { ServerData } from '@/types/system';

export function isValidServerData(data: any): data is ServerData {
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