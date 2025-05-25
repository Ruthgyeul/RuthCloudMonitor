import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import networkMonitor from '@/utils/networkMonitor';

const execAsync = promisify(exec);

async function getCpuInfo() {
    try {
        const { stdout: cpuInfo } = await execAsync('top -bn1 | grep "Cpu(s)" | sed "s/.*, *\\([0-9.]*\\)%* id.*/\\1/" | awk \'{print 100 - $1}\'');
        const { stdout: cpuTemp } = await execAsync('sensors | grep "Package id 0" | awk \'{print $4}\' | sed \'s/+//\' | sed \'s/°C//\'');
        const { stdout: cpuCores } = await execAsync('nproc');
        
        return {
            usage: parseFloat(cpuInfo.trim()),
            temperature: parseFloat(cpuTemp.trim()),
            cores: parseInt(cpuCores.trim())
        };
    } catch (error) {
        console.error('Error getting CPU info:', error);
        return {
            usage: 0,
            temperature: 0,
            cores: 0
        };
    }
}

async function getMemoryInfo() {
    try {
        const { stdout } = await execAsync('free -m | grep Mem');
        const [, total, used] = stdout.split(/\s+/);
        const percentage = (parseInt(used) / parseInt(total)) * 100;
        
        return {
            total: Math.round(parseInt(total) / 1024), // Convert to GB
            used: Math.round(parseInt(used) / 1024), // Convert to GB
            percentage: Math.round(percentage)
        };
    } catch (error) {
        console.error('Error getting memory info:', error);
        return {
            total: 0,
            used: 0,
            percentage: 0
        };
    }
}

async function getDiskInfo() {
    try {
        const { stdout } = await execAsync('df -h / | tail -1');
        const [, total, used, percentage] = stdout.split(/\s+/);
        
        return {
            total: parseInt(total),
            used: parseInt(used),
            percentage: parseInt(percentage.replace('%', ''))
        };
    } catch (error) {
        console.error('Error getting disk info:', error);
        return {
            total: 0,
            used: 0,
            percentage: 0
        };
    }
}

async function getNetworkInfo() {
    try {
        const networkSpeed = await networkMonitor.getNetworkSpeed();
        const ping = await networkMonitor.getPingLatency();
        
        return {
            download: networkSpeed.download,
            upload: networkSpeed.upload,
            ping: ping
        };
    } catch (error) {
        console.error('Error getting network info:', error);
        return {
            download: 0,
            upload: 0,
            ping: 0
        };
    }
}

async function getUptime() {
    try {
        const { stdout } = await execAsync('uptime -p');
        const matches = stdout.match(/(\d+) days?, (\d+) hours?, (\d+) minutes?/);
        
        if (matches) {
            return {
                days: parseInt(matches[1]),
                hours: parseInt(matches[2]),
                minutes: parseInt(matches[3])
            };
        }
        
        return { days: 0, hours: 0, minutes: 0 };
    } catch (error) {
        console.error('Error getting uptime:', error);
        return { days: 0, hours: 0, minutes: 0 };
    }
}

async function getTemperature() {
    try {
        const { stdout: cpuTemp } = await execAsync('sensors | grep "Package id 0" | awk \'{print $4}\' | sed \'s/+//\' | sed \'s/°C//\'');
        let gpuTemp = '0';
        try {
            const { stdout } = await execAsync('nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader,nounits');
            gpuTemp = stdout;
        } catch {
            // GPU not available, use default value
        }
        const { stdout: moboTemp } = await execAsync('sensors | grep "temp1" | awk \'{print $2}\' | sed \'s/+//\' | sed \'s/°C//\'');
        
        return {
            cpu: parseFloat(cpuTemp.trim()),
            gpu: parseFloat(gpuTemp.trim()),
            motherboard: parseFloat(moboTemp.trim())
        };
    } catch (error) {
        console.error('Error getting temperature:', error);
        return {
            cpu: 0,
            gpu: 0,
            motherboard: 0
        };
    }
}

async function getFanSpeed() {
    try {
        const { stdout: cpuFan } = await execAsync('sensors | grep "fan1" | awk \'{print $2}\'');
        const { stdout: caseFan1 } = await execAsync('sensors | grep "fan2" | awk \'{print $2}\'');
        const { stdout: caseFan2 } = await execAsync('sensors | grep "fan3" | awk \'{print $2}\'');
        
        return {
            cpu: parseInt(cpuFan.trim()),
            case1: parseInt(caseFan1.trim()),
            case2: parseInt(caseFan2.trim())
        };
    } catch (error) {
        console.error('Error getting fan speed:', error);
        return {
            cpu: 0,
            case1: 0,
            case2: 0
        };
    }
}

async function getProcesses() {
    try {
        const { stdout } = await execAsync('ps aux --sort=-%cpu | head -n 16 | tail -n 15');
        const processes = stdout.split('\n').map(line => {
            const [, , , , cpu, mem, , , , , name] = line.trim().split(/\s+/);
            return {
                name: name || 'Unknown',
                cpu: parseFloat(cpu),
                memory: parseFloat(mem)
            };
        });
        
        return processes;
    } catch (error) {
        console.error('Error getting processes:', error);
        return [];
    }
}

export async function GET() {
    try {
        const [
            cpu,
            memory,
            disk,
            network,
            uptime,
            temperature,
            fan,
            processes
        ] = await Promise.all([
            getCpuInfo(),
            getMemoryInfo(),
            getDiskInfo(),
            getNetworkInfo(),
            getUptime(),
            getTemperature(),
            getFanSpeed(),
            getProcesses()
        ]);

        return NextResponse.json({
            cpu,
            memory,
            disk,
            network,
            uptime,
            temperature,
            fan,
            processes
        });
    } catch (error) {
        console.error('Error fetching system data:', error);
        return NextResponse.json({
            cpu: { usage: 0, cores: 0, temperature: 0 },
            memory: { used: 0, total: 0, percentage: 0 },
            disk: { used: 0, total: 0, percentage: 0 },
            network: { download: 0, upload: 0, ping: 0 },
            uptime: { days: 0, hours: 0, minutes: 0 },
            temperature: { cpu: 0, gpu: 0, motherboard: 0 },
            fan: { cpu: 0, case1: 0, case2: 0 },
            processes: []
        });
    }
}