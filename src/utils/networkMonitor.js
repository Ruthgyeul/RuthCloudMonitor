import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class NetworkMonitor {
    constructor() {
        this.previousStats = null;
        this.previousTimestamp = null;
    }

    async getNetworkInterface() {
        try {
            // Get the primary network interface on macOS
            const { stdout } = await execAsync('route get 8.8.8.8 | grep interface | awk \'{print $2}\'');
            return stdout.trim();
        } catch {
            return 'en0'; // Default interface on macOS
        }
    }

    async getNetworkStats(interfaceName) {
        try {
            // Get network statistics using netstat on macOS
            const { stdout } = await execAsync(`netstat -ib | grep ${interfaceName}`);
            const stats = stdout.split(/\s+/);
            
            return {
                rxBytes: parseInt(stats[7] || '0'),
                txBytes: parseInt(stats[10] || '0'),
                timestamp: Date.now()
            };
        } catch (error) {
            console.error('Failed to get network stats:', error);
            return {
                rxBytes: 0,
                txBytes: 0,
                timestamp: Date.now()
            };
        }
    }

    async getNetworkSpeed() {
        try {
            const interfaceName = await this.getNetworkInterface();
            const currentStats = await this.getNetworkStats(interfaceName);

            if (!this.previousStats) {
                this.previousStats = currentStats;
                this.previousTimestamp = currentStats.timestamp;
                // Wait a second before measuring speed
                await new Promise(resolve => setTimeout(resolve, 1000));
                return this.getNetworkSpeed();
            }

            const timeDiff = (currentStats.timestamp - this.previousTimestamp) / 1000; // seconds
            const rxDiff = currentStats.rxBytes - this.previousStats.rxBytes;
            const txDiff = currentStats.txBytes - this.previousStats.txBytes;

            const downloadSpeed = (rxDiff / timeDiff) / (1024 * 1024); // MB/s
            const uploadSpeed = (txDiff / timeDiff) / (1024 * 1024); // MB/s

            // Store current values for next measurement
            this.previousStats = currentStats;
            this.previousTimestamp = currentStats.timestamp;

            return {
                download: Math.max(0, downloadSpeed),
                upload: Math.max(0, uploadSpeed),
                interface: interfaceName
            };
        } catch (error) {
            console.error('Network speed measurement error:', error);
            return { download: 0, upload: 0, interface: 'unknown' };
        }
    }

    async getPingLatency(host = '8.8.8.8') {
        try {
            const { stdout } = await execAsync(`ping -c 3 -t 2 ${host} | grep 'avg' | awk -F'/' '{print $5}'`);
            return parseFloat(stdout.trim()) || 0;
        } catch (error) {
            console.error('Ping measurement error:', error);
            return 0;
        }
    }
}

// Singleton instance
const networkMonitor = new NetworkMonitor();

export default networkMonitor;